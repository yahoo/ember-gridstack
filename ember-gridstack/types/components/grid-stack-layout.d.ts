import Component from '@glimmer/component';
import type { TemplateOnlyComponent } from '@ember/component/template-only';
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
  /** the grid that owns the widget (tracked; changes on an `unstable_keep` drop) */
  readonly grid: GridStackLayoutComponent;
  /** set while a widget rebuilt by a cross-grid drop is first rendered */
  readonly droppedFrom?: DroppedFrom;
  registerSerializer(fn: () => Record<string, unknown>): () => void;
  /**
   * Runs before a cross-grid drop rebuilds the widget elsewhere; the first
   * non-undefined return value becomes `droppedFrom.state` in the new grid.
   */
  beforeRemove(fn: (ctx: BeforeRemoveContext) => unknown): () => void;
  resizeToContent(): void;
}

export interface DroppedFrom {
  grid: GridStackLayoutComponent;
  state: unknown;
}

export interface BeforeRemoveContext {
  /** Data mode only, source grid alive: return its result to keep the component instance. Unstable. */
  unstable_keep?: () => unknown;
}

export interface WidgetComponentSignature {
  Args: {
    props?: Record<string, unknown>;
    grid: GridStackLayoutComponent;
    widget: LayoutWidgetContext;
  };
}

/** A component class or template-only component rendered for a widget. */
export type WidgetComponent =
  | (abstract new (owner: never, args: never) => object)
  | TemplateOnlyComponent<never>;

export interface GridStackLayoutSignature {
  Args: GridStackSignature['Args'] & {
    layout?: LayoutWidget[];
    name?: string;
    options?: GridStackOptions;
    components?: Record<string, WidgetComponent>;
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
