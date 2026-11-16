import Component from '@glimmer/component';
import type {
  GridItemHTMLElement,
  GridStack,
  GridStackNode,
  GridStackOptions,
  GridStackWidget,
} from 'gridstack';
import type { GridStackSignature } from './grid-stack';

/** Layout JSON entry, as used by gridstack's React/Vue wrappers. */
export interface LayoutWidget extends GridStackWidget {
  component?: string;
  props?: Record<string, unknown>;
}

export interface LayoutWidgetContext {
  readonly id: string;
  readonly component?: string;
  readonly props?: Record<string, unknown>;
  readonly node: GridStackNode;
  readonly element: GridItemHTMLElement;
  readonly contentElement: HTMLElement;
  /** survives a cross-grid move */
  state: Record<string, unknown>;
  registerSerializer(fn: () => Record<string, unknown>): () => void;
  resizeToContent(): void;
}

export interface GridStackLayoutSignature {
  Args: GridStackSignature['Args'] & {
    layout?: LayoutWidget[];
    options?: GridStackOptions;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    components?: Record<string, any>;
  };
  Blocks: {
    default: [widget: LayoutWidgetContext, grid: GridStackLayoutComponent];
  };
  Element: HTMLDivElement;
}

export default class GridStackLayoutComponent extends Component<GridStackLayoutSignature> {
  readonly instance: GridStack | null;
  gridStack: GridStack | null;
  addWidget(w: LayoutWidget): GridItemHTMLElement | undefined;
  removeWidget(
    idOrEl: string | HTMLElement,
    removeDOM?: boolean,
    triggerEvent?: boolean,
  ): void;
  save(saveContent?: boolean, ...args: unknown[]): LayoutWidget[] | undefined;
  load(layout: LayoutWidget[], addRemove?: boolean): GridStack | undefined;
  compact(...args: unknown[]): GridStack | undefined;
  enableMove(doEnable: boolean, recurse?: boolean): GridStack | undefined;
  enableResize(doEnable: boolean, recurse?: boolean): GridStack | undefined;
  setMode(mode: string): GridStack | undefined;
  removeAll(removeDOM?: boolean, triggerEvent?: boolean): GridStack | undefined;
}
