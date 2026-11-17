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
import { GridStack } from 'gridstack';
import lifecycle from '../utils/lifecycle.js';
import { installLayoutCallbacks } from '../utils/layout-callbacks.js';
import {
  registerGridElement,
  unregisterGridElement,
} from '../utils/grid-elements.js';
import { GRID_STACK_EVENTS, capitalize } from '../utils/events.js';

// source grid's `removed` fires before the target's `added`, both inside one drop
const pendingDrops = new Map();
const KEEP = Symbol('unstable_keep');

class Widget {
  @tracked node;
  @tracked props;
  @tracked grid;
  serializers = new Set();
  beforeRemoveFns = new Set();
  droppedFrom = undefined;
  /** source grid that still renders this record after `unstable_keep` */
  lentBy = null;

  constructor(id, w, el, grid) {
    this.id = id;
    this.node = w;
    this.props = w.props;
    this.component = w.component;
    this.element = el;
    this.contentElement = el.querySelector('.grid-stack-item-content');
    this.grid = grid;
  }

  registerSerializer = (fn) => {
    this.serializers.add(fn);
    return () => this.serializers.delete(fn);
  };

  beforeRemove = (fn) => {
    this.beforeRemoveFns.add(fn);
    return () => this.beforeRemoveFns.delete(fn);
  };

  runBeforeRemove(allowKeep) {
    const ctx = { unstable_keep: allowKeep ? () => KEEP : undefined };
    let state;
    let keep = false;
    this.beforeRemoveFns.forEach((fn) => {
      const result = fn(ctx);
      if (result === KEEP) keep = true;
      else if (state === undefined) state = result;
    });
    return { keep, state };
  }

  resizeToContent = () => {
    this.grid.gridStack?.resizeToContent(this.element);
  };
}

const and = (a, b) => a && b;

export default class GridStackLayoutComponent extends Component {
  isEmberLayoutGrid = true;
  @tracked widgets = [];
  gridStack = null;
  subscribedEvents = [];
  _records = new Map();
  /** records owned by another grid that this grid keeps rendering */
  _lent = new Map();
  _flushScheduled = false;

  get api() {
    return this;
  }

  get instance() {
    return this.gridStack;
  }

  componentFor = (name) => this.args.components?.[name];

  // gridstack calls back synchronously (also during render), so the tracked
  // array is only replaced after render
  _scheduleFlush() {
    if (this._flushScheduled) return;
    this._flushScheduled = true;
    schedule('afterRender', this, this._flush);
  }

  _flush() {
    this._flushScheduled = false;
    if (this.isDestroying || this.isDestroyed) return;
    const own = [...this._records.values()].filter((r) => !r.lentBy);
    this.widgets = [...own, ...this._lent.values()];
    // plain property read by the rebuilt component's constructor; the rerender
    // this triggers runs after any afterRender job queued here, so wait a loop
    next(this, this._clearDroppedFrom);
  }

  _clearDroppedFrom() {
    this._records.forEach((r) => (r.droppedFrom = undefined));
  }

  /** Cross-grid drop out of this grid: collect state before the target rebuilds. */
  _collectDrops(nodes) {
    nodes?.forEach((n) => {
      const el = n.el;
      const ref = el?._gridItemRef;
      const target = el?.gridstackNode?.grid;
      if (ref?.gridComp !== this || !target || target === this.gridStack) {
        return;
      }
      const record = this._records.get(ref.id);
      if (!record) return;
      const { keep, state } = record.runBeforeRemove(true);
      if (keep) {
        const lender = record.lentBy ?? this;
        lender._lent.set(ref.id, record);
        record.lentBy = lender;
        pendingDrops.set(ref.id, { keep: true });
      } else {
        pendingDrops.set(ref.id, { grid: this.api, state });
      }
    });
  }

  /** The lender stops rendering `record`; returns its final state. */
  _release(record) {
    const lender = record.lentBy;
    record.lentBy = null;
    if (!lender || lender._lent.get(record.id) !== record) return undefined;
    lender._lent.delete(record.id);
    lender._scheduleFlush();
    return record.runBeforeRemove(false).state;
  }

  /** Replaces `record` with a fresh one so this grid renders it itself. */
  _rebuild(record, droppedFrom, node = record.node) {
    const widget = new Widget(record.id, node, record.element, this);
    widget.props = record.props ?? node.props;
    widget.component = record.component ?? node.component;
    widget.droppedFrom = droppedFrom;
    this._records.set(record.id, widget);
    this._scheduleFlush();
  }

  registerWidget(id, w, el) {
    this._records.set(id, new Widget(id, w, el, this));
    this._scheduleFlush();
  }

  unregisterWidget(id) {
    const record = this._records.get(id);
    if (!record) return;
    this._records.delete(id);
    this._release(record);
    this._scheduleFlush();
  }

  /** Cross-grid drop into this grid: rebuild the widget here. */
  adoptWidget(el) {
    const ref = el._gridItemRef;
    if (!ref || ref.gridComp === this) return;
    const old = ref.gridComp;
    if (!old?.isEmberLayoutGrid) return;
    const { id } = ref;
    const prev = old._records.get(id);
    const node = el.gridstackNode;
    const pending = pendingDrops.get(id);
    pendingDrops.delete(id);
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

  mergeWidgetPropsForSave(id, w) {
    const record = this._records.get(id);
    if (!record) return;
    let extra = {};
    record.serializers.forEach((fn) => (extra = { ...extra, ...fn() }));
    if (Object.keys(extra).length) w.props = { ...w.props, ...extra };
  }

  requestUpdate(id, node) {
    const record = this._records.get(id);
    if (!record) return;
    record.node = node;
    record.props = node.props;
  }

  @action
  setup(elm) {
    this.elm = elm;
    registerGridElement(elm, this);
    this._uninstall = installLayoutCallbacks();
    elm._gridComp = this;
    this._lastLayout = this.args.layout;
    this._lastOptions = this.args.options;
    this.gridStack = GridStack.init(
      {
        ...this.args.options,
        children: this.args.layout ?? this.args.options?.children ?? [],
      },
      elm,
    );

    GRID_STACK_EVENTS.forEach((eventName) => {
      const argName = `on${capitalize(eventName)}`;
      const gridStack = this.gridStack;
      gridStack.on(eventName, (event, ...rest) => {
        if (eventName === 'removed') this._collectDrops(rest[0]);
        if (eventName === 'added') {
          rest[0]?.forEach((n) => n.el && this.adoptWidget(n.el));
        }
        const handler = this.args[argName];
        if (handler) {
          schedule('afterRender', gridStack, handler, event, ...rest);
        }
      });
      this.subscribedEvents.push(eventName);
    });
  }

  @action
  update() {
    const { layout, options } = this.args;
    if (options !== this._lastOptions) {
      this._lastOptions = options;
      // eslint-disable-next-line no-unused-vars
      const { children, ...opts } = options ?? {};
      this.gridStack?.updateOptions(opts);
    }
    if (layout !== this._lastLayout) {
      this._lastLayout = layout;
      // diffs by id: same id updated in place, new added, missing removed
      if (layout) this.gridStack?.load(layout);
    }
  }

  @action
  willDestroyNode() {
    const { gridStack } = this;
    if (gridStack) {
      this.subscribedEvents.forEach((e) => gridStack.off(e));
      this.subscribedEvents = [];
      gridStack.destroy(false);
      this.gridStack = null;
    }
    const owners = new Set();
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
    delete this.elm._gridComp;
    this._uninstall?.();
    unregisterGridElement(this.elm);
  }

  @action
  addWidget(w) {
    return this.gridStack?.addWidget(w);
  }

  @action
  removeWidget(idOrEl, removeDOM = true, triggerEvent = true) {
    const el =
      typeof idOrEl === 'string' ? this._records.get(idOrEl)?.element : idOrEl;
    if (el) this.gridStack?.removeWidget(el, removeDOM, triggerEvent);
  }

  @action
  compact(layout, doSort) {
    return this.gridStack?.compact(layout, doSort);
  }

  @action
  save(...args) {
    return this.gridStack?.save(...args);
  }

  @action
  load(layout, addRemove) {
    return this.gridStack?.load(layout, addRemove);
  }

  @action
  enableMove(doEnable, recurse) {
    return this.gridStack?.enableMove(doEnable, recurse);
  }

  @action
  enableResize(doEnable, recurse) {
    return this.gridStack?.enableResize(doEnable, recurse);
  }

  @action
  setMode(mode) {
    return this.gridStack?.mode(mode);
  }

  @action
  removeAll(removeDOM = true, triggerEvent = true) {
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
