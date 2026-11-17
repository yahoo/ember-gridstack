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
import { action } from '@ember/object';
import lifecycle from '../utils/lifecycle.js';
import { applyItemAttributes } from '../modifiers/gs-item-attributes.js';
import {
  gridForElement,
  registerItemElement,
  unregisterItemElement,
} from '../utils/grid-elements.js';

export default class GridStackItem extends Component {
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
    return (
      gridForElement(this.elm) ??
      // detached on removal: gridstack still knows its grid
      gridForElement(this.elm.gridstackNode?.grid?.el)
    );
  }

  beforeRemoveFns = new Set();

  beforeRemove = (fn) => {
    this.beforeRemoveFns.add(fn);
    return () => this.beforeRemoveFns.delete(fn);
  };

  _runBeforeRemove() {
    let state;
    this.beforeRemoveFns.forEach((fn) => {
      const result = fn();
      if (state === undefined) state = result;
    });
    return state;
  }

  // plain Map read: only meaningful while the drop renders this item
  get droppedFrom() {
    const id = this.args.options?.id;
    return id === undefined ? undefined : this.grid?._incoming?.get(id);
  }

  @action
  setup(elm) {
    this.elm = elm;
    registerItemElement(elm, this);
    applyItemAttributes(elm, this.args.options);
    const grid = this.gridStackComponent;
    const id = this.args.options?.id;
    const placement = id !== undefined && grid?._placements?.get(id);
    if (placement) {
      grid._placements.delete(id);
      applyItemAttributes(elm, placement);
    }
    grid?.addWidget(this.elm);
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
  resizeToContent() {
    this.grid?.gridStack?.resizeToContent(this.elm);
  }

  @action
  willDestroyNode() {
    this.gridStackComponent?.removeWidget(this.elm);
    unregisterItemElement(this.elm);
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
