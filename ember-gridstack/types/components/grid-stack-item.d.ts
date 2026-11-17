import Component from '@glimmer/component';
import type { GridStackWidget } from 'gridstack';
import type GridStackComponent from './grid-stack';
import type GridStackLayoutComponent from './grid-stack-layout';
import type { DroppedFrom } from './grid-stack-layout';

export interface GridStackItemSignature {
  Args: {
    options?: GridStackWidget;
    /** set by `grid.Item`; otherwise the closest `<GridStack>` */
    grid?: GridStackComponent;
  };
  Blocks: { default: [item: GridStackItem] };
  Element: HTMLDivElement;
}

export default class GridStackItem extends Component<GridStackItemSignature> {
  /** `undefined` until the item is inserted. */
  readonly element: HTMLDivElement | undefined;
  readonly grid: GridStackComponent | undefined;
  resizeToContent(): void;
  /**
   * Runs when a cross-grid drop claims this item; the first non-undefined
   * return value becomes `droppedFrom.state` of the item rendered in the target.
   */
  beforeRemove(fn: () => unknown): () => void;
  /** Set while the target grid renders a dropped item (matched by `@options.id`). */
  readonly droppedFrom:
    | (Omit<DroppedFrom, 'grid'> & {
        grid: GridStackComponent | GridStackLayoutComponent;
      })
    | undefined;
}
