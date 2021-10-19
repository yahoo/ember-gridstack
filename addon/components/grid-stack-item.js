/**
 * Copyright 2021, Yahoo Inc.
 * Copyrights licensed under the BSD License. See the accompanying LICENSE file for terms.
 *
 * Usage:
 *   <GridStackItem @options={{hash minW=2 maxW=4}} as |item|>
 *     My widget content
 *   </GridStackItem>
 *
 * Full list of options:
 *   https://github.com/gridstack/gridstack.js/tree/master/doc#item-options
 */
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';

export default class GridStackItem extends Component {
  @service gridStackRegistry;

  guid = guidFor(this);
  @tracked elm;
  @tracked gridStackComponent;

  get element() {
    return document.getElementById(this.guid);
  }

  @action
  setup(elm) {
    this.elm = elm;
    this.gridStackComponent = this.gridStackRegistry.findGridComponent(this.elm);
    this.gridStackComponent?.addWidget(this.elm);
  }

  @action
  updateGridStack() {
    this.gridStackComponent?.gridStack?.update(this.elm, { ...this.args.options });
  }

  @action
  willDestroyNode() {
    this.gridStackComponent?.removeWidget(this.elm);
  }
}
