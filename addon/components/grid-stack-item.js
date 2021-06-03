/* eslint-disable ember/no-component-lifecycle-hooks */
/* eslint-disable ember/no-computed-properties-in-native-classes */
/* eslint-disable ember/no-classic-components */
/**
 * Copyright 2021, Yahoo Inc.
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
import Component from '@ember/component';
import { action, computed, set } from '@ember/object';
import layout from '../templates/components/grid-stack-item';
import { guidFor } from '@ember/object/internals';

export default class extends Component {
  layout = layout;

  tagName = '';

  guid = guidFor(this);

  get element() {
    return document.getElementById(this.guid);
  }

  @computed
  get parentContainer() {
    return this.nearestWithProperty('gridStackContainer');
  }

  @action
  updateGridStack() {
    const { height, width, x, y } = this.options;
    this.parentContainer?.gridStack?.update(this.elm, x, y, width, height);
  }

  @action
  setup(elm) {
    set(this, 'elm', elm);
    this.parentContainer?.addWidget(this.elm);
  }

  willDestroyElement() {
    super.willDestroyElement(...arguments);
    this.parentContainer?.removeWidget(this.elm);
  }
}
