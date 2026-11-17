/**
 * Copyright 2021, Yahoo Inc.
 * Copyrights licensed under the BSD License. See the accompanying LICENSE file for terms.
 *
 * Usage:
 *   <GridStack
 *      @options={{hash animate=true}}
 *      @onDragstart={{this.dragStart}}
 *      @onDragstop={{this.dragStop}}
 *      @onResizestart={{this.resizeStart}}
 *      @onResizestop={{this.resizeStop}}
 *      @onAdded={{this.added}}
 *      @onChange={{this.change}}
 *      @onEnable={{this.enable}}
 *      @onRemoved={{this.remove}}
 *      as |grid|
 *   />
 *
 * Full list of options:
 *   https://github.com/gridstack/gridstack.js/tree/master/doc#grid-options
 */
import 'gridstack/dist/gridstack.css';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { next, schedule } from '@ember/runloop';
import { GridStack } from 'gridstack';
import lifecycle from '../utils/lifecycle.js';
import { patchTrashOverlap } from '../utils/trash-overlap.js';
import GridStackItem from './grid-stack-item.gjs';
import GridStackLayout from './grid-stack-layout.gjs';
import {
  gridForElement,
  itemForElement,
  registry,
  registerGridElement,
  unregisterGridElement,
} from '../utils/grid-elements.js';

import { GRID_STACK_EVENTS, capitalize } from '../utils/events.js';
import {
  WARN_NEEDS_ID,
  WARN_NO_HANDLER,
  WARN_NOT_RENDERED,
  departing,
  dropWarn,
  incoming,
} from '../utils/cross-grid.js';
import { applyItemAttributes } from '../modifiers/gs-item-attributes.js';

export { GRID_STACK_EVENTS, capitalize };

/**
 * Options gridstack's `updateOptions()` cannot apply; changing any of these, or
 * removing any option, destroys and re-creates the GridStack instance.
 */
export const REINIT_OPTIONS = [
  'alwaysShowResizeHandle',
  'draggable',
  'handle',
  'handleClass',
  'itemClass',
  'layout',
  'placeholderClass',
  'placeholderText',
  'resizable',
  'removable',
  'children',
  'disableOneColumnMode',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'marginUnit',
];

const sameOption = (a, b) =>
  a === b ||
  (typeof a === 'object' &&
    typeof b === 'object' &&
    a !== null &&
    b !== null &&
    JSON.stringify(a) === JSON.stringify(b));

export default class GridStackComponent extends Component {
  @tracked elm;

  constructor() {
    super(...arguments);
    const grid = this;
    this.Item = <template>
      <GridStackItem
        @grid={{grid}}
        @options={{@options}}
        ...attributes
        as |item|
      >
        {{yield item}}
      </GridStackItem>
    </template>;
  }

  get options() {
    return {
      ...this.args.options,
    };
  }

  /**
   * https://github.com/gridstack/gridstack.js/tree/master/doc#api
   * @property {GridStack|null} gridStack - reference to gridstack object
   */
  gridStack = null;

  /**
   * @property {Array} subscribedEvents - List of events for which event handlers were set up
   */
  subscribedEvents = [];

  _destroyGridStack() {
    const { gridStack } = this;

    if (gridStack) {
      this.subscribedEvents.forEach((eventName) => gridStack.off(eventName));
      this.subscribedEvents = [];

      // Use `false` option to prevent removing dom elements, let Ember do that
      gridStack.destroy(false);

      this.gridStack = null;

      // Remove 'grid-stack-instance-####' class left behind
      [...this.elm.classList]
        .filter((x) => /grid-stack-instance-\d*/.test(x))
        .forEach((x) => this.elm.classList.remove(x));
    }
  }

  // one stable function: a new one per update would make `sameOption` re-init
  _accept = (el) => {
    const option = this.args.options?.acceptWidgets;
    let ok;
    if (typeof option === 'function') ok = option(el);
    else if (option === true) ok = el.matches('.grid-stack-item');
    else ok = Boolean(option) && el.matches(option);
    if (!ok) return false;
    if (!this.args.onDropped) {
      if (!this._warnedNoHandler) {
        this._warnedNoHandler = true;
        dropWarn(
          'A <GridStack> with `acceptWidgets` needs `@onDropped` to accept drops; the drop was refused.',
          WARN_NO_HANDLER,
        );
      }
      return false;
    }
    const node = el.gridstackNode;
    if (node?.grid && node.id === undefined) {
      if (!this._warnedNoId) {
        this._warnedNoId = true;
        dropWarn(
          'A <GridStackItem> needs `@options.id` to move to another grid; the drop was refused.',
          WARN_NEEDS_ID,
        );
      }
      return false;
    }
    return true;
  };

  _createGridStack() {
    this._appliedOptions = this.options;
    const init = { ...this._appliedOptions };
    if (init.acceptWidgets) init.acceptWidgets = this._accept;
    if (init.removable) patchTrashOverlap();
    this.gridStack = GridStack.init(init, this.elm);

    // Glimmer owns the DOM order; gridstack's re-sorting would desync {{#each}}
    if (typeof this.gridStack._sortDom === 'function') {
      this.gridStack._sortDom = function () {
        return this;
      };
    }

    // Glimmer owns the DOM: trash drops must not remove the element
    const removeWidget = this.gridStack.removeWidget;
    this._removeWidget = removeWidget;
    this.gridStack.removeWidget = function (els, removeDOM, triggerEvent) {
      return removeWidget.call(this, els, false, triggerEvent);
    };

    // resolve @on* at fire time so changed handlers need no re-init
    GRID_STACK_EVENTS.forEach((eventName) => {
      const argName = `on${capitalize(eventName)}`;
      const gridStack = this.gridStack;

      gridStack.on(eventName, (...args) => {
        if (eventName === 'removed') this._markDeparting(args[1]);
        const claim =
          eventName === 'dropped' ? this._claimDrop(args[1], args[2]) : null;
        const action = this.args[argName];
        if (claim) {
          schedule('afterRender', () => {
            try {
              action?.apply(gridStack, args);
            } finally {
              this._finishDrop(claim);
            }
          });
        } else if (action) {
          schedule('afterRender', gridStack, action, ...args);
        }
      });

      this.subscribedEvents.push(eventName);
    });
  }

  /** drop position per item id, applied when the target renders that item */
  _placements = new Map();

  // Sync, before the target grid moves `el` out: mark its spot so the element
  // can go back there before Glimmer clears this grid's row.
  _markDeparting(nodes) {
    nodes?.forEach(({ el }) => {
      if (!el || el.parentElement !== this.elm || departing.has(el)) return;
      const placeholder = document.createComment('gs-moved');
      el.before(placeholder);
      const entry = { grid: this, placeholder };
      departing.set(el, entry);
      schedule('afterRender', () => {
        if (entry.claimed || departing.get(el) !== entry) return;
        departing.delete(el);
        placeholder.remove();
      });
    });
  }

  // Sync in the target's `dropped`: the source item is still alive here.
  _claimDrop(previousNode, newNode) {
    const el = newNode?.el;
    if (!el) return null;
    const { id, x, y, w, h } = newNode;
    if (id !== undefined) this._placements.set(id, { x, y, w, h });
    const claim = { el, id, previousNode, count: this._itemCount(el) };
    if (previousNode) {
      claim.entry = departing.get(el);
      if (claim.entry) claim.entry.claimed = true;
      claim.incoming = {
        grid: claim.entry?.grid ?? gridForElement(previousNode.grid?.el),
        state: itemForElement(el)?._runBeforeRemove(),
      };
      incoming.set(id, claim.incoming);
    }
    this.gridStack.removeWidget(el, false, false);
    return claim;
  }

  _itemCount(except) {
    return [...(this.elm?.children ?? [])].filter(
      (c) => c !== except && c.classList.contains('grid-stack-item'),
    ).length;
  }

  // After the app's @onDropped: put the DOM back the way Glimmer left it.
  _finishDrop(claim) {
    const { el, entry } = claim;
    if (entry) {
      if (departing.get(el) === entry) departing.delete(el);
      if (entry.placeholder.isConnected) entry.placeholder.replaceWith(el);
      else {
        entry.placeholder.remove();
        el.remove();
      }
    } else {
      el.remove();
    }
    // the re-render the handler caused runs after every queued job, so wait a loop
    next(this, this._checkDrop, claim);
  }

  _checkDrop({ el, id, previousNode, entry, count, incoming: entering }) {
    if (incoming.get(id) === entering) incoming.delete(id);
    this._placements.delete(id);
    if (this.isDestroying || this.isDestroyed) return;
    if (!previousNode) {
      if (this._itemCount() <= count) {
        dropWarn(
          '@onDropped did not render a new <GridStackItem> for the dragged-in element.',
          WARN_NOT_RENDERED,
        );
      }
      return;
    }
    const rendered = [...this.elm.children].some(
      (c) => c !== el && c.gridstackNode?.id === id,
    );
    if (rendered) return;
    const source = entry?.grid;
    if (source?.gridStack && el.parentElement === source.elm) {
      const { x, y, w, h } = previousNode;
      applyItemAttributes(el, { x, y, w, h, id });
      source.addWidget(el);
    }
    dropWarn(
      `@onDropped did not render <GridStackItem> "${id}" in the target grid; it stays in its source grid.`,
      WARN_NOT_RENDERED,
    );
  }

  @action
  setup(elm) {
    this.elm = elm;
    registerGridElement(elm, this);
    this._name = this.args.name;
    if (this._name) {
      this._registry = registry(this);
      this._registry.registerName(this._name, this);
    }
    this._createGridStack();
  }

  @action
  update() {
    const prev = this._appliedOptions ?? {};
    const next = this.options;
    const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);
    const changed = {};
    let reinit = !this.gridStack;

    for (const key of keys) {
      if (sameOption(prev[key], next[key])) continue;
      if (!(key in next) || REINIT_OPTIONS.includes(key)) {
        reinit = true;
        break;
      }
      changed[key] = next[key];
    }

    if (reinit) {
      this._destroyGridStack();
      this._createGridStack();
    } else if (Object.keys(changed).length) {
      this._appliedOptions = next;
      if (changed.acceptWidgets) changed.acceptWidgets = this._accept;
      this.gridStack.updateOptions(changed);
    }
  }

  @action
  willDestroyNode() {
    departing.forEach((entry, el) => {
      if (entry.grid !== this) return;
      departing.delete(el);
      if (entry.placeholder.parentNode) entry.placeholder.replaceWith(el);
    });
    this._destroyGridStack();
    unregisterGridElement(this.elm);
    this._registry?.unregisterName(this._name, this);
  }

  /** The GridStack instance, or `null` before insert / after destroy. */
  get instance() {
    return this.gridStack;
  }

  @action
  compact(layout, doSort) {
    return this.gridStack?.compact(layout, doSort);
  }

  @action
  save(...args) {
    return this.gridStack?.save(...args);
  }

  @action
  load(layout, addRemove) {
    return this.gridStack?.load(layout, addRemove);
  }

  @action
  enableMove(doEnable, recurse) {
    return this.gridStack?.enableMove(doEnable, recurse);
  }

  @action
  enableResize(doEnable, recurse) {
    return this.gridStack?.enableResize(doEnable, recurse);
  }

  @action
  setMode(mode) {
    return this.gridStack?.mode(mode);
  }

  @action
  removeAll(removeDOM = false, triggerEvent = true) {
    return this.gridStack?.removeAll(removeDOM, triggerEvent);
  }

  @action
  addWidget(element) {
    this.gridStack?.makeWidget(element);
  }

  @action
  removeWidget(element, removeDOM = false, triggerEvent = true) {
    triggerEvent = triggerEvent && !this.isDestroying && !this.isDestroyed;
    if (this.gridStack) {
      this._removeWidget.call(this.gridStack, element, removeDOM, triggerEvent);
    }
  }

  get isLayoutMode() {
    return this.args.layout !== undefined || this.args.components !== undefined;
  }

  <template>
    {{#if this.isLayoutMode}}
      <GridStackLayout
        @layout={{@layout}}
        @name={{@name}}
        @options={{@options}}
        @components={{@components}}
        @onAdded={{@onAdded}}
        @onChange={{@onChange}}
        @onDisable={{@onDisable}}
        @onDragstart={{@onDragstart}}
        @onDrag={{@onDrag}}
        @onDragstop={{@onDragstop}}
        @onDropped={{@onDropped}}
        @onEnable={{@onEnable}}
        @onRemoved={{@onRemoved}}
        @onResizestart={{@onResizestart}}
        @onResize={{@onResize}}
        @onResizestop={{@onResizestop}}
        @onResizecontent={{@onResizecontent}}
        ...attributes
        as |widget grid|
      >
        {{yield widget grid}}
      </GridStackLayout>
    {{else}}
      <div
        class="grid-stack"
        {{lifecycle
          setup=this.setup
          update=this.update
          teardown=this.willDestroyNode
          options=@options
        }}
        ...attributes
      >
        {{yield this}}
      </div>
    {{/if}}
  </template>
}
