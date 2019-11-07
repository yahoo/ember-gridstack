/**
 * Copyright 2018, Yahoo Inc.
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
import { assign } from '@ember/polyfills';
import Component from '@ember/component';
import { get } from '@ember/object';
import { run } from '@ember/runloop';
import { capitalize } from '@ember/string';
import layout from '../templates/components/grid-stack';

const GRID_STACK_EVENTS = [
  'dragstart', 'dragstop', 'resizestart', 'resizestop', 'added', 'change', 'enable', 'removed'
];

export default Component.extend({
  layout,

  /**
   * @property {Array} classNames
   */
  classNames: ['grid-stack'],

  /**
   * @property {Boolean} gridStackContainer - used by child components to find this component
   */
  gridStackContainer: true,

  /**
   * https://github.com/troolee/gridstack.js/tree/master/doc#api
   * @property {Object} gridStack - reference to gridstack object
   */
  get gridStack() {
    if(this.$()) {
      return this.$().data('gridstack');
    } else {
      return null;
    }
  },

  /**
   * https://github.com/troolee/gridstack.js/tree/master/doc#events
   * @property {Array} gridStackEvents - list of gridstack events
   */
  gridStackEvents: undefined,

  /**
   * @method didInsertElement
   */
  didInsertElement() {
    this._super(...arguments);
    this.set('gridStackEvents', GRID_STACK_EVENTS);
    this._createGridStack();
  },

  /**
   * @method didUpdateAttrs
   */
  didUpdateAttrs() {
    // Reset gridstack to pick up latest option changes
    this._destroyGridStack();
    this._createGridStack();
  },

  /**
   * @method willDestroyElement
   */
   willDestroyElement() {
     this._super(...arguments);
     this._destroyGridStack();
   },

  /**
   * @method _destroyGridstack
   * @private
   */
  _destroyGridStack() {
    let grid = get(this, 'gridStack');

    if (grid) {

      this.$().off('.grid-stack');

      // Use `false` option to prevent removing dom elements, let Ember do that
      grid.destroy(false);

      // Clean up gridstack reference in JQuery node
      this.$().data('gridstack', null);

      // Remove 'grid-stack-instance-####' class left behind
      this.$().removeClass((index, css) => {
          return (css.match(/grid-stack-instance-\d*/) || []).join(' ');
      });
    }
  },

  /**
   * @method _createGridStack
   * @private
   */
  _createGridStack() {
    let options = assign({}, get(this, 'options'));
    this.$().gridstack(options);

    // Since destroying gridstack disables it,
    // we must manually enable it
    if (!get(this, 'options.staticGrid')) {
      let grid = get(this, 'gridStack');
      let itemClass = grid.opts.itemClass;
      this.$().children(`.${itemClass}`).each((i, el) => {
        let $el = this.$(el);

        // only enable items that are supposed to mobile
        let noMove = $el.attr('data-gs-no-move');
        let noResize = $el.attr('data-gs-no-resize');

        if (!noMove) {
          grid.movable(el, true);
        }

        if (!noResize) {
          grid.resizable(el, true);
        }
      });
    }

    get(this, 'gridStackEvents').forEach(eventName => {
      let action = get(this, `attrs.on${capitalize(eventName)}`);

      if(action) {
        this.$().on(`${eventName}.grid-stack`, function() {
          run.scheduleOnce('afterRender', this, action, ...arguments);
        });
      }
    });
  },

  actions: {
    /**
     * @action addWidget - add the provided widget element to the grid
     */
    addWidget(element) {
      let grid = get(this, 'gridStack');
      if (grid) {
        grid.makeWidget(element);
      }
    },
    /**
     * @action removeWidget - remove the provided widget element from the grid
     */
    removeWidget(element) {
      let grid = get(this, 'gridStack');
      if (grid) {
        // Use `false` option to prevent removing dom element, let Ember do that
        grid.removeWidget(element, false);
      }
    }
  }
});
