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
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import { capitalize } from '@ember/string';
import { guidFor } from '@ember/object/internals';
import { GridStack } from 'gridstack';

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
];

export default class GridStackComponent extends Component {
  @service gridStackRegistry;

  guid = guidFor(this);
  @tracked elm;

  constructor() {
    super(...arguments);
    this.gridStackRegistry.registerGrid(this.guid, this);
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

  _createGridStack() {
    this.gridStack = GridStack.init({ ...this.options }, this.elm);

    GRID_STACK_EVENTS.forEach((eventName) => {
      const action = this.args[`on${capitalize(eventName)}`];

      if (action) {
        this.gridStack.on(eventName, function () {
          scheduleOnce('afterRender', this, action, ...arguments);
        });

        this.subscribedEvents.push(eventName);
      }
    });
  }

  @action
  setup(elm) {
    this.elm = elm;
    this._createGridStack();
  }

  @action
  update() {
    this._destroyGridStack();
    this._createGridStack();
  }

  @action
  willDestroyNode() {
    this.gridStackRegistry.unregisterGridComponent(this.guid, this);
    this._destroyGridStack();
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
}
