/* eslint-disable ember/no-component-lifecycle-hooks */
/* eslint-disable ember/no-classic-components */
/**
 * Copyright 2021, Yahoo Inc.
 * Copyrights licensed under the BSD License. See the accompanying LICENSE file for terms.
 *
 * Usage:
 *   {{grid-stack
 *      options=(hash
 *        animate=true
 *      )
 *      onDragstart=(action 'dragStart')
 *      onDragstop=(action 'dragStop')
 *      onResizestart=(action 'resizeStart')
 *      onResizestop=(action 'resizeStop')
 *      onAdded=(action 'added')
 *      onChange=(action 'change')
 *      onEnable=(action 'enable')
 *      onRemoved=(action 'remove')
 *      as |grid|
 *   }}
 *
 * Full list of options:
 *   https://github.com/troolee/gridstack.js/tree/master/doc#options
 */
import Component from '@ember/component';
import { action, set } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { capitalize } from '@ember/string';
import { guidFor } from '@ember/object/internals';
import layout from '../templates/components/grid-stack';

export const GRID_STACK_EVENTS = [
  'dragstart',
  'dragstop',
  'resizestart',
  'resizestop',
  'added',
  'change',
  'enable',
  'removed',
];

export default class GridStackComponent extends Component {
  layout = layout;

  tagName = '';

  guid = guidFor(this);

  /**
   * @property {Boolean} gridStackContainer - used by child components to find this component
   */
  gridStackContainer = true;

  /**
   * https://github.com/troolee/gridstack.js/tree/master/doc#api
   * @property {Object} gridStack - reference to gridstack object
   */
  gridStack = null;

  /**
   * @property {Array} subscribedEvents - List of events for which event handlers were set up
   */
  subscribedEvents = [];

  willDestroyElement() {
    super.willDestroyElement(...arguments);
    this._destroyGridStack();
  }

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
    this.gridStack = window.GridStack.init({ ...this.options }, this.elm);

    // Since destroying gridstack disables it,
    // we must manually enable it
    if (!(this.options && this.options.staticGrid)) {
      const { gridStack } = this;

      this.elm.querySelectorAll(`.${gridStack.opts.itemClass}`).forEach((el) => {
        // only enable items that are supposed to mobile
        let noMove = el.getAttribute('data-gs-no-move');
        let noResize = el.getAttribute('data-gs-no-resize');

        if (!noMove) {
          gridStack.movable(el, true);
        }

        if (!noResize) {
          gridStack.resizable(el, true);
        }
      });
    }

    GRID_STACK_EVENTS.forEach((eventName) => {
      const action = this[`on${capitalize(eventName)}`];

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
    set(this, 'elm', elm);
    this._createGridStack();
  }

  @action
  update() {
    this._destroyGridStack();
    this._createGridStack();
  }

  @action
  addWidget(element) {
    this.gridStack?.makeWidget(element);
  }

  @action
  removeWidget(element) {
    // Use `false` option to prevent removing dom element, let Ember do that
    this.gridStack?.removeWidget(element, false);
  }
}
