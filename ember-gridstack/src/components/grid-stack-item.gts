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
import type { GridItemHTMLElement, GridStackWidget } from 'gridstack';
import lifecycle from '../utils/lifecycle.ts';
import BeforeRemove from '../utils/before-remove.ts';
import { applyItemAttributes } from '../modifiers/gs-item-attributes.ts';
import {
  gridForElement,
  registerItemElement,
  unregisterItemElement,
} from '../utils/grid-elements.ts';
import type { GridApi } from '../utils/grid-elements.ts';
import { activeDrop } from '../utils/cross-grid.ts';
import type GridStackComponent from './grid-stack.gts';
import type { DroppedFrom } from './grid-stack-layout.gts';

export interface GridStackItemSignature {
  Args: {
    options?: GridStackWidget;
    /** set by `grid.Item`; otherwise the closest `<GridStack>` */
    grid?: GridStackComponent;
  };
  Blocks: { default: [item: GridStackItem] };
  Element: HTMLDivElement;
}

/** `droppedFrom` of a template-mode item: the source may be either kind of grid. */
export type ItemDroppedFrom = Omit<DroppedFrom, 'grid'> & { grid: GridApi };

export default class GridStackItem extends Component<GridStackItemSignature> {
  @tracked private elm: GridItemHTMLElement | undefined;

  /** `undefined` until the item is inserted. */
  get element(): HTMLDivElement | undefined {
    return this.elm as HTMLDivElement | undefined;
  }

  // Resolved lazily: an initial item is inserted before its grid exists.
  get grid(): GridStackComponent | undefined {
    return this.args.grid ?? this.gridStackComponent;
  }

  // only a template-mode grid renders items, so a found grid is a GridStackComponent
  private get gridStackComponent(): GridStackComponent | undefined {
    if (this.args.grid) return this.args.grid;
    if (!this.elm) return undefined;
    return (gridForElement(this.elm) ??
      // detached on removal: gridstack still knows its grid
      gridForElement(this.elm.gridstackNode?.grid?.el)) as
      GridStackComponent | undefined;
  }

  private _beforeRemove = new BeforeRemove();

  /**
   * Runs when a cross-grid drop claims this item; the first non-undefined
   * return value becomes `droppedFrom.state` of the item rendered in the target.
   */
  beforeRemove: (fn: () => unknown) => () => void = this._beforeRemove.add;

  /** @internal */
  _runBeforeRemove(): unknown {
    return this._beforeRemove.run().state;
  }

  /** Set while the target grid renders a dropped item (matched by `@options.id`). */
  // plain Map read: only meaningful while the drop renders this item
  get droppedFrom(): ItemDroppedFrom | undefined {
    const id = this.args.options?.id;
    if (id === undefined) return undefined;
    return (this.grid ?? activeDrop.grid)?._incoming?.get(id);
  }

  @action
  private setup(elm: HTMLElement) {
    this.elm = elm;
    registerItemElement(elm, this);
    applyItemAttributes(elm, this.args.options);
    const grid = this.gridStackComponent;
    const id = this.args.options?.id;
    const placement = id !== undefined && grid?._placements?.get(id);
    if (grid && placement) {
      grid._placements.delete(id);
      applyItemAttributes(elm, placement);
    }
    grid?.addWidget(this.elm);
  }

  @action
  private updateGridStack() {
    if (!this.elm) return;
    const gridStack = this.gridStackComponent?.gridStack;
    if (!gridStack) {
      applyItemAttributes(this.elm, this.args.options);
      return;
    }
    gridStack.update(this.elm, { ...this.args.options });
    applyItemAttributes(this.elm, this.args.options, { onlyRemovals: true });
  }

  @action
  resizeToContent(): void {
    if (this.elm) this.grid?.gridStack?.resizeToContent(this.elm);
  }

  @action
  private willDestroyNode() {
    if (!this.elm) return;
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
