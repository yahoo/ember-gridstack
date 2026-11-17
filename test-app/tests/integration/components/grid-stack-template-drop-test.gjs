import { module, test } from 'qunit';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import { hash } from '@ember/helper';
import { registerWarnHandler } from '@ember/debug';
import {
  click,
  find,
  findAll,
  settled,
  setupOnerror,
  resetOnerror,
} from '@ember/test-helpers';
import GridStack from 'ember-gridstack/components/grid-stack';
import GridStackItem from 'ember-gridstack/components/grid-stack-item';
import { setupGridTest } from '../../helpers/setup-grid-test';
import { pointerDrag } from '../../helpers/grid';

const lifecycle = { created: 0, destroyed: 0 };
const droppedFroms = [];

const warnings = [];
registerWarnHandler((message, options, next) => {
  warnings.push(options?.id);
  next(message, options);
});

class Counter extends Component {
  @tracked count = 0;

  constructor() {
    super(...arguments);
    lifecycle.created++;
    const { item } = this.args;
    if (item.droppedFrom) droppedFroms.push(item.droppedFrom);
    this.count = item.droppedFrom?.state ?? 0;
    item.beforeRemove(() => this.count);
  }

  willDestroy() {
    super.willDestroy(...arguments);
    lifecycle.destroyed++;
  }

  inc = () => this.count++;

  <template>
    <button type="button" class="inc" {{on "click" this.inc}}>
      {{this.count}}
    </button>
  </template>
}

const dragTo = (itemEl, x, y) => {
  const r = itemEl
    .querySelector('.grid-stack-item-content')
    .getBoundingClientRect();
  const fx = r.left + Math.min(10, r.width / 2);
  const fy = r.top + Math.min(10, r.height / 2);
  return pointerDrag(itemEl, x - fx, y - fy, 16);
};

const dragInto = (itemEl, sel, fx = 0.6, fy = 0.6) => {
  const r = find(sel).getBoundingClientRect();
  return dragTo(itemEl, r.left + r.width * fx, r.top + r.height * fy);
};

const dragIntoRight = (itemEl) => dragInto(itemEl, '#right');

class Lists {
  @tracked left = [{ id: 'a', options: { id: 'a', x: 0, y: 0, w: 2, h: 2 } }];
  @tracked right = [{ id: 'b', options: { id: 'b', x: 0, y: 0, w: 2, h: 2 } }];
  @tracked showLeft = true;
  grids = {};
  capture = (name, grid) => {
    this.grids[name] = grid;
    return '';
  };
}

const twoGrids =
  (lists, h, hr = h) =>
  (d) => <template>
    {{! template-lint-disable no-inline-styles }}
    {{#if d.visible}}
      <div style="display: flex; width: 1000px">
        <div style="width: 500px">
          {{#if lists.showLeft}}
            <GridStack
              id="left"
              @options={{hash acceptWidgets=true column=6 minRow=4}}
              @onDropped={{h.onDropped}}
              @onRemoved={{h.onRemoved}}
              as |grid|
            >
              {{lists.capture "left" grid}}
              {{#each lists.left key="id" as |item|}}
                <GridStackItem
                  data-id={{item.id}}
                  @options={{item.options}}
                  as |gi|
                ><Counter @item={{gi}} /></GridStackItem>
              {{/each}}
            </GridStack>
          {{/if}}
        </div>
        <div style="width: 500px">
          <GridStack
            id="right"
            @options={{hash acceptWidgets=true column=6 minRow=4}}
            @onDropped={{hr.onDropped}}
            @onRemoved={{hr.onRemoved}}
            as |grid|
          >
            {{lists.capture "right" grid}}
            {{#each lists.right key="id" as |item|}}
              <GridStackItem
                data-id={{item.id}}
                @options={{item.options}}
                as |gi|
              ><Counter @item={{gi}} /></GridStackItem>
            {{/each}}
          </GridStack>
        </div>
      </div>
    {{/if}}
  </template>;

const ids = (sel) =>
  findAll(`${sel} .grid-stack-item`).map((el) => el.dataset.id);
const nodeIds = (sel) =>
  find(sel)
    .gridstack.engine.nodes.map((n) => n.id)
    .sort();
const saved = (sel) =>
  find(sel)
    .gridstack.save(false)
    .map(({ id, x, y, w, h }) => ({ id, x, y, w, h }))
    .sort((a, b) => (a.id < b.id ? -1 : 1));
const movedComments = () => {
  const walker = document.createTreeWalker(
    document.querySelector('#ember-testing'),
    NodeFilter.SHOW_COMMENT,
  );
  let n = 0;
  while (walker.nextNode()) if (walker.currentNode.data === 'gs-moved') n++;
  return n;
};
const live = () => findAll('.inc').length;
const listKey = (gridEl) => (gridEl.id === 'left' ? 'left' : 'right');

/** the app moves the record from the source list to the target list */
const moveHandler = (lists, calls) => ({
  onRemoved: (e, nodes) =>
    calls.push(['removed', e.target.id, nodes.map((n) => n.id)]),
  onDropped: (e, prev, next) => {
    calls.push(['dropped', e.target.id, prev?.id, prev?.grid?.el?.id, next.id]);
    const from = listKey(prev.grid.el);
    const to = listKey(next.grid.el);
    const item = lists[from].find((i) => i.id === next.id);
    lists[from] = lists[from].filter((i) => i !== item);
    lists[to] = [...lists[to], item];
  },
});

/** on the next frame after mouseup, where the dragged element is painted */
const watchFrame = (id) => {
  const frames = [];
  const onUp = () =>
    requestAnimationFrame(() =>
      frames.push({
        left: findAll(`#left [data-id="${id}"]`).length,
        right: findAll(`#right [data-id="${id}"]`).length,
      }),
    );
  document.addEventListener('mouseup', onUp, { capture: true });
  return {
    frames,
    stop: () =>
      document.removeEventListener('mouseup', onUp, { capture: true }),
  };
};
const nextFrame = () => new Promise((r) => requestAnimationFrame(r));

module('Integration | Component | grid stack template drop', function (hooks) {
  setupGridTest(hooks);

  hooks.beforeEach(function () {
    lifecycle.created = lifecycle.destroyed = 0;
    droppedFroms.length = 0;
    warnings.length = 0;
    this.errors = [];
    setupOnerror((e) => this.errors.push(String(e?.message ?? e)));
  });
  hooks.afterEach(() => resetOnerror());

  test('moves an item A to B and back', async function (assert) {
    const lists = new Lists();
    const calls = [];
    const h = moveHandler(lists, calls);
    let dropSpot;
    const hb = {
      ...h,
      onDropped: (e, prev, next) => {
        dropSpot = { x: next.x, y: next.y };
        h.onDropped(e, prev, next);
      },
    };
    await this.grid.render({ template: twoGrids(lists, h, hb) });
    const registry = this.owner.lookup('service:grid-stack-registry');
    const A = lists.grids.left;
    await click('[data-id="a"] .inc');

    const watch = watchFrame('a');
    await dragIntoRight(find('[data-id="a"]'));
    await settled();
    await nextFrame();
    watch.stop();

    assert.deepEqual(
      watch.frames,
      [{ left: 0, right: 1 }],
      'never painted at its old spot in A',
    );
    assert.deepEqual(ids('#left'), []);
    assert.deepEqual(ids('#right'), ['b', 'a']);
    assert.deepEqual(nodeIds('#left'), []);
    assert.deepEqual(nodeIds('#right'), ['a', 'b']);
    assert.deepEqual(
      saved('#right').map((n) => n.id),
      ['a', 'b'],
    );
    assert.deepEqual(saved('#left'), []);
    const a = saved('#right').find((n) => n.id === 'a');
    assert.deepEqual({ x: a.x, y: a.y }, dropSpot, 'created at the drop spot');
    assert.deepEqual([a.w, a.h], [2, 2]);
    assert.deepEqual(calls, [
      ['removed', 'left', ['a']],
      ['dropped', 'right', 'a', 'left', 'a'],
    ]);
    assert.dom('[data-id="a"] .inc').hasText('1', 'state handed over');
    assert.strictEqual(droppedFroms.length, 1);
    assert.strictEqual(droppedFroms[0].grid, A, 'droppedFrom.grid is A');
    assert.strictEqual(
      droppedFroms[0].grid,
      registry.find(A.instance),
      'and what the registry finds',
    );
    assert.strictEqual(droppedFroms[0].state, 1);
    assert.strictEqual(movedComments(), 0, 'no gs-moved comments');
    assert.strictEqual(lifecycle.created, lifecycle.destroyed + live());

    await click('[data-id="a"] .inc');
    await dragInto(find('[data-id="a"]'), '#left');
    await settled();
    assert.deepEqual(ids('#left'), ['a']);
    assert.deepEqual(ids('#right'), ['b']);
    assert.deepEqual(nodeIds('#left'), ['a']);
    assert.deepEqual(nodeIds('#right'), ['b']);
    assert.dom('[data-id="a"] .inc').hasText('2', 'state handed back');
    assert.strictEqual(droppedFroms[1].grid, lists.grids.right);
    assert.strictEqual(movedComments(), 0);
    assert.strictEqual(lifecycle.created, lifecycle.destroyed + live());
    assert.deepEqual(warnings, []);
    assert.deepEqual(this.errors, []);
    await this.grid.destroy();
  });

  test('droppedFrom is cleared once the drop settled', async function (assert) {
    const lists = new Lists();
    let item;
    const h = moveHandler(lists, []);
    await this.grid.render({
      template: (d) => <template>
        {{! template-lint-disable no-inline-styles }}
        {{#if d.visible}}
          <div style="display: flex; width: 1000px">
            <div style="width: 500px">
              <GridStack
                id="left"
                @options={{hash acceptWidgets=true column=6 minRow=4}}
                @onDropped={{h.onDropped}}
              >
                {{#each lists.left key="id" as |i|}}
                  <GridStackItem
                    data-id={{i.id}}
                    @options={{i.options}}
                    as |gi|
                  >{{lists.capture "item" gi}}</GridStackItem>
                {{/each}}
              </GridStack>
            </div>
            <div style="width: 500px">
              <GridStack
                id="right"
                @options={{hash acceptWidgets=true column=6 minRow=4}}
                @onDropped={{h.onDropped}}
              >
                {{#each lists.right key="id" as |i|}}
                  <GridStackItem
                    data-id={{i.id}}
                    @options={{i.options}}
                    as |gi|
                  >{{lists.capture i.id gi}}</GridStackItem>
                {{/each}}
              </GridStack>
            </div>
          </div>
        {{/if}}
      </template>,
    });
    lists.grids.item.beforeRemove(() => 'state');
    await dragIntoRight(find('[data-id="a"]'));
    await settled();
    item = lists.grids.a;
    assert.ok(item, 'a rendered in B');
    assert.strictEqual(item.droppedFrom, undefined);
    await this.grid.destroy();
  });

  test('a handler that does nothing puts the item back', async function (assert) {
    const lists = new Lists();
    const calls = [];
    let prevSpot;
    const h = {
      onDropped: (e, prev) => {
        calls.push(prev.id);
        prevSpot = { x: prev.x, y: prev.y };
      },
    };
    await this.grid.render({ template: twoGrids(lists, h) });
    const before = [saved('#left'), saved('#right')];
    await click('[data-id="a"] .inc');
    await dragIntoRight(find('[data-id="a"]'));
    await settled();
    assert.deepEqual(calls, ['a']);
    assert.deepEqual(ids('#left'), ['a']);
    assert.deepEqual(ids('#right'), ['b']);
    // back where A last had it (gridstack's previousNode)
    before[0][0] = { ...before[0][0], ...prevSpot };
    assert.deepEqual([saved('#left'), saved('#right')], before);
    assert.dom('[data-id="a"] .inc').hasText('1', 'same component');
    assert.strictEqual(lifecycle.destroyed, 0);
    assert.strictEqual(movedComments(), 0);
    assert.deepEqual(warnings, ['ember-gridstack.drop-not-rendered']);
    assert.deepEqual(this.errors, []);
    await this.grid.destroy();
  });

  test('a handler that deletes the record', async function (assert) {
    const lists = new Lists();
    const h = {
      onDropped: () => (lists.left = []),
    };
    await this.grid.render({ template: twoGrids(lists, h) });
    await dragIntoRight(find('[data-id="a"]'));
    await settled();
    assert.deepEqual(ids('#left'), []);
    assert.deepEqual(ids('#right'), ['b']);
    assert.deepEqual(nodeIds('#left'), []);
    assert.deepEqual(nodeIds('#right'), ['b']);
    assert.strictEqual(movedComments(), 0);
    assert.strictEqual(lifecycle.created, lifecycle.destroyed + live());
    assert.deepEqual(warnings, ['ember-gridstack.drop-not-rendered']);
    assert.deepEqual(this.errors, []);
    await this.grid.destroy();
  });

  test('@onDropped hides A and moves the record', async function (assert) {
    const lists = new Lists();
    const move = moveHandler(lists, []);
    const h = {
      onDropped: (e, prev, next) => {
        move.onDropped(e, prev, next);
        lists.showLeft = false;
      },
    };
    await this.grid.render({ template: twoGrids(lists, h) });
    await click('[data-id="a"] .inc');
    await dragIntoRight(find('[data-id="a"]'));
    await settled();
    assert.dom('#left').doesNotExist();
    assert.deepEqual(ids('#right'), ['b', 'a']);
    assert.deepEqual(nodeIds('#right'), ['a', 'b']);
    assert.dom('[data-id="a"] .inc').hasText('1');
    assert.strictEqual(movedComments(), 0);
    assert.strictEqual(lifecycle.created, lifecycle.destroyed + live());
    assert.deepEqual(warnings, []);
    assert.deepEqual(this.errors, []);
    await this.grid.destroy();
  });

  test('@onRemoved on A hides A before B handles the drop', async function (assert) {
    const lists = new Lists();
    const move = moveHandler(lists, []);
    const h = {
      onRemoved: () => (lists.showLeft = false),
      onDropped: (e, prev, next) => {
        const item = lists.left.find((i) => i.id === next.id);
        lists.left = lists.left.filter((i) => i !== item);
        lists.right = [...lists.right, item];
      },
    };
    await this.grid.render({ template: twoGrids(lists, h, move) });
    await dragIntoRight(find('[data-id="a"]'));
    await settled();
    assert.dom('#left').doesNotExist();
    assert.deepEqual(ids('#right'), ['b', 'a']);
    assert.deepEqual(nodeIds('#right'), ['a', 'b']);
    assert.strictEqual(movedComments(), 0);
    assert.deepEqual(this.errors, []);
    await this.grid.destroy();
  });

  for (const [name, setup, warning] of [
    [
      'no @onDropped',
      (lists) => [{}, { onDropped: () => lists.right }],
      'ember-gridstack.no-drop-handler',
    ],
    [
      'item without id',
      (lists) => {
        lists.left = [{ id: 'a', options: { x: 0, y: 0, w: 2, h: 2 } }];
        return [{ onDropped() {} }, { onDropped() {} }];
      },
      'ember-gridstack.drop-needs-id',
    ],
  ]) {
    test(`refuses a drop: ${name}`, async function (assert) {
      const lists = new Lists();
      const [hl, hr] = setup(lists);
      // A is the handler-less grid for "no @onDropped": drag B's item into A
      const reverse = name === 'no @onDropped';
      await this.grid.render({ template: twoGrids(lists, hl, hr) });
      const before = [saved('#left'), saved('#right')];
      for (const f of [0.6, 0.7]) {
        if (reverse) await dragInto(find('[data-id="b"]'), '#left', f, f);
        else await dragInto(find('[data-id="a"]'), '#right', f, f);
      }
      await settled();
      assert.deepEqual(ids('#left'), ['a']);
      assert.deepEqual(ids('#right'), ['b']);
      // the refused item may still have moved inside its own grid
      const sizes = (layouts) =>
        layouts.map((l) => l.map(({ id, w, h }) => ({ id, w, h })));
      assert.deepEqual(
        sizes([saved('#left'), saved('#right')]),
        sizes(before),
        'engines unchanged',
      );
      assert.deepEqual(warnings, [warning], 'warned once');
      assert.deepEqual(this.errors, []);
      await this.grid.destroy();
    });
  }

  test('drag-in from a setupDragIn toolbox', async function (assert) {
    const lists = new Lists();
    lists.right = [];
    const calls = [];
    const h = {
      onDropped: (e, prev, next) => {
        calls.push(prev);
        lists.right = [
          ...lists.right,
          {
            id: 'n',
            options: { id: 'n', x: next.x, y: next.y, w: next.w, h: next.h },
          },
        ];
      },
    };
    await this.grid.render({
      template: (d) => <template>
        {{! template-lint-disable no-inline-styles }}
        {{#if d.visible}}
          <div style="width: 1000px">
            <div class="toolbox"><div
                class="item grid-stack-item"
                style="width: 80px; height: 40px"
              >
                <div class="grid-stack-item-content">new</div>
              </div></div>
            <GridStack
              id="right"
              @options={{hash acceptWidgets=true minRow=4}}
              @onDropped={{h.onDropped}}
            >
              {{#each lists.right key="id" as |item|}}
                <GridStackItem
                  data-id={{item.id}}
                  @options={{item.options}}
                  as |gi|
                ><Counter @item={{gi}} /></GridStackItem>
              {{/each}}
            </GridStack>
          </div>
        {{/if}}
      </template>,
    });
    find('#right').gridstack.constructor.setupDragIn('.toolbox .item', {
      helper: 'clone',
    });
    await dragInto(find('.toolbox .item'), '#right', 0.5, 0.5);
    await settled();
    assert.deepEqual(calls, [undefined], 'previousNode is undefined');
    assert.strictEqual(findAll('#right > .grid-stack-item').length, 1);
    assert.deepEqual(ids('#right'), ['n']);
    assert.deepEqual(nodeIds('#right'), ['n']);
    assert.strictEqual(findAll('.toolbox .item').length, 1);
    assert.deepEqual(warnings, []);
    assert.deepEqual(this.errors, []);
    await this.grid.destroy();
  });

  test('trash: @onRemoved, nothing left', async function (assert) {
    const lists = new Lists();
    lists.left = [{ id: 'a', options: { id: 'a', x: 0, y: 0, w: 2, h: 1 } }];
    const calls = [];
    const h = {
      onRemoved: (e, nodes) => {
        calls.push(nodes.map((n) => n.id));
        const gone = nodes.map((n) => n.id);
        lists.left = lists.left.filter((i) => !gone.includes(i.id));
      },
    };
    await this.grid.render({
      template: (d) => <template>
        {{! template-lint-disable no-inline-styles }}
        {{#if d.visible}}
          <div style="width: 1000px">
            <div id="trash" style="width: 200px; height: 100px">trash</div>
            <GridStack
              id="left"
              @options={{hash removable="#trash"}}
              @onRemoved={{h.onRemoved}}
            >
              {{#each lists.left key="id" as |item|}}
                <GridStackItem
                  data-id={{item.id}}
                  @options={{item.options}}
                  as |gi|
                ><Counter @item={{gi}} /></GridStackItem>
              {{/each}}
            </GridStack>
          </div>
        {{/if}}
      </template>,
    });
    await dragInto(find('[data-id="a"]'), '#trash', 0.5, 0.5);
    await settled();
    assert.deepEqual(calls, [['a']]);
    assert.deepEqual(ids('#left'), []);
    assert.strictEqual(find('#left').children.length, 0, 'no stray DOM');
    assert.deepEqual(nodeIds('#left'), []);
    assert.strictEqual(lifecycle.destroyed, 1);
    assert.strictEqual(movedComments(), 0);
    assert.deepEqual(this.errors, []);
    await this.grid.destroy();
  });
});
