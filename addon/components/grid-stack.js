/**
 * Copyright 2020, Yahoo Inc.
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
import { get, action } from '@ember/object';
import { run } from '@ember/runloop';
import { capitalize } from '@ember/string';
import layout from '../templates/components/grid-stack';
import jQuery from 'jquery';

export const GRID_STACK_EVENTS = [
  'dragstart',
  'dragstop',
  'resizestart',
  'resizestop',
  'added',
  'change',
  'enable',
  'removed'
];

export default class GridStackComponent extends Component {
  layout = layout;

  /**
   * @property {Array} classNames
   */
  classNames = ['grid-stack'];

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

  /**
   * @method didInsertElement
   */
  didInsertElement() {
    super.didInsertElement(...arguments);
    this._createGridStack();
  }

  /**
   * @method didUpdateAttrs
   */
  didUpdateAttrs() {
    // Reset gridstack to pick up latest option changes
    this._destroyGridStack();
    this._createGridStack();
  }

  /**
   * @method willDestroyElement
   */
  willDestroyElement() {
    super.willDestroyElement(...arguments);
    this._destroyGridStack();
  }

  /**
   * @method _destroyGridstack
   * @private
   */
  _destroyGridStack() {
    let grid = this.gridStack;

    if (grid) {
      this.subscribedEvents.forEach(eventName => grid.off(eventName));
      this.subscribedEvents = [];

      // Use `false` option to prevent removing dom elements, let Ember do that
      grid.destroy(false);

      this.gridStack = null;

      // Remove 'grid-stack-instance-####' class left behind
      jQuery(this.element).removeClass((index, css) => {
        return (css.match(/grid-stack-instance-\d*/) || []).join(' ');
      });
    }
  }

  /**
   * @method _createGridStack
   * @private
   */
  _createGridStack() {
    this.gridStack = window.GridStack.init({ ...this.options }, this.element);

    // Since destroying gridstack disables it,
    // we must manually enable it
    if (!(this.options && this.options.staticGrid)) {
      let grid = this.gridStack;
      let itemClass = grid.opts.itemClass;
      jQuery(this.element)
        .children(`.${itemClass}`)
        .each((_, el) => {
          // only enable items that are supposed to mobile
          let noMove = el.getAttribute('data-gs-no-move');
          let noResize = el.getAttribute('data-gs-no-resize');

          if (!noMove) {
            grid.movable(el, true);
          }

          if (!noResize) {
            grid.resizable(el, true);
          }
        });
    }

    GRID_STACK_EVENTS.forEach(eventName => {
      let action = get(this, `attrs.on${capitalize(eventName)}`);

      if (action) {
        this.gridStack.on(eventName, function() {
          run.scheduleOnce('afterRender', this, action, ...arguments);
        });
        this.subscribedEvents.push(eventName);
      }
    });
  }

  /**
   * @action addWidget - add the provided widget element to the grid
   */
  @action
  addWidget(element) {
    let grid = this.gridStack;
    if (grid) {
      grid.makeWidget(element);
    }
  }

  /**
   * @action removeWidget - remove the provided widget element from the grid
   */
  @action
  removeWidget(element) {
    let grid = this.gridStack;
    if (grid) {
      // Use `false` option to prevent removing dom element, let Ember do that
      grid.removeWidget(element, false);
    }
  }
}
