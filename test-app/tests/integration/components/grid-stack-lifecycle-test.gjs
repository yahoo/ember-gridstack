import { module, test } from 'qunit';
import { settled, find } from '@ember/test-helpers';
import { hash } from '@ember/helper';
import GridStack, {
  GRID_STACK_EVENTS,
  capitalize,
} from 'ember-gridstack/components/grid-stack';
import GridStackItem from 'ember-gridstack/components/grid-stack-item';
import { setupGridTest } from '../../helpers/setup-grid-test';

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
  setupGridTest(hooks);

  test('teardown is clean', async function (assert) {
    assert.expect(6);
    const errors = [];
    const onerror = window.onerror;
    window.onerror = (msg) => errors.push(msg);

    try {
      await this.grid.render({
        items: [
          { id: 'A', x: 0, y: 0, w: 2, h: 1 },
          { id: 'B', x: 0, y: 1, w: 2, h: 1 },
        ],
      });
      const el = this.grid.element;

      await this.grid.destroy();

      assert.dom('.grid-stack').doesNotExist();
      assert.deepEqual(errors, [], 'no errors');
      assert.strictEqual(this.events.of('removed').length, 0, 'no onRemoved');
      assert.strictEqual(this.events.of('change').length, 0, 'no onChange');
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
    await this.grid.render({
      template: (d) => <template>
        {{#if d.visible}}
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
    });
    const registry = this.owner.lookup('service:grid-stack-registry');
    const outer = registry.find(find('.outer'));
    const inner = registry.find(find('.inner'));
    const innerItem = find('.inner-item');
    assert.notStrictEqual(outer, inner);
    assert.strictEqual(registry.find(innerItem), inner);
    assert.strictEqual(innerItem.gridstackNode?.grid, inner.gridStack);
    assert.deepEqual(
      outer.gridStack.engine.nodes.map((n) => n.el),
      [find('.outer-item')],
    );
    assert.strictEqual(inner.gridStack.engine.nodes.length, 1);

    const outerEl = find('.outer');
    await this.grid.destroy();
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
      await this.grid.render({
        width: '1200px',
        options: { cellHeight: 50, animate: false },
        items: [{ id: 'a', x: 0, y: 0, w: 2, h: 2 }],
      });
    });

    const triggers = {
      added: (grid) => grid.add({ id: 'b', x: 0, y: 0, w: 2, h: 2 }),
      removed: (grid) => grid.setItems([]),
      change: (grid) => grid.instance.update(grid.el('a'), { x: 4 }),
      enable: (grid) => grid.instance.enable(),
      disable: (grid) => grid.instance.disable(),
      dragstart: (grid) => grid.drag('a', 300, 120),
      drag: (grid) => grid.drag('a', 300, 120),
      dragstop: (grid) => grid.drag('a', 300, 120),
      resizestart: (grid) => grid.resize('a', 3, 2),
      resize: (grid) => grid.resize('a', 3, 2),
      resizestop: (grid) => grid.resize('a', 3, 2),
      // a real cross-grid drop is not feasible here, so call the handler gridstack calls on drop;
      // _triggerEvent() would not reach it, gridstack keeps 'dropped' off the DOM
      dropped: (grid, assert) => {
        const gs = grid.instance;
        assert.strictEqual(typeof gs._gsEventHandler.dropped, 'function');
        gs._gsEventHandler.dropped(
          new Event('dropped'),
          undefined,
          grid.node('a'),
        );
      },
      resizecontent: (grid) => {
        grid.element.style.width = '900px';
        grid.instance.onResize();
      },
    };

    GRID_STACK_EVENTS.forEach((name) => {
      test(`@on${capitalize(name)} fires`, async function (assert) {
        await triggers[name](this.grid, assert);
        await settled();
        assert.ok(this.events.of(name).length >= 1, `${name} fired`);
      });
    });
  });
});
