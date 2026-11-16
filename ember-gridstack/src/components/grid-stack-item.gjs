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
import lifecycle from '../utils/lifecycle.js';
import { applyItemAttributes } from '../modifiers/gs-item-attributes.js';
import { gridForElement } from '../utils/grid-elements.js';

export default class GridStackItem extends Component {
  @service gridStackRegistry;

  @tracked elm;

  get element() {
    return this.elm;
  }

  // Resolved lazily: an initial item is inserted before its grid exists.
  get grid() {
    return this.args.grid ?? this.gridStackComponent;
  }

  get gridStackComponent() {
    if (this.args.grid) return this.args.grid;
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
    applyItemAttributes(elm, this.args.options);
    this.gridStackComponent?.addWidget(this.elm);
  }

  @action
  updateGridStack() {
    const gridStack = this.gridStackComponent?.gridStack;
    if (!gridStack) {
      applyItemAttributes(this.elm, this.args.options);
      return;
    }
    gridStack.update(this.elm, { ...this.args.options });
    applyItemAttributes(this.elm, this.args.options, { onlyRemovals: true });
  }

  @action
  willDestroyNode() {
    this.gridStackComponent?.removeWidget(this.elm);
  }

  <template>
    <div
      class="grid-stack-item"
      ...attributes
      {{lifecycle
        setup=this.setup
        update=this.updateGridStack
        teardown=this.willDestroyNode
        options=@options
      }}
    >
      <div class="grid-stack-item-content">
        {{yield this}}
      </div>
    </div>
  </template>
}
