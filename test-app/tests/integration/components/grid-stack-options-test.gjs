import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled, find, waitUntil } from '@ember/test-helpers';
import GridStack from 'ember-gridstack/components/grid-stack';
import GridStackItem from 'ember-gridstack/components/grid-stack-item';
import { State, Item, gsPos, gridFor } from '../../helpers/grid';

async function renderGrid(state) {
  await render(
    <template>
      {{! template-lint-disable no-inline-styles }}
      <GridStack
        style="width: 1200px"
        @options={{state.options}}
        @onAdded={{state.onAdded}}
      >
        {{#each state.items as |item|}}
          <GridStackItem data-id={{item.id}} @options={{item.options}}>
            {{item.id}}
          </GridStackItem>
        {{/each}}
      </GridStack>
    </template>,
  );
}

module('Integration | Component | grid stack options', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.state = new State();
    this.state.items = [
      new Item('a', { x: 0, y: 0, w: 2, h: 1 }),
      new Item('b', { x: 0, y: 1, w: 2, h: 1 }),
    ];
    this.added = 0;
    this.state.onAdded = () => this.added++;
    this.state.options = { cellHeight: 50, column: 12, mode: 'top' };
  });

  test('item @options move and resize the item', async function (assert) {
    await renderGrid(this.state);
    this.state.items[1].options = { x: 3, y: 2, w: 4, h: 2 };
    await settled();
    const el = find('[data-id="b"]');
    assert.strictEqual(gsPos(el, 'gs-x'), 3);
    assert.strictEqual(gsPos(el, 'gs-y'), 0, 'top mode pulls it up');
    assert.strictEqual(gsPos(el, 'gs-w'), 4);
    assert.strictEqual(gsPos(el, 'gs-h'), 2);
  });

  test('update() will not push a locked item', async function (assert) {
    this.state.options = { cellHeight: 50, column: 12, mode: 'float' };
    this.state.items = [
      new Item('a', { x: 0, y: 0, w: 2, h: 1, locked: true }),
      new Item('b', { x: 4, y: 0, w: 2, h: 1 }),
    ];
    await renderGrid(this.state);
    this.state.items[1].options = { x: 0, y: 0, w: 2, h: 1 };
    await settled();
    assert.strictEqual(gsPos('[data-id="a"]', 'gs-x'), 0, 'locked stays');
    assert.strictEqual(gsPos('[data-id="a"]', 'gs-y'), 0, 'locked stays');
    const b = find('[data-id="b"]');
    const overlaps = gsPos(b, 'gs-y') === 0 && gsPos(b, 'gs-x') < 2;
    assert.false(overlaps, 'b does not overlap the locked item');
  });

  test('maxRow blocks moves past it', async function (assert) {
    this.state.options = {
      cellHeight: 50,
      column: 12,
      mode: 'float',
      maxRow: 3,
    };
    await renderGrid(this.state);
    this.state.items[1].options = { x: 0, y: 5, w: 2, h: 1 };
    await settled();
    assert.true(gsPos('[data-id="b"]', 'gs-y') < 3, 'stays inside maxRow');
  });

  module('modes', function () {
    [
      ['top', [0, 1]],
      ['float', [0, 2]],
      ['list', [0, 1]],
      ['compact', [0, 1]],
    ].forEach(([mode, expectedY]) => {
      test(`${mode}: remove the middle of 3 items`, async function (assert) {
        this.state.options = { cellHeight: 50, column: 12, mode };
        this.state.items = ['a', 'b', 'c'].map(
          (id, y) => new Item(id, { x: 0, y, w: 12, h: 1 }),
        );
        await renderGrid(this.state);
        this.state.items = this.state.items.filter((i) => i.id !== 'b');
        await settled();
        assert.deepEqual(
          [gsPos('[data-id="a"]', 'gs-y'), gsPos('[data-id="c"]', 'gs-y')],
          expectedY,
        );
        assert.strictEqual(
          gridFor(this.owner, '.grid-stack').gridStack.opts.mode,
          mode,
        );
      });
    });

    test('compact back-fills gaps that list leaves', async function (assert) {
      for (const [mode, y] of [
        ['list', 1],
        ['compact', 0],
      ]) {
        this.state.options = { cellHeight: 50, column: 12, mode };
        this.state.items = [
          new Item('a', { x: 0, y: 0, w: 8, h: 1 }),
          new Item('b', { x: 0, y: 1, w: 8, h: 1 }),
          new Item('c', { x: 0, y: 2, w: 4, h: 1 }),
        ];
        await renderGrid(this.state);
        assert.strictEqual(gsPos('[data-id="c"]', 'gs-y'), y, mode);
      }
    });

    test('legacy float: true becomes mode float', async function (assert) {
      this.state.options = { float: true };
      await renderGrid(this.state);
      assert.strictEqual(
        gridFor(this.owner, '.grid-stack').gridStack.opts.mode,
        'float',
      );
    });
  });

  test('columnOpts breakpoints follow the container width', async function (assert) {
    this.state.options = {
      cellHeight: 50,
      // .grid-stack-animate transitions the container width
      animate: false,
      columnOpts: { breakpoints: [{ w: 700, c: 1 }] },
    };
    await renderGrid(this.state);
    const grid = gridFor(this.owner, '.grid-stack');
    assert.strictEqual(grid.gridStack.getColumn(), 12, 'wide');

    // gridstack 14 watches the container with a ResizeObserver
    grid.elm.style.width = '500px';
    window.dispatchEvent(new Event('resize'));
    await waitUntil(() => grid.gridStack.getColumn() === 1, { timeout: 2000 });
    assert.strictEqual(grid.gridStack.getColumn(), 1, 'narrow');

    grid.elm.style.width = '1000px';
    window.dispatchEvent(new Event('resize'));
    await waitUntil(() => grid.gridStack.getColumn() === 12, {
      timeout: 2000,
    });
    assert.strictEqual(grid.gridStack.getColumn(), 12, 'wide again');
  });
});
