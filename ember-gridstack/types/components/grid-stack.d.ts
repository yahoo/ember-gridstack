import Component from '@glimmer/component';
import type { LayoutWidget, WidgetComponent } from './grid-stack-layout';
import type {
  AddRemoveFcn,
  CompactOptions,
  GridItemHTMLElement,
  GridStack,
  GridStackEvent,
  GridStackMode,
  GridStackNode,
  GridStackOptions,
  GridStackWidget,
  SaveFcn,
} from 'gridstack';
import type GridStackItem from './grid-stack-item';

type NodesHandler = (event: Event, nodes: GridStackNode[]) => void;
type ElementHandler = (event: Event, el: GridItemHTMLElement) => void;
type EventHandler = (event: Event) => void;
type DroppedHandler = (
  event: Event,
  previousNode: GridStackNode | undefined,
  newNode: GridStackNode,
) => void;

export interface GridStackSignature {
  Args: {
    options?: GridStackOptions;
    /** data mode: see `grid-stack-layout` */
    layout?: LayoutWidget[];
    components?: Record<string, WidgetComponent>;
    onAdded?: NodesHandler;
    onChange?: NodesHandler;
    onRemoved?: NodesHandler;
    onResizecontent?: NodesHandler;
    onDisable?: EventHandler;
    onEnable?: EventHandler;
    onDragstart?: ElementHandler;
    onDrag?: ElementHandler;
    onDragstop?: ElementHandler;
    onResizestart?: ElementHandler;
    onResize?: ElementHandler;
    onResizestop?: ElementHandler;
    onDropped?: DroppedHandler;
  };
  Blocks: { default: [grid: GridStackComponent] };
  Element: HTMLDivElement;
}

export const GRID_STACK_EVENTS: GridStackEvent[];
export const REINIT_OPTIONS: string[];
export function capitalize(string: string): string;

export default class GridStackComponent extends Component<GridStackSignature> {
  /** `<GridStackItem>` bound to this grid. */
  Item: typeof GridStackItem;
  /** @deprecated use `instance` */
  gridStack: GridStack | null;
  readonly instance: GridStack | null;
  readonly options: GridStackOptions;
  compact(layout?: CompactOptions, doSort?: boolean): GridStack | undefined;
  save(
    saveContent?: boolean,
    saveGridOpt?: boolean,
    saveCB?: SaveFcn,
    column?: number,
  ): GridStackWidget[] | GridStackOptions | undefined;
  load(
    layout: GridStackWidget[],
    addRemove?: boolean | AddRemoveFcn,
  ): GridStack | undefined;
  enableMove(doEnable: boolean, recurse?: boolean): GridStack | undefined;
  enableResize(doEnable: boolean, recurse?: boolean): GridStack | undefined;
  setMode(mode: GridStackMode): GridStack | undefined;
  removeAll(removeDOM?: boolean, triggerEvent?: boolean): GridStack | undefined;
  addWidget(element: HTMLElement): void;
  removeWidget(
    element: HTMLElement,
    removeDOM?: boolean,
    triggerEvent?: boolean,
  ): void;
}
