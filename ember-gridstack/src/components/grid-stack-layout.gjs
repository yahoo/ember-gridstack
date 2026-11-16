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
import { schedule } from '@ember/runloop';
import { GridStack } from 'gridstack';
import lifecycle from '../utils/lifecycle.js';
import { installLayoutCallbacks } from '../utils/layout-callbacks.js';
import {
  registerGridElement,
  unregisterGridElement,
} from '../utils/grid-elements.js';
import { GRID_STACK_EVENTS, capitalize } from '../utils/events.js';

class Widget {
  @tracked node;
  @tracked props;
  /** survives a cross-grid move; component instances do not */
  state = {};
  serializers = new Set();

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
    this.widgets = [...this._records.values()];
  }

  registerWidget(id, w, el) {
    this._records.set(id, new Widget(id, w, el, this));
    this._scheduleFlush();
  }

  unregisterWidget(id) {
    if (this._records.delete(id)) this._scheduleFlush();
  }

  /** Cross-grid drop: move the same record from its old grid to this one. */
  adoptWidget(el) {
    const ref = el._gridItemRef;
    if (!ref || ref.gridComp === this) return;
    const old = ref.gridComp;
    if (!old?.isEmberLayoutGrid) return;
    const record = old._records.get(ref.id);
    old.unregisterWidget(ref.id);
    ref.gridComp = this;
    if (record) {
      record.grid = this;
      record.node = el.gridstackNode;
      this._records.set(ref.id, record);
      this._scheduleFlush();
    } else {
      this.registerWidget(ref.id, el.gridstackNode, el);
    }
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
    // eslint-disable-next-line no-unused-vars
    const { children, ...opts } = this.args.options ?? {};
    this.gridStack?.updateOptions(opts);
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
  save(saveContent = false, ...args) {
    return this.gridStack?.save(saveContent, ...args);
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
