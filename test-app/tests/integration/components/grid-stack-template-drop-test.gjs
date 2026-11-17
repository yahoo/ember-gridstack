import { module, test } from 'qunit';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import { hash } from '@ember/helper';
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

class Counter extends Component {
  @tracked count = 0;

  constructor() {
    super(...arguments);
    lifecycle.created++;
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

const dragIntoRight = (itemEl) => {
  const rr = find('#right').getBoundingClientRect();
  return dragTo(itemEl, rr.left + rr.width * 0.6, rr.top + rr.height * 0.6);
};

class Lists {
  @tracked left = [{ id: 'a', options: { id: 'a', x: 0, y: 0, w: 2, h: 2 } }];
  @tracked right = [{ id: 'b', options: { id: 'b', x: 0, y: 0, w: 2, h: 2 } }];
}

const twoGrids = (lists, h) => (d) => <template>
  {{! template-lint-disable no-inline-styles }}
  {{#if d.visible}}
    <div style="display: flex; width: 1000px">
      <div style="width: 500px">
        <GridStack
          id="left"
          @options={{hash acceptWidgets=true column=6 minRow=4}}
          @onDropped={{h.onDropped}}
          @onRemoved={{h.onRemoved}}
        >
          {{#each lists.left key="id" as |item|}}
            <GridStackItem
              data-id={{item.id}}
              @options={{item.options}}
            ><Counter /></GridStackItem>
          {{/each}}
        </GridStack>
      </div>
      <div style="width: 500px">
        <GridStack
          id="right"
          @options={{hash acceptWidgets=true column=6 minRow=4}}
          @onDropped={{h.onDropped}}
          @onRemoved={{h.onRemoved}}
        >
          {{#each lists.right key="id" as |item|}}
            <GridStackItem
              data-id={{item.id}}
              @options={{item.options}}
            ><Counter /></GridStackItem>
          {{/each}}
        </GridStack>
      </div>
    </div>
  {{/if}}
</template>;

const ids = (sel) =>
  findAll(`${sel} .grid-stack-item`).map((el) => el.dataset.id);
const comments = (sel) =>
  [...find(sel).childNodes].filter((n) => n.nodeType === 8).length;

const dropped = ['dropped', 'right', 'a', 'left', 'a'];
const TODAY = {
  nothing: {
    domLeft: [],
    domRight: ['b', 'a'],
    commentsLeft: 0,
    commentsRight: 0,
    nodesLeft: [],
    nodesRight: ['b', 'a'],
    saveLeft: [],
    saveRight: ['b', 'a'],
    lists: [['a'], ['b']],
    calls: [['removed', 'left', ['a']], dropped],
    lifecycle: { created: 2, destroyed: 0 },
    errors: [],
  },
  // Glimmer renders a second `a` next to the moved element
  move: {
    domLeft: [],
    domRight: ['b', 'a', 'a'],
    commentsLeft: 1,
    commentsRight: 0,
    nodesLeft: [],
    nodesRight: ['a_1', 'b'],
    saveLeft: [],
    saveRight: ['a_1', 'b'],
    lists: [[], ['b', 'a']],
    calls: [['removed', 'left', ['a']], dropped, ['removed', 'right', ['a']]],
    lifecycle: { created: 3, destroyed: 1 },
    errors: [],
  },
  // the moved element stays in B as an untracked orphan
  remove: {
    domLeft: [],
    domRight: ['b', 'a'],
    commentsLeft: 1,
    commentsRight: 0,
    nodesLeft: [],
    nodesRight: ['b'],
    saveLeft: [],
    saveRight: ['b'],
    lists: [[], ['b']],
    calls: [['removed', 'left', ['a']], dropped, ['removed', 'right', ['a']]],
    lifecycle: { created: 2, destroyed: 1 },
    errors: [],
  },
};

module('Integration | Component | grid stack template drop', function (hooks) {
  setupGridTest(hooks);

  hooks.beforeEach(function () {
    lifecycle.created = lifecycle.destroyed = 0;
    this.errors = [];
    setupOnerror((e) => this.errors.push(String(e?.message ?? e)));
  });
  hooks.afterEach(() => resetOnerror());

  const observe = (ctx, calls, lists) => ({
    domLeft: ids('#left'),
    domRight: ids('#right'),
    commentsLeft: comments('#left'),
    commentsRight: comments('#right'),
    nodesLeft: find('#left').gridstack.engine.nodes.map((n) => n.id),
    nodesRight: find('#right').gridstack.engine.nodes.map((n) => n.id),
    saveLeft: find('#left')
      .gridstack.save(false)
      .map((n) => n.id),
    saveRight: find('#right')
      .gridstack.save(false)
      .map((n) => n.id),
    lists: [lists.left.map((i) => i.id), lists.right.map((i) => i.id)],
    calls,
    lifecycle: { ...lifecycle },
    errors: ctx.errors,
  });

  for (const mode of ['nothing', 'move', 'remove']) {
    test(`today: A to B, app does ${mode}`, async function (assert) {
      const lists = new Lists();
      const calls = [];
      const h = {
        onRemoved: (e, nodes) =>
          calls.push(['removed', e.target.id, nodes.map((n) => n.id)]),
        onDropped: (e, prev, next) => {
          calls.push([
            'dropped',
            e.target.id,
            prev?.id,
            prev?.grid?.el?.id,
            next?.id,
          ]);
          if (mode === 'move' || mode === 'remove') {
            const item = lists.left.find((i) => i.id === next.id);
            lists.left = lists.left.filter((i) => i !== item);
            if (mode === 'move') lists.right = [...lists.right, item];
          }
        },
      };
      await this.grid.render({ template: twoGrids(lists, h) });
      await click('[data-id="a"] .inc');
      await dragIntoRight(find('[data-id="a"]'));
      await settled();
      assert.deepEqual(
        observe(this, calls, lists),
        TODAY[mode],
        `today, app does ${mode}`,
      );
      await this.grid.destroy();
    });
  }

  test('today: trash', async function (assert) {
    const lists = new Lists();
    lists.left = [{ id: 'a', options: { id: 'a', x: 0, y: 0, w: 2, h: 1 } }];
    const calls = [];
    const h = {
      onRemoved: (e, nodes) =>
        calls.push([
          'removed',
          nodes.map((n) => n.id),
          nodes.map((n) => n.el?.isConnected),
        ]),
    };
    await this.grid.render({
      template: () => <template>
        {{! template-lint-disable no-inline-styles }}
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
              ><Counter /></GridStackItem>
            {{/each}}
          </GridStack>
        </div>
      </template>,
    });
    const gs = find('#left').gridstack;
    const sync = [];
    gs.on('removed', (e, nodes) =>
      sync.push(nodes.map((n) => [n.id, n.el.parentElement?.id])),
    );
    const orig = gs.removeWidget;
    gs.removeWidget = function (el, removeDOM, trigger) {
      sync.push(['removeWidget', removeDOM, trigger]);
      return orig.apply(this, arguments);
    };
    const tr = find('#trash').getBoundingClientRect();
    await dragTo(
      find('[data-id="a"]'),
      tr.left + tr.width / 2,
      tr.top + tr.height / 2,
    );
    await settled();
    sync.push([
      'afterDrag',
      gs.engine.nodes.length,
      ids('#left'),
      JSON.stringify(calls),
    ]);
    lists.left = [];
    await settled();
    assert.deepEqual(
      { sync, calls, errors: this.errors, dom: ids('#left') },
      {
        // gridstack removes the DOM itself; el is detached when `removed` fires
        sync: [
          ['removeWidget', true, true],
          [['a', undefined]],
          ['afterDrag', 0, [], '[["removed",["a"],[false]]]'],
        ],
        calls: [['removed', ['a'], [false]]],
        errors: [],
        dom: [],
      },
    );
  });

  test('today: setupDragIn', async function (assert) {
    const calls = [];
    const h = {
      onDropped: (e, prev, next) =>
        calls.push([prev, next.el?.className, next.el?.parentElement?.id]),
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
            />
          </div>
        {{/if}}
      </template>,
    });
    find('#right').gridstack.constructor.setupDragIn('.toolbox .item', {
      helper: 'clone',
    });
    const r = find('#right').getBoundingClientRect();
    await dragTo(
      find('.toolbox .item'),
      r.left + r.width / 2,
      r.top + r.height / 2,
    );
    await settled();
    assert.deepEqual(
      {
        calls,
        inRight: [...find('#right').children].map((c) => c.className),
        toolbox: find('.toolbox').children.length,
        errors: this.errors,
      },
      {
        // gridstack inserts the clone helper into B
        calls: [
          [undefined, 'item grid-stack-item ui-resizable-autohide', 'right'],
        ],
        inRight: ['item grid-stack-item ui-resizable-autohide'],
        toolbox: 1,
        errors: [],
      },
    );
    await this.grid.destroy();
  });
});
