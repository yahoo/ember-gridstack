import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled, find } from '@ember/test-helpers';
import { hash } from '@ember/helper';
import GridStack, {
  GRID_STACK_EVENTS,
  capitalize,
} from 'ember-gridstack/components/grid-stack';
import GridStackItem from 'ember-gridstack/components/grid-stack-item';
import { State, gridFor, pointerDrag, resizeDrag } from '../../helpers/grid';

// gridstack 14 `GridStackEvent` union
const GRIDSTACK_EVENT_NAMES = [
  'added',
  'change',
  'disable',
  'drag',
  'dragstart',
  'dragstop',
  'dropped',
  'enable',
  'removed',
  'resize',
  'resizecontent',
  'resizestart',
  'resizestop',
];

module('Integration | Component | grid stack lifecycle', function (hooks) {
  setupRenderingTest(hooks);

  test('teardown is clean', async function (assert) {
    assert.expect(6);
    const state = new State();
    let removed = 0;
    let changed = 0;
    state.onRemoved = () => removed++;
    state.onChange = () => changed++;
    const errors = [];
    const onerror = window.onerror;
    window.onerror = (msg) => errors.push(msg);

    try {
      await render(
        <template>
          {{#if state.shouldRender}}
            <GridStack
              @onRemoved={{state.onRemoved}}
              @onChange={{state.onChange}}
            >
              <GridStackItem @options={{hash x=0 y=0 w=2 h=1}}>A</GridStackItem>
              <GridStackItem @options={{hash x=0 y=1 w=2 h=1}}>B</GridStackItem>
            </GridStack>
          {{/if}}
        </template>,
      );
      const el = find('.grid-stack');

      state.shouldRender = false;
      await settled();

      assert.dom('.grid-stack').doesNotExist();
      assert.deepEqual(errors, [], 'no errors');
      assert.strictEqual(removed, 0, 'no onRemoved');
      assert.strictEqual(changed, 0, 'no onChange');
      assert.false(
        [...el.classList].some((c) => /grid-stack-instance-/.test(c)),
        'instance class removed',
      );
      assert.strictEqual(
        el.querySelectorAll('.ui-draggable, .ui-resizable').length,
        0,
        'no dd leftovers',
      );
    } finally {
      window.onerror = onerror;
    }
  });

  test('nested grids', async function (assert) {
    const state = new State();
    await render(
      <template>
        {{#if state.shouldRender}}
          <GridStack class="outer" @options={{hash cellHeight=50}}>
            <GridStackItem class="outer-item" @options={{hash w=6 h=4}}>
              <GridStack class="inner" @options={{hash cellHeight=30}}>
                <GridStackItem
                  class="inner-item"
                  @options={{hash w=2 h=1}}
                >X</GridStackItem>
              </GridStack>
            </GridStackItem>
          </GridStack>
        {{/if}}
      </template>,
    );
    const outer = gridFor(this.owner, '.outer');
    const inner = gridFor(this.owner, '.inner');
    const innerItem = find('.inner-item');
    assert.notStrictEqual(outer, inner);
    assert.strictEqual(gridFor(this.owner, innerItem), inner);
    assert.strictEqual(innerItem.gridstackNode?.grid, inner.gridStack);
    assert.deepEqual(
      outer.gridStack.engine.nodes.map((n) => n.el),
      [find('.outer-item')],
    );
    assert.strictEqual(inner.gridStack.engine.nodes.length, 1);

    const outerEl = find('.outer');
    state.shouldRender = false;
    await settled();
    assert.strictEqual(outer.gridStack, null);
    assert.strictEqual(inner.gridStack, null);
    assert.strictEqual(
      outerEl.querySelectorAll('.ui-draggable, .ui-resizable').length,
      0,
    );
  });

  test('GRID_STACK_EVENTS matches gridstack events', function (assert) {
    assert.deepEqual([...GRID_STACK_EVENTS].sort(), GRIDSTACK_EVENT_NAMES);
  });

  module('events', function (hooks) {
    hooks.beforeEach(async function () {
      const calls = (this.calls = {});
      const h = {};
      GRIDSTACK_EVENT_NAMES.forEach((name) => {
        calls[name] = 0;
        h[`on${capitalize(name)}`] = () => calls[name]++;
      });
      const state = (this.state = new State());
      state.items = ['a'];
      await render(
        <template>
          {{! template-lint-disable no-inline-styles }}
          <GridStack
            style="width: 1200px"
            @options={{hash cellHeight=50 animate=false}}
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
            {{#each state.items as |id|}}
              <GridStackItem
                class="item-{{id}}"
                @options={{hash x=0 y=0 w=2 h=2}}
              >{{id}}</GridStackItem>
            {{/each}}
          </GridStack>
        </template>,
      );
      this.grid = gridFor(this.owner, '.grid-stack');
      GRIDSTACK_EVENT_NAMES.forEach((name) => (calls[name] = 0));
    });

    const triggers = {
      added: async (ctx) => {
        ctx.state.items = [...ctx.state.items, 'b'];
      },
      removed: async (ctx) => {
        ctx.state.items = [];
      },
      change: async (ctx) => {
        ctx.grid.gridStack.update(find('.item-a'), { x: 4 });
      },
      enable: async (ctx) => ctx.grid.gridStack.enable(),
      disable: async (ctx) => ctx.grid.gridStack.disable(),
      dragstart: () => pointerDrag(find('.item-a'), 300, 120),
      drag: () => pointerDrag(find('.item-a'), 300, 120),
      dragstop: () => pointerDrag(find('.item-a'), 300, 120),
      resizestart: () => resizeDrag(find('.item-a'), 300, 120),
      resize: () => resizeDrag(find('.item-a'), 300, 120),
      resizestop: () => resizeDrag(find('.item-a'), 300, 120),
      // a real cross-grid drop is not feasible here, so call the handler gridstack calls on drop;
      // _triggerEvent() would not reach it, gridstack keeps 'dropped' off the DOM
      dropped: async (ctx, assert) => {
        const gs = ctx.grid.gridStack;
        const node = find('.item-a').gridstackNode;
        assert.strictEqual(typeof gs._gsEventHandler.dropped, 'function');
        gs._gsEventHandler.dropped(new Event('dropped'), undefined, node);
      },
      resizecontent: async (ctx) => {
        ctx.grid.elm.style.width = '900px';
        ctx.grid.gridStack.onResize();
      },
    };

    GRID_STACK_EVENTS.forEach((name) => {
      test(`@on${capitalize(name)} fires`, async function (assert) {
        await triggers[name](this, assert);
        await settled();
        assert.ok(this.calls[name] >= 1, `${name} fired`);
      });
    });
  });
});
