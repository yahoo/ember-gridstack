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
import { service } from '@ember/service';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import didInsert from '@ember/render-modifiers/modifiers/did-insert';
import didUpdate from '@ember/render-modifiers/modifiers/did-update';
import willDestroy from '@ember/render-modifiers/modifiers/will-destroy';
import gsItemAttributes from '../modifiers/gs-item-attributes.js';

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
    this.gridStackComponent = this.gridStackRegistry.findGridComponent(
      this.elm,
    );
    this.gridStackComponent?.addWidget(this.elm);
  }

  @action
  updateGridStack() {
    this.gridStackComponent?.gridStack?.update(this.elm, {
      ...this.args.options,
    });
  }

  @action
  willDestroyNode() {
    this.gridStackComponent?.removeWidget(this.elm);
  }

  <template>
    <div
      id={{this.guid}}
      class="grid-stack-item"
      ...attributes
      {{gsItemAttributes @options}}
      {{didInsert this.setup}}
      {{didUpdate this.updateGridStack @options}}
      {{willDestroy this.willDestroyNode}}
    >
      <div class="grid-stack-item-content">
        {{yield this}}
      </div>
    </div>
  </template>
}
