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
import type Owner from '@ember/owner';
import type { TemplateOnlyComponent } from '@ember/component/template-only';
import { GridStack } from 'gridstack';
import type {
  AddRemoveFcn,
  CompactOptions,
  GridItemHTMLElement,
  GridStackElement,
  GridStackMode,
  GridStackNode,
  GridStackOptions,
  GridStackWidget,
  SaveFcn,
} from 'gridstack';
import lifecycle from '../utils/lifecycle.ts';
import GridStackItem from './grid-stack-item.gts';
import type {
  GridStackItemSignature,
  ItemDroppedFrom,
} from './grid-stack-item.gts';
import GridStackLayout from './grid-stack-layout.gts';
import type { LayoutWidget, WidgetComponent } from './grid-stack-layout.gts';
import {
  gridForElement,
  itemForElement,
  registry,
  registerGridElement,
  unregisterGridElement,
} from '../utils/grid-elements.ts';
import type GridStackRegistry from '../services/grid-stack-registry.ts';

import { GRID_STACK_EVENTS, capitalize } from '../utils/events.ts';
import {
  WARN_NEEDS_ID,
  WARN_NO_HANDLER,
  WARN_NOT_RENDERED,
  WARN_ID_COLLISION,
  ID_COLLISION_MESSAGE,
  activeDrop,
  departing,
  dropWarn,
  hasIdCollision,
} from '../utils/cross-grid.ts';
import type { DepartingEntry } from '../utils/cross-grid.ts';
import { applyItemAttributes } from '../modifiers/gs-item-attributes.ts';

export { GRID_STACK_EVENTS, capitalize };

type NodesHandler = (event: Event, nodes: GridStackNode[]) => void;
type ElementHandler = (event: Event, el: GridItemHTMLElement) => void;
type EventHandler = (event: Event) => void;
type DroppedHandler = (
  event: Event,
  previousNode: GridStackNode | undefined,
  newNode: GridStackNode,
) => void;

export interface GridStackSignature {
  Args: {
    options?: GridStackOptions;
    /** registers the grid under this name: `gridStackRegistry.get(name)` */
    name?: string;
    /** data mode: see `grid-stack-layout` */
    layout?: LayoutWidget[];
    components?: Record<string, WidgetComponent>;
    onAdded?: NodesHandler;
    onChange?: NodesHandler;
    onRemoved?: NodesHandler;
    onResizecontent?: NodesHandler;
    onDisable?: EventHandler;
    onEnable?: EventHandler;
    onDragstart?: ElementHandler;
    onDrag?: ElementHandler;
    onDragstop?: ElementHandler;
    onResizestart?: ElementHandler;
    onResize?: ElementHandler;
    onResizestop?: ElementHandler;
    onDropped?: DroppedHandler;
  };
  Blocks: { default: [grid: GridStackComponent] };
  Element: HTMLDivElement;
}

/** `grid.Item`: a `<GridStackItem>` bound to its grid. */
export type BoundItem = TemplateOnlyComponent<{
  Args: Omit<GridStackItemSignature['Args'], 'grid'>;
  Blocks: GridStackItemSignature['Blocks'];
  Element: GridStackItemSignature['Element'];
}>;

/** A handler as gridstack calls it, whichever `@on*` it is. */
export type AnyHandler = (this: GridStack, ...args: unknown[]) => void;

/**
 * Options gridstack's `updateOptions()` cannot apply; changing any of these, or
 * removing any option, destroys and re-creates the GridStack instance.
 */
export const REINIT_OPTIONS: string[] = [
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

const sameOption = (a: unknown, b: unknown) =>
  a === b ||
  (typeof a === 'object' &&
    typeof b === 'object' &&
    a !== null &&
    b !== null &&
    JSON.stringify(a) === JSON.stringify(b));

interface Claim {
  el: GridItemHTMLElement;
  id: string | undefined;
  previousNode: GridStackNode | undefined;
  count: number;
  entry?: DepartingEntry;
  incoming?: ItemDroppedFrom;
}

type Placement = Pick<GridStackWidget, 'x' | 'y' | 'w' | 'h'>;

export default class GridStackComponent extends Component<GridStackSignature> {
  @tracked private elm: HTMLElement | undefined;

  /** `<GridStackItem>` bound to this grid. */
  Item: BoundItem;

  constructor(owner: Owner, args: GridStackSignature['Args']) {
    super(owner, args);
    // the template below has no `this` of its own
    // eslint-disable-next-line @typescript-eslint/no-this-alias
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

  get options(): GridStackOptions {
    return {
      ...this.args.options,
    };
  }

  /**
   * https://github.com/gridstack/gridstack.js/tree/master/doc#api
   * @deprecated use `instance`
   */
  gridStack: GridStack | null = null;

  /** List of events for which event handlers were set up */
  private subscribedEvents: string[] = [];

  private _appliedOptions?: GridStackOptions;
  private _removeWidget?: GridStack['removeWidget'];
  private _warnedNoHandler = false;
  private _warnedNoId = false;
  private _warnedCollision = false;
  private _name?: string;
  private _registry?: GridStackRegistry;

  private _destroyGridStack() {
    const { gridStack, elm } = this;

    if (gridStack) {
      this.subscribedEvents.forEach((eventName) => gridStack.off(eventName));
      this.subscribedEvents = [];

      // Use `false` option to prevent removing dom elements, let Ember do that
      gridStack.destroy(false);

      this.gridStack = null;

      // Remove 'grid-stack-instance-####' class left behind
      [...(elm?.classList ?? [])]
        .filter((x) => /grid-stack-instance-\d*/.test(x))
        .forEach((x) => elm?.classList.remove(x));
    }
  }

  // one stable function: a new one per update would make `sameOption` re-init
  private _accept = (el: Element): boolean => {
    const option = this.args.options?.acceptWidgets;
    let ok;
    if (typeof option === 'function') ok = option(el);
    else if (option === true) ok = el.matches('.grid-stack-item');
    else ok = typeof option === 'string' && el.matches(option);
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
    const node = (el as GridItemHTMLElement).gridstackNode;
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
    if (hasIdCollision(this.gridStack, node)) {
      if (!this._warnedCollision) {
        this._warnedCollision = true;
        dropWarn(ID_COLLISION_MESSAGE, WARN_ID_COLLISION);
      }
      return false;
    }
    return true;
  };

  private _createGridStack() {
    this._appliedOptions = this.options;
    const init = { ...this._appliedOptions };
    if (init.acceptWidgets) init.acceptWidgets = this._accept;
    const gridStack = GridStack.init(init, this.elm);
    this.gridStack = gridStack;
    if (!gridStack) return;

    // Glimmer owns the DOM order; gridstack's re-sorting would desync {{#each}}
    const internal = gridStack as GridStack & { _sortDom?: () => GridStack };
    if (typeof internal._sortDom === 'function') {
      internal._sortDom = function (this: GridStack) {
        return this;
      };
    }

    // Glimmer owns the DOM: trash drops must not remove the element
    // eslint-disable-next-line @typescript-eslint/unbound-method -- invoked with .call
    const removeWidget = gridStack.removeWidget;
    this._removeWidget = removeWidget;
    gridStack.removeWidget = function (
      this: GridStack,
      els: GridStackElement,
      _removeDOM?: boolean,
      triggerEvent?: boolean,
    ) {
      return removeWidget.call(this, els, false, triggerEvent);
    };

    // resolve @on* at fire time so changed handlers need no re-init
    GRID_STACK_EVENTS.forEach((eventName) => {
      const argName = `on${capitalize(eventName)}` as const;

      gridStack.on(eventName, (...args: unknown[]) => {
        if (eventName === 'removed')
          this._markDeparting(args[1] as GridStackNode[] | undefined);
        const claim =
          eventName === 'dropped'
            ? this._claimDrop(
                args[1] as GridStackNode | undefined,
                args[2] as GridStackNode | undefined,
              )
            : null;
        const action = this.args[argName] as AnyHandler | undefined;
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

  /** @internal drop position per item id, applied when the target renders that item */
  _placements = new Map<string, Placement>();

  /** @internal item id arriving here -> `{ grid, state }` (read as `item.droppedFrom`) */
  _incoming = new Map<string | undefined, ItemDroppedFrom>();

  // Sync, before the target grid moves `el` out: mark its spot so the element
  // can go back there before Glimmer clears this grid's row.
  private _markDeparting(nodes: GridStackNode[] | undefined) {
    nodes?.forEach(({ el }) => {
      if (!el || el.parentElement !== this.elm || departing.has(el)) return;
      const placeholder = document.createComment('gs-moved');
      el.before(placeholder);
      const entry: DepartingEntry = { grid: this, placeholder };
      departing.set(el, entry);
      schedule('afterRender', () => {
        if (entry.claimed || departing.get(el) !== entry) return;
        departing.delete(el);
        placeholder.remove();
      });
    });
  }

  // Sync in the target's `dropped`: the source item is still alive here.
  private _claimDrop(
    previousNode: GridStackNode | undefined,
    newNode: GridStackNode | undefined,
  ): Claim | null {
    const el = newNode?.el;
    if (!el || !newNode) return null;
    const { id, x, y, w, h } = newNode;
    if (id !== undefined) this._placements.set(id, { x, y, w, h });
    const claim: Claim = {
      el,
      id,
      previousNode,
      count: this._itemCount(el),
    };
    if (previousNode) {
      claim.entry = departing.get(el);
      if (claim.entry) claim.entry.claimed = true;
      claim.incoming = {
        // a drop's source is always a rendered grid
        grid: (claim.entry?.grid ?? gridForElement(previousNode.grid?.el))!,
        state: itemForElement(el)?._runBeforeRemove(),
      };
      this._incoming.set(id, claim.incoming);
      activeDrop.grid = this;
    }
    this.gridStack?.removeWidget(el, false, false);
    return claim;
  }

  private _itemCount(except?: Element) {
    return [...(this.elm?.children ?? [])].filter(
      (c) => c !== except && c.classList.contains('grid-stack-item'),
    ).length;
  }

  // After the app's @onDropped: put the DOM back the way Glimmer left it.
  private _finishDrop(claim: Claim) {
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
    next(() => this._checkDrop(claim));
  }

  private _checkDrop({
    el,
    id,
    previousNode,
    entry,
    count,
    incoming: entering,
  }: Claim) {
    if (this._incoming.get(id) === entering) this._incoming.delete(id);
    if (!this._incoming.size && activeDrop.grid === this)
      activeDrop.grid = null;
    if (id !== undefined) this._placements.delete(id);
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
    const rendered = [...(this.elm?.children ?? [])].some(
      (c) => c !== el && (c as GridItemHTMLElement).gridstackNode?.id === id,
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
  private setup(elm: HTMLElement) {
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
  private update() {
    const prev = (this._appliedOptions ?? {}) as Record<string, unknown>;
    const next = this.options as Record<string, unknown>;
    const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);
    const changed: Record<string, unknown> = {};
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
      this.gridStack?.updateOptions(changed);
    }
  }

  @action
  private willDestroyNode() {
    if (activeDrop.grid === this) activeDrop.grid = null;
    departing.forEach((entry, el) => {
      if (entry.grid !== this) return;
      departing.delete(el);
      if (entry.placeholder.parentNode) entry.placeholder.replaceWith(el);
    });
    this._destroyGridStack();
    if (this.elm) unregisterGridElement(this.elm);
    if (this._name) this._registry?.unregisterName(this._name, this);
  }

  /** The GridStack instance, or `null` before insert / after destroy. */
  get instance(): GridStack | null {
    return this.gridStack;
  }

  @action
  compact(layout?: CompactOptions, doSort?: boolean): GridStack | undefined {
    return this.gridStack?.compact(layout, doSort);
  }

  @action
  save(
    ...args: [
      saveContent?: boolean,
      saveGridOpt?: boolean,
      saveCB?: SaveFcn,
      column?: number,
    ]
  ): GridStackWidget[] | GridStackOptions | undefined {
    return this.gridStack?.save(...args);
  }

  @action
  load(
    layout: GridStackWidget[],
    addRemove?: boolean | AddRemoveFcn,
  ): GridStack | undefined {
    return this.gridStack?.load(layout, addRemove);
  }

  @action
  enableMove(doEnable: boolean, recurse?: boolean): GridStack | undefined {
    return this.gridStack?.enableMove(doEnable, recurse);
  }

  @action
  enableResize(doEnable: boolean, recurse?: boolean): GridStack | undefined {
    return this.gridStack?.enableResize(doEnable, recurse);
  }

  @action
  setMode(mode: GridStackMode): GridStack | undefined {
    return this.gridStack?.mode(mode);
  }

  @action
  removeAll(removeDOM = false, triggerEvent = true): GridStack | undefined {
    return this.gridStack?.removeAll(removeDOM, triggerEvent);
  }

  @action
  addWidget(element: HTMLElement): void {
    this.gridStack?.makeWidget(element);
  }

  @action
  removeWidget(
    element: HTMLElement,
    removeDOM = false,
    triggerEvent = true,
  ): void {
    triggerEvent = triggerEvent && !this.isDestroying && !this.isDestroyed;
    if (this.gridStack) {
      this._removeWidget?.call(
        this.gridStack,
        element,
        removeDOM,
        triggerEvent,
      );
    }
  }

  private get isLayoutMode() {
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
        {{! data mode yields (widget, grid); the signature only describes template mode }}
        {{! @glint-expect-error }}
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
