/**
 * Data-driven grid: gridstack creates and owns the item elements from
 * `@layout` (React/Vue wrapper JSON), Ember renders each widget's content
 * into its `.grid-stack-item-content` with `{{#in-element}}`.
 *
 *   <GridStack @layout={{this.layout}} as |widget grid|>…</GridStack>
 */
import 'gridstack/dist/gridstack.css';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { run, next, schedule } from '@ember/runloop';
import type { TemplateOnlyComponent } from '@ember/component/template-only';
import { GridStack } from 'gridstack';
import type {
  AddRemoveFcn,
  CompactOptions,
  GridItemHTMLElement,
  GridStackMode,
  GridStackNode,
  GridStackOptions,
  GridStackWidget,
  SaveFcn,
} from 'gridstack';
import lifecycle from '../utils/lifecycle.ts';
import BeforeRemove, { KEEP } from '../utils/before-remove.ts';
import {
  installLayoutCallbacks,
  layoutSave,
} from '../utils/layout-callbacks.ts';
import type {
  LayoutGridElement,
  LayoutItemElement,
} from '../utils/layout-callbacks.ts';
import {
  registry,
  registerGridElement,
  unregisterGridElement,
} from '../utils/grid-elements.ts';
import type GridStackRegistry from '../services/grid-stack-registry.ts';
import { GRID_STACK_EVENTS, capitalize } from '../utils/events.ts';
import { REINIT_OPTIONS, sameOption, sameLayout } from '../utils/options.ts';
import {
  ID_COLLISION_MESSAGE,
  WARN_ID_COLLISION,
  dropWarn,
  hasIdCollision,
} from '../utils/cross-grid.ts';
import type { AnyHandler, GridStackSignature } from './grid-stack.gts';

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

type Pending = { keep: true } | (DroppedFrom & { keep?: undefined });

/** what `_rebuild` needs from the record it replaces */
type RecordLike = Pick<Widget, 'id' | 'element'> &
  Partial<Pick<Widget, 'props' | 'component' | 'node'>>;

class Widget implements LayoutWidgetContext {
  @tracked node: LayoutWidget & GridStackNode;
  @tracked props: Record<string, unknown> | undefined;
  @tracked grid: GridStackLayoutComponent;
  id: string;
  component: string | undefined;
  element: LayoutItemElement;
  contentElement: HTMLElement;
  serializers = new Set<() => Record<string, unknown>>();
  _beforeRemove = new BeforeRemove<BeforeRemoveContext>();
  droppedFrom: DroppedFrom | undefined = undefined;
  /** source grid that still renders this record after `unstable_keep` */
  lentBy: GridStackLayoutComponent | null = null;

  constructor(
    id: string,
    w: LayoutWidget & GridStackNode,
    el: LayoutItemElement,
    grid: GridStackLayoutComponent,
  ) {
    this.id = id;
    this.node = w;
    this.props = w.props;
    this.component = w.component;
    this.element = el;
    this.contentElement = el.querySelector(
      '.grid-stack-item-content',
    ) as HTMLElement;
    this.grid = grid;
  }

  registerSerializer = (fn: () => Record<string, unknown>) => {
    this.serializers.add(fn);
    return () => this.serializers.delete(fn);
  };

  beforeRemove = this._beforeRemove.add;

  runBeforeRemove(allowKeep: boolean): { keep: boolean; state: unknown } {
    return this._beforeRemove.run({
      unstable_keep: allowKeep ? () => KEEP : undefined,
    });
  }

  resizeToContent = () => {
    this.grid.gridStack?.resizeToContent(this.element);
  };
}

const and = (a: unknown, b: unknown) => a && b;

export default class GridStackLayoutComponent extends Component<GridStackLayoutSignature> {
  /** @internal */
  isEmberLayoutGrid = true;
  @tracked private widgets: Widget[] = [];
  gridStack: GridStack | null = null;
  private elm?: LayoutGridElement;
  private subscribedEvents: string[] = [];
  /** @internal */
  _records = new Map<string, Widget>();
  /** @internal records owned by another grid that this grid keeps rendering */
  _lent = new Map<string, Widget>();
  /** @internal id leaving this grid -> drop info; `removed` fires before the target's `added` */
  _pending = new Map<string, Pending>();
  private _flushScheduled = false;
  private _warnedCollision = false;
  private _name?: string;
  private _registry?: GridStackRegistry;
  private _uninstall?: () => void;
  private _lastLayout?: LayoutWidget[];
  private _lastOptions?: GridStackOptions;

  // one stable function: a new one per update would make gridstack re-init
  private _accept = (el: Element): boolean => {
    const option = this.args.options?.acceptWidgets;
    let ok;
    if (typeof option === 'function') ok = option(el);
    else if (option === true) ok = el.matches('.grid-stack-item');
    else ok = typeof option === 'string' && el.matches(option);
    if (!ok) return false;
    if (
      hasIdCollision(this.gridStack, (el as GridItemHTMLElement).gridstackNode)
    ) {
      if (!this._warnedCollision) {
        this._warnedCollision = true;
        dropWarn(ID_COLLISION_MESSAGE, WARN_ID_COLLISION);
      }
      return false;
    }
    return true;
  };

  private _withAccept(opts: GridStackOptions | undefined) {
    return opts?.acceptWidgets
      ? { ...opts, acceptWidgets: this._accept }
      : opts;
  }

  private get api(): this {
    return this;
  }

  get instance(): GridStack | null {
    return this.gridStack;
  }

  private componentFor = (name: string | undefined) =>
    name === undefined ? undefined : this.args.components?.[name];

  // gridstack calls back synchronously (also during render), so the tracked
  // array is only replaced after render
  /** @internal */
  _scheduleFlush() {
    if (this._flushScheduled) return;
    this._flushScheduled = true;
    schedule('afterRender', () => this._flush());
  }

  /** @internal */
  _flush() {
    this._flushScheduled = false;
    if (this.isDestroying || this.isDestroyed) return;
    const own = [...this._records.values()].filter((r) => !r.lentBy);
    this.widgets = [...own, ...this._lent.values()];
    // plain property read by the rebuilt component's constructor; the rerender
    // this triggers runs after any afterRender job queued here, so wait a loop
    next(() => this._clearDroppedFrom());
  }

  private _clearDroppedFrom() {
    this._records.forEach((r) => (r.droppedFrom = undefined));
  }

  /** Cross-grid drop out of this grid: collect state before the target rebuilds. */
  private _collectDrops(nodes: GridStackNode[] | undefined) {
    nodes?.forEach((n) => {
      const el: LayoutItemElement | undefined = n.el;
      const ref = el?._gridItemRef;
      const target = el?.gridstackNode?.grid;
      if (
        !ref ||
        ref.gridComp !== this ||
        !target ||
        target === this.gridStack
      ) {
        return;
      }
      const record = this._records.get(ref.id);
      if (!record) return;
      const { keep, state } = record.runBeforeRemove(true);
      if (keep) {
        const lender = record.lentBy ?? this;
        lender._lent.set(ref.id, record);
        record.lentBy = lender;
        this._pending.set(ref.id, { keep: true });
      } else {
        this._pending.set(ref.id, { grid: this.api, state });
      }
    });
  }

  /** The lender stops rendering `record`; returns its final state. */
  private _release(record: Widget): unknown {
    const lender = record.lentBy;
    record.lentBy = null;
    if (!lender || lender._lent.get(record.id) !== record) return undefined;
    lender._lent.delete(record.id);
    lender._scheduleFlush();
    return record.runBeforeRemove(false).state;
  }

  /** @internal Replaces `record` with a fresh one so this grid renders it itself. */
  _rebuild(
    record: RecordLike,
    droppedFrom: DroppedFrom | undefined,
    node = record.node!,
  ) {
    const widget = new Widget(record.id, node, record.element, this);
    widget.props = record.props ?? node.props;
    widget.component = record.component ?? node.component;
    widget.droppedFrom = droppedFrom;
    this._records.set(record.id, widget);
    this._scheduleFlush();
  }

  /** @internal */
  registerWidget(id: string, w: LayoutWidget, el: LayoutItemElement) {
    this._records.set(id, new Widget(id, w, el, this));
    this._scheduleFlush();
  }

  /** @internal */
  unregisterWidget(id: string) {
    const record = this._records.get(id);
    if (!record) return;
    this._records.delete(id);
    this._release(record);
    this._scheduleFlush();
  }

  /** Cross-grid drop into this grid: rebuild the widget here. */
  private adoptWidget(el: LayoutItemElement) {
    const ref = el._gridItemRef;
    if (!ref || ref.gridComp === this) return;
    const old = ref.gridComp as GridStackLayoutComponent | undefined;
    if (!old?.isEmberLayoutGrid) return;
    const { id } = ref;
    const prev = old._records.get(id);
    const node = el.gridstackNode as LayoutWidget & GridStackNode;
    const pending = old._pending.get(id);
    old._pending.delete(id);
    old._records.delete(id);
    old._scheduleFlush();
    ref.gridComp = this;
    if (prev && pending?.keep) {
      prev.grid = this;
      prev.node = node;
      if (prev.lentBy === this) {
        this._lent.delete(id);
        prev.lentBy = null;
      }
      this._records.set(id, prev);
      this._scheduleFlush();
      return;
    }
    if (prev?.lentBy) {
      prev.lentBy._lent.delete(id);
      prev.lentBy._scheduleFlush();
    }
    this._rebuild(
      prev ?? { id, element: el },
      pending?.keep ? undefined : pending,
      node,
    );
  }

  /** @internal */
  mergeWidgetPropsForSave(id: string, w: LayoutWidget) {
    const record = this._records.get(id);
    if (!record) return;
    let extra: Record<string, unknown> = {};
    record.serializers.forEach((fn) => (extra = { ...extra, ...fn() }));
    if (Object.keys(extra).length) w.props = { ...w.props, ...extra };
  }

  /** @internal */
  requestUpdate(id: string, node: LayoutWidget & GridStackNode) {
    const record = this._records.get(id);
    if (!record) return;
    record.node = node;
    record.props = node.props;
  }

  @action
  private setup(elm: LayoutGridElement) {
    this.elm = elm;
    registerGridElement(elm, this);
    this._name = this.args.name;
    if (this._name) {
      this._registry = registry(this);
      this._registry.registerName(this._name, this.api);
    }
    this._uninstall = installLayoutCallbacks();
    elm._gridComp = this;
    this._lastLayout = this.args.layout;
    this._lastOptions = this.args.options;
    this._create(this.args.layout ?? this.args.options?.children ?? []);
  }

  private _create(children: LayoutWidget[]) {
    const elm = this.elm!;
    try {
      this.gridStack = GridStack.init(
        { ...this._withAccept(this.args.options), children },
        elm,
      );
    } catch (e) {
      // e.g. the nested-grid assert, thrown while gridstack loads children
      (elm as LayoutGridElement & { gridstack?: GridStack }).gridstack?.destroy(
        false,
      );
      throw e;
    }
    // scoped to this instance so template-API grids still save `content`
    const gs = this.gridStack;
    if (!gs) return;
    // eslint-disable-next-line @typescript-eslint/unbound-method -- invoked with .call
    const save = GridStack.prototype.save;
    gs.save = (content, gridOpt, cb = layoutSave, column) =>
      save.call(gs, content, gridOpt, cb, column);

    GRID_STACK_EVENTS.forEach((eventName) => {
      const argName = `on${capitalize(eventName)}` as const;
      gs.on(eventName, (event: Event, ...rest: unknown[]) => {
        const nodes = rest[0] as GridStackNode[] | undefined;
        if (eventName === 'removed') this._collectDrops(nodes);
        if (eventName === 'added') {
          nodes?.forEach((n) => n.el && this.adoptWidget(n.el));
        }
        const handler = this.args[argName] as AnyHandler | undefined;
        if (handler) {
          schedule('afterRender', gs, handler, event, ...rest);
        }
      });
      this.subscribedEvents.push(eventName);
    });
  }

  @action
  private update() {
    const { layout, options } = this.args;
    const prev = (this._lastOptions ?? {}) as Record<string, unknown>;
    const next = (options ?? {}) as Record<string, unknown>;
    this._lastOptions = options;
    let reinit = false;
    const changed: Record<string, unknown> = {};
    for (const key of new Set([...Object.keys(prev), ...Object.keys(next)])) {
      if (key === 'children' || sameOption(prev[key], next[key])) continue;
      if (!(key in next) || REINIT_OPTIONS.includes(key)) reinit = true;
      else changed[key] = next[key];
    }
    if (reinit) this._reinit();
    else if (Object.keys(changed).length) {
      this.gridStack?.updateOptions(this._withAccept(changed) ?? {});
    }
    if (layout !== this._lastLayout) {
      this._lastLayout = layout;
      // diffs by id: same id updated in place, new added, missing removed
      if (layout) this.gridStack?.load(layout);
    }
  }

  private _reinit() {
    const gs = this.gridStack;
    if (!gs || !this.elm) return;
    const saved = gs.save(true, false) as LayoutWidget[];
    this.subscribedEvents.forEach((e) => gs.off(e));
    this.subscribedEvents = [];
    gs.removeAll(true, false);
    gs.destroy(false);
    this.gridStack = null;
    const elm = this.elm;
    [...elm.classList]
      .filter((x) => /grid-stack-instance-\d*/.test(x))
      .forEach((x) => elm.classList.remove(x));
    this._create(saved);
  }

  @action
  private willDestroyNode() {
    const { gridStack } = this;
    if (gridStack) {
      this.subscribedEvents.forEach((e) => gridStack.off(e));
      this.subscribedEvents = [];
      gridStack.destroy(false);
      this.gridStack = null;
    }
    const owners = new Set<GridStackLayoutComponent>();
    this._lent.forEach((record) => {
      this._lent.delete(record.id);
      record.lentBy = null;
      const { state } = record.runBeforeRemove(false);
      record.grid._rebuild(record, { grid: this.api, state });
      owners.add(record.grid);
    });
    // destructors run after this grid's DOM is gone and a flush queued here
    // renders in a later autorun (observed); a nested run renders it now
    if (owners.size) run(() => owners.forEach((o) => o._flush()));
    this._records.forEach((record) => this._release(record));
    this._records.clear();
    if (this.elm) {
      delete this.elm._gridComp;
      unregisterGridElement(this.elm);
    }
    this._uninstall?.();
    if (this._name) this._registry?.unregisterName(this._name, this.api);
  }

  @action
  addWidget(w: LayoutWidget): GridItemHTMLElement | undefined {
    return this.gridStack?.addWidget(w);
  }

  @action
  removeWidget(
    idOrEl: string | HTMLElement,
    removeDOM = true,
    triggerEvent = true,
  ): void {
    const el =
      typeof idOrEl === 'string' ? this._records.get(idOrEl)?.element : idOrEl;
    if (el) this.gridStack?.removeWidget(el, removeDOM, triggerEvent);
  }

  @action
  compact(layout?: CompactOptions, doSort?: boolean): GridStack | undefined {
    return this.gridStack?.compact(layout, doSort);
  }

  // the data-mode save callback adds `component`/`props`
  @action
  save(
    ...args: [
      saveContent?: boolean,
      saveGridOpt?: boolean,
      saveCB?: SaveFcn,
      column?: number,
    ]
  ): LayoutWidget[] | undefined {
    return this.gridStack?.save(...args) as LayoutWidget[] | undefined;
  }

  @action
  load(
    layout: LayoutWidget[],
    addRemove?: boolean | AddRemoveFcn,
  ): GridStack | undefined {
    return this.gridStack?.load(layout, addRemove);
  }

  @action
  enableMove(doEnable: boolean, recurse?: boolean): GridStack | undefined {
    return this.gridStack?.enableMove(doEnable, recurse);
  }

  @action
  enableResize(doEnable: boolean, recurse?: boolean): GridStack | undefined {
    return this.gridStack?.enableResize(doEnable, recurse);
  }

  @action
  setMode(mode: GridStackMode): GridStack | undefined {
    return this.gridStack?.mode(mode);
  }

  @action
  removeAll(removeDOM = true, triggerEvent = true): GridStack | undefined {
    return this.gridStack?.removeAll(removeDOM, triggerEvent);
  }

  <template>
    <div
      class="grid-stack"
      {{lifecycle
        setup=this.setup
        update=this.update
        teardown=this.willDestroyNode
        options=@options
        layout=@layout
      }}
      ...attributes
    >
      {{#each this.widgets key="id" as |widget|}}
        {{#in-element widget.contentElement insertBefore=null}}
          {{#let (this.componentFor widget.component) as |WidgetComponent|}}
            {{#if (and @components WidgetComponent)}}
              {{! WidgetComponent is an untyped class; its args are WidgetComponentSignature }}
              {{! @glint-expect-error }}
              <WidgetComponent
                @props={{widget.props}}
                @grid={{this.api}}
                @widget={{widget}}
              />
            {{else}}
              {{yield widget this.api}}
            {{/if}}
          {{/let}}
        {{/in-element}}
      {{/each}}
    </div>
  </template>
}
