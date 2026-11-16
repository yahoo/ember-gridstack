import { module, test } from 'qunit';
import { setupGridTest } from '../../helpers/setup-grid-test';

module('Integration | Component | grid stack reorder', function (hooks) {
  setupGridTest(hooks);

  hooks.beforeEach(async function () {
    await this.grid.render({
      options: { mode: 'float', cellHeight: 50 },
      items: [0, 1, 2, 3].map((id) => ({ id, x: 0, y: id, w: 1, h: 1 })),
    });
  });

  test('gridstack still has the _sortDom the addon disables', function (assert) {
    const proto = Object.getPrototypeOf(this.grid.instance);
    assert.strictEqual(typeof proto._sortDom, 'function');
    assert.notStrictEqual(this.grid.instance._sortDom, proto._sortDom);
  });

  test('remove a middle item after gridstack moved an item', async function (assert) {
    await this.grid.move('0', { x: 0, y: 5 });
    await this.grid.remove('2');
    assert.inSync();
    assert.deepEqual([...this.grid.domOrder()].sort(), ['0', '1', '3']);
  });

  test('remove a middle item after a drag moved an item', async function (assert) {
    await this.grid.drag('0', 0, 260);
    assert.notStrictEqual(this.grid.node('0').y, 0, 'drag moved the item');
    await this.grid.remove('2');
    assert.inSync();
    assert.deepEqual([...this.grid.domOrder()].sort(), ['0', '1', '3']);
  });

  test('a drag that changes visual order keeps DOM order', async function (assert) {
    await this.grid.drag('0', 0, 260);
    assert.notStrictEqual(this.grid.node('0').y, 0);
    assert.deepEqual(this.grid.domOrder(), ['0', '1', '2', '3']);
  });

  test('reverse the array after gridstack moved an item', async function (assert) {
    await this.grid.move('0', { x: 0, y: 5 });
    await this.grid.setItems([...this.grid.items].reverse());
    assert.inSync();
    assert.deepEqual([...this.grid.domOrder()].sort(), ['0', '1', '2', '3']);
  });

  test('push an item after gridstack moved an item', async function (assert) {
    await this.grid.move('0', { x: 0, y: 5 });
    await this.grid.add({ id: '4', x: 1, y: 0, w: 1, h: 1 });
    assert.inSync();
    const ids = [...this.grid.domOrder()].sort();
    assert.deepEqual(ids, ['0', '1', '2', '3', '4']);
  });
});
