/**
 * Copyright 2020, Yahoo Inc.
 * Copyrights licensed under the BSD License. See the accompanying LICENSE file for terms.
 *
 * Usage:
 *   {{#grid-stack-item
 *      options=(hash
 *        minWidth=2
 *        maxWidth=4
 *      )
 *      as |item|
 *   }}
 *     My widget content
 *   {{/grid-stack-item}}
 *
 * Full list of options:
 *   https://github.com/troolee/gridstack.js/tree/master/doc#item-attributes
 */
import { dasherize } from '@ember/string';
import Component from '@ember/component';
import { computed } from '@ember/object';
import layout from '../templates/components/grid-stack-item';

// Common prefix shared by gridstack data attributes
const GS_PREFIX = 'data-gs-';

export default class extends Component {
  layout = layout

  /**
   * @property {Array} classNames
   */
  classNames = ['grid-stack-item']

  /**
   * @property {Ember.Component} parentContainer - reference to the grid-stack component this component belongs to
   */
  @computed
  get parentContainer() {
    return this.nearestWithProperty('gridStackContainer');
  }

  /**
   * @method didReceiveAttrs
   * @override
   */
  didReceiveAttrs() {
    super.didReceiveAttrs(...arguments);

    let options = this.options;

    if (options) {
      // Since attributeBindings cannot be a computed property,
      // it must be manually set when options changes
      this.set('attributeBindings',

        // Convert each given option into a html data attribute
        Object.keys(options).map(key => {
          let dataKey = GS_PREFIX + dasherize(key);

          return `options.${key}:${dataKey}`;
        })
      );
    }
  }

  /**
   * @method didInsertElement
   * @override
   */
  didInsertElement() {
    super.didInsertElement(...arguments);

    let gridStack = this.parentContainer;

    if (gridStack) {
      // Register widget with grid
      gridStack.addWidget(this.element);
    }
  }

  /**
   * @method willDestroyElement
   * @override
   */
  willDestroyElement() {
    super.willDestroyElement(...arguments);

    let gridStack = this.parentContainer;

    if (gridStack) {
      gridStack.removeWidget(this.element);
    }
  }
}
