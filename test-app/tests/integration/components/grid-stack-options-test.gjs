import { module, test } from 'qunit';
import { waitUntil } from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import GridStack from 'ember-gridstack/components/grid-stack';
import GridStackItem from 'ember-gridstack/components/grid-stack-item';
import { setupGridTest } from '../../helpers/setup-grid-test';

const TOP = { cellHeight: 50, column: 12, mode: 'top' };
const TWO_ITEMS = [
  { id: 'a', x: 0, y: 0, w: 2, h: 1 },
  { id: 'b', x: 0, y: 1, w: 2, h: 1 },
];

module('Integration | Component | grid stack options', function (hooks) {
  setupGridTest(hooks);

  hooks.beforeEach(function () {
    this.renderGrid = (cfg) =>
      this.grid.render({
        width: '1200px',
        options: TOP,
        items: TWO_ITEMS,
        ...cfg,
      });
  });

  [
    ['mode', { mode: 'float' }, (gs) => gs.opts.mode === 'float'],
    ['column', { column: 6 }, (gs) => gs.getColumn() === 6],
    ['cellHeight', { cellHeight: 80 }, (gs) => gs.getCellHeight() === 80],
    [
      'columnOpts',
      { columnOpts: { breakpoints: [{ w: 700, c: 1 }] } },
      (gs) => gs.opts.columnOpts?.breakpoints?.[0]?.c === 1,
    ],
    ['legacy float', { float: true }, (gs) => gs.opts.mode === 'float'],
  ].forEach(([key, change, applied]) => {
    test(`changing ${key} keeps the GridStack instance`, async function (assert) {
      await this.renderGrid();
      const before = this.grid.instance;

      await this.grid.setOptions(change);

      assert.strictEqual(this.grid.instance, before, 'same instance');
      assert.true(applied(this.grid.instance), `${key} applied`);
      assert.strictEqual(this.events.of('added').length, 0, 'no onAdded');
      assert.strictEqual(this.grid.instance.engine.nodes.length, 2);
    });
  });

  test('a REINIT_OPTIONS change re-creates the GridStack instance', async function (assert) {
    await this.renderGrid();
    const before = this.grid.instance;
    await this.grid.setOptions({ handle: '.handle' });
    assert.notStrictEqual(this.grid.instance, before);
    assert.strictEqual(this.grid.instance.opts.handle, '.handle');
    assert.strictEqual(this.grid.instance.engine.nodes.length, 2);
  });

  test('changed @on* handlers apply without re-init', async function (assert) {
    class Handlers {
      @tracked onAdded = () => {};
    }
    const handlers = new Handlers();
    await this.renderGrid({
      template: (d) => <template>
        <GridStack @options={{d.gridOptions}} @onAdded={{handlers.onAdded}}>
          {{#each d.items key="id" as |item|}}
            <GridStackItem data-id={{item.id}} @options={{item.options}}>
              {{item.id}}
            </GridStackItem>
          {{/each}}
        </GridStack>
      </template>,
    });
    const before = this.grid.instance;
    let second = 0;
    handlers.onAdded = () => second++;
    await this.grid.add({ id: 'c', x: 4, y: 0, w: 1, h: 1 });
    assert.strictEqual(this.grid.instance, before);
    assert.strictEqual(second, 1, 'new handler fired');
  });

  test('item @options move and resize the item', async function (assert) {
    await this.renderGrid();
    await this.grid.update('b', { x: 3, y: 2, w: 4, h: 2 });
    assert.layout({ b: { x: 3, y: 0, w: 4, h: 2 } }, 'top mode pulls it up');
  });

  test('update() will not push a locked item', async function (assert) {
    await this.renderGrid({
      options: { ...TOP, mode: 'float' },
      items: [
        { id: 'a', x: 0, y: 0, w: 2, h: 1, locked: true },
        { id: 'b', x: 4, y: 0, w: 2, h: 1 },
      ],
    });
    await this.grid.update('b', { x: 0, y: 0, w: 2, h: 1 });
    assert.layout({ a: { x: 0, y: 0 } }, 'locked stays');
    const b = this.grid.node('b');
    const overlaps = b.y === 0 && b.x < 2;
    assert.false(overlaps, 'b does not overlap the locked item');
  });

  test('maxRow blocks moves past it', async function (assert) {
    await this.renderGrid({ options: { ...TOP, mode: 'float', maxRow: 3 } });
    await this.grid.update('b', { x: 0, y: 5, w: 2, h: 1 });
    assert.true(this.grid.node('b').y < 3, 'stays inside maxRow');
  });

  module('modes', function () {
    [
      ['top', [0, 1]],
      ['float', [0, 2]],
      ['list', [0, 1]],
      ['compact', [0, 1]],
    ].forEach(([mode, [ya, yc]]) => {
      test(`${mode}: remove the middle of 3 items`, async function (assert) {
        await this.renderGrid({
          options: { ...TOP, mode },
          items: ['a', 'b', 'c'].map((id, y) => ({ id, x: 0, y, w: 12, h: 1 })),
        });
        await this.grid.remove('b');
        assert.layout({ a: { y: ya }, c: { y: yc } });
        assert.strictEqual(this.grid.instance.opts.mode, mode);
      });
    });

    test('compact back-fills gaps that list leaves', async function (assert) {
      for (const [mode, y] of [
        ['list', 1],
        ['compact', 0],
      ]) {
        await this.renderGrid({
          options: { ...TOP, mode },
          items: [
            { id: 'a', x: 0, y: 0, w: 8, h: 1 },
            { id: 'b', x: 0, y: 1, w: 8, h: 1 },
            { id: 'c', x: 0, y: 2, w: 4, h: 1 },
          ],
        });
        assert.layout({ c: { y } }, mode);
      }
    });

    test('legacy float: true becomes mode float', async function (assert) {
      await this.renderGrid({ options: { float: true } });
      assert.strictEqual(this.grid.instance.opts.mode, 'float');
    });
  });

  test('columnOpts breakpoints follow the container width', async function (assert) {
    await this.renderGrid({
      options: {
        cellHeight: 50,
        // .grid-stack-animate transitions the container width
        animate: false,
        columnOpts: { breakpoints: [{ w: 700, c: 1 }] },
      },
    });
    const gs = this.grid.instance;
    assert.strictEqual(gs.getColumn(), 12, 'wide');

    // gridstack 14 watches the container with a ResizeObserver
    this.grid.element.style.width = '500px';
    window.dispatchEvent(new Event('resize'));
    await waitUntil(() => gs.getColumn() === 1, { timeout: 2000 });
    assert.strictEqual(gs.getColumn(), 1, 'narrow');

    this.grid.element.style.width = '1000px';
    window.dispatchEvent(new Event('resize'));
    await waitUntil(() => gs.getColumn() === 12, { timeout: 2000 });
    assert.strictEqual(gs.getColumn(), 12, 'wide again');
  });
});
