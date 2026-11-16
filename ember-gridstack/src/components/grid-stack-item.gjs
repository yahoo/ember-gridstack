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
import didInsert from '@ember/render-modifiers/modifiers/did-insert';
import didUpdate from '@ember/render-modifiers/modifiers/did-update';
import willDestroy from '@ember/render-modifiers/modifiers/will-destroy';
import gsItemAttributes from '../modifiers/gs-item-attributes.js';
import { gridForElement } from '../utils/grid-elements.js';

export default class GridStackItem extends Component {
  @service gridStackRegistry;

  @tracked elm;

  get element() {
    return this.elm;
  }

  // Resolved lazily: an initial item is inserted before its grid exists.
  get gridStackComponent() {
    if (!this.elm) return undefined;
    const legacyId = this.elm.closest('.grid-stack')?.id;
    return (
      gridForElement(this.elm) ??
      // detached on removal: gridstack still knows its grid
      gridForElement(this.elm.gridstackNode?.grid?.el) ??
      (legacyId && legacyId in this.gridStackRegistry._grids
        ? this.gridStackRegistry.findGridComponent(this.elm)
        : undefined)
    );
  }

  @action
  setup(elm) {
    this.elm = elm;
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
