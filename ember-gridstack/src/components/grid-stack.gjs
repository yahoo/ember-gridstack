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
import { scheduleOnce } from '@ember/runloop';
import { GridStack } from 'gridstack';
import didInsert from '@ember/render-modifiers/modifiers/did-insert';
import didUpdate from '@ember/render-modifiers/modifiers/did-update';
import willDestroy from '@ember/render-modifiers/modifiers/will-destroy';
import {
  registerGridElement,
  unregisterGridElement,
} from '../utils/grid-elements.js';

export const GRID_STACK_EVENTS = [
  'added',
  'change',
  'disable',
  'dragstart',
  'drag',
  'dragstop',
  'dropped',
  'enable',
  'removed',
  'resizestart',
  'resize',
  'resizestop',
  'resizecontent',
];

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

export const capitalize = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

const sameOption = (a, b) =>
  a === b ||
  (typeof a === 'object' &&
    typeof b === 'object' &&
    a !== null &&
    b !== null &&
    JSON.stringify(a) === JSON.stringify(b));

export default class GridStackComponent extends Component {
  @tracked elm;

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

  _createGridStack() {
    this._appliedOptions = this.options;
    this.gridStack = GridStack.init({ ...this._appliedOptions }, this.elm);

    // Glimmer owns the DOM order; gridstack's re-sorting would desync {{#each}}
    if (typeof this.gridStack._sortDom === 'function') {
      this.gridStack._sortDom = function () {
        return this;
      };
    }

    // resolve @on* at fire time so changed handlers need no re-init
    GRID_STACK_EVENTS.forEach((eventName) => {
      const argName = `on${capitalize(eventName)}`;
      const gridStack = this.gridStack;

      gridStack.on(eventName, (...args) => {
        const action = this.args[argName];
        if (action) {
          scheduleOnce('afterRender', gridStack, action, ...args);
        }
      });

      this.subscribedEvents.push(eventName);
    });
  }

  @action
  setup(elm) {
    this.elm = elm;
    registerGridElement(elm, this);
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
      this.gridStack.updateOptions(changed);
    }
  }

  @action
  willDestroyNode() {
    this._destroyGridStack();
    unregisterGridElement(this.elm);
  }

  @action
  addWidget(element) {
    this.gridStack?.makeWidget(element);
  }

  @action
  removeWidget(element, removeDOM = false, triggerEvent = true) {
    triggerEvent = triggerEvent && !this.isDestroying && !this.isDestroyed;
    this.gridStack?.removeWidget(element, removeDOM, triggerEvent);
  }

  <template>
    <div
      class="grid-stack"
      {{didInsert this.setup}}
      {{didUpdate this.update @options}}
      {{willDestroy this.willDestroyNode}}
      ...attributes
    >
      {{yield this}}
    </div>
  </template>
}
