// The example in tests/README.md; copy it to start a new grid test.
import { module, test } from 'qunit';
import { setupGridTest } from '../../helpers/setup-grid-test';

module('Integration | Component | grid stack example', function (hooks) {
  setupGridTest(hooks);

  test('dragging moves the item', async function (assert) {
    await this.grid.render({ items: [{ id: 'a', x: 0, y: 0, w: 2, h: 1 }] });
    await this.grid.dragTo('a', { x: 4, y: 0 });
    assert.layout({ a: { x: 4 } });
    assert.events(['dragstart', 'drag', 'dragstop', 'change']);
    assert.inSync();
  });
});
