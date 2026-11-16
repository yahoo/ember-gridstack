import { tracked } from '@glimmer/tracking';
import { htmlSafe } from '@ember/template';
import { render, settled, find } from '@ember/test-helpers';
import { setupRenderingTest } from './index';
import GridStack, {
  GRID_STACK_EVENTS,
  capitalize,
} from 'ember-gridstack/components/grid-stack';
import GridStackItem from 'ember-gridstack/components/grid-stack-item';
import { pointerDrag, resizeDrag } from './grid';

export class Item {
  @tracked options;

  constructor(id, options) {
    this.id = String(id);
    this.options = options;
  }
}

function toItem(item) {
  if (item instanceof Item) return item;
  const { id, ...options } = item;
  return new Item(id, options);
}

function idsOf(arg) {
  if (Array.isArray(arg)) return arg.map((node) => node?.el?.dataset.id);
  if (arg instanceof Element) return [arg.dataset.id];
  return [];
}

/** Records every `@on*` call as `{ name, ids, args }`. */
export class EventRecorder extends Array {
  static get [Symbol.species]() {
    return Array;
  }

  constructor() {
    super();
    this.handlers = {};
    GRID_STACK_EVENTS.forEach((name) => {
      this.handlers[`on${capitalize(name)}`] = (...args) =>
        this.push({ name, ids: idsOf(args[1]), args });
    });
  }

  of(name) {
    return this.filter((e) => e.name === name);
  }

  names() {
    return this.map((e) => e.name);
  }

  clear() {
    this.length = 0;
  }
}

const defaultTemplate = (d) => {
  const h = d.events.handlers;
  return <template>
    {{! template-lint-disable no-inline-styles }}
    {{#if d.visible}}
      <div style={{d.style}}>
        <GridStack
          @options={{d.gridOptions}}
          @onAdded={{h.onAdded}}
          @onChange={{h.onChange}}
          @onDisable={{h.onDisable}}
          @onDrag={{h.onDrag}}
          @onDragstart={{h.onDragstart}}
          @onDragstop={{h.onDragstop}}
          @onDropped={{h.onDropped}}
          @onEnable={{h.onEnable}}
          @onRemoved={{h.onRemoved}}
          @onResize={{h.onResize}}
          @onResizecontent={{h.onResizecontent}}
          @onResizestart={{h.onResizestart}}
          @onResizestop={{h.onResizestop}}
        >
          {{#each d.items key="id" as |item|}}
            <GridStackItem data-id={{item.id}} @options={{item.options}}>
              {{item.id}}
            </GridStackItem>
          {{/each}}
        </GridStack>
      </div>
    {{/if}}
  </template>;
};

export class GridDriver {
  @tracked items = [];
  @tracked gridOptions;
  @tracked visible = true;
  width = '1000px';

  constructor(events) {
    this.events = events;
  }

  /** Renders the grid, then clears the events recorded during setup. */
  async render({ options, items = [], width, template } = {}) {
    this.gridOptions = options;
    this.items = items.map(toItem);
    if (width) this.width = width;
    this.usesDefaultTemplate = !template;
    await render((template ?? defaultTemplate)(this));
    this.events.clear();
  }

  get style() {
    return htmlSafe(`width: ${this.width}`);
  }

  get element() {
    return find('.grid-stack');
  }

  get instance() {
    return this.element?.gridstack;
  }

  el(id) {
    return find(`[data-id="${id}"]`);
  }

  node(id) {
    return this.el(id).gridstackNode;
  }

  async add(item) {
    this.items = [...this.items, toItem(item)];
    await settled();
  }

  async setItems(items) {
    this.items = items.map(toItem);
    await settled();
  }

  async remove(id) {
    this.items = this.items.filter((i) => i.id !== String(id));
    await settled();
  }

  /** Replaces an item's `@options`. */
  async update(id, options) {
    this.items.find((i) => i.id === String(id)).options = options;
    await settled();
  }

  /** Moves an item through gridstack itself, behind Ember's back. */
  async move(id, { x, y }) {
    this.instance.update(this.el(id), { x, y });
    await settled();
  }

  /** Drags an item by a pixel offset. */
  drag(id, dx, dy) {
    return pointerDrag(this.el(id), dx, dy);
  }

  /** Drags an item to a cell. */
  dragTo(id, { x, y }) {
    const { x: x0, y: y0 } = this.node(id);
    return this.drag(
      id,
      (x - x0) * this.instance.cellWidth(),
      (y - y0) * this.instance.getCellHeight(true),
    );
  }

  /** Resizes an item by a number of cells with the bottom-right handle. */
  resize(id, dw, dh) {
    return resizeDrag(
      this.el(id),
      dw * this.instance.cellWidth(),
      dh * this.instance.getCellHeight(true),
    );
  }

  async setOptions(patch) {
    this.gridOptions = { ...this.gridOptions, ...patch };
    await settled();
  }

  /** Unrenders the default template's grid. */
  async destroy() {
    this.visible = false;
    await settled();
  }

  /** `{ id: { x, y, w, h } }` from gridstack's nodes */
  layout() {
    const layout = {};
    document
      .querySelectorAll('#ember-testing .grid-stack-item')
      .forEach((el) => {
        const { x, y, w, h } = el.gridstackNode ?? {};
        layout[el.dataset.id] = { x, y, w, h };
      });
    return layout;
  }

  domOrder() {
    return [
      ...document.querySelectorAll('#ember-testing .grid-stack-item'),
    ].map((el) => el.dataset.id);
  }
}

/**
 * gridstack sets `el.gridstack = this` when it creates an instance; an accessor on
 * HTMLElement.prototype sees every instance, including ones that are re-created.
 */
function trackInstances() {
  const created = [];
  Object.defineProperty(HTMLElement.prototype, 'gridstack', {
    configurable: true,
    get() {
      return undefined;
    },
    set(value) {
      if (value) created.push(value);
      Object.defineProperty(this, 'gridstack', {
        configurable: true,
        enumerable: true,
        writable: true,
        value,
      });
    },
  });
  return created;
}

function teardownProblems(created) {
  const problems = [];
  if (document.querySelector('#ember-testing .grid-stack')) {
    problems.push('a .grid-stack is still rendered');
  }
  const alive = created.filter((gs) => gs.engine || gs.el).length;
  if (alive) {
    problems.push(
      `${alive} of ${created.length} GridStack instances not destroyed`,
    );
  }
  return problems;
}

/**
 * Rendering test setup plus `this.grid` (GridDriver), `this.events` (EventRecorder)
 * and a check after each test that every grid was torn down.
 */
export function setupGridTest(hooks) {
  // registered before setupRenderingTest so afterEach runs after its teardown
  hooks.beforeEach(function () {
    this.events = new EventRecorder();
    this.grid = new GridDriver(this.events);
    this.createdInstances = trackInstances();
  });

  hooks.afterEach(function (assert) {
    delete HTMLElement.prototype.gridstack;
    const problems = teardownProblems(this.createdInstances);
    // pass silently so assert.expect() counts stay the test's own
    if (problems.length) {
      assert.pushResult({
        result: false,
        actual: problems,
        expected: [],
        message: `teardown: ${problems.join('; ')}`,
      });
    }
  });

  setupRenderingTest(hooks);
}
