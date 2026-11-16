import { module, test } from 'qunit';
import { setupGridTest } from '../../helpers/setup-grid-test';

module('Integration | Component | grid stack interaction', function (hooks) {
  setupGridTest(hooks);

  hooks.beforeEach(async function () {
    await this.grid.render({
      width: '1200px',
      options: { cellHeight: 50, column: 12, mode: 'float' },
      items: [{ id: 'target', x: 0, y: 0, w: 2, h: 2 }],
    });
  });

  test('drag moves the item and fires drag events', async function (assert) {
    const el = this.grid.el('target');
    await this.grid.drag('target', 300, 160);

    const { x, y } = this.grid.node('target');
    assert.ok(x > 0, 'x changed');
    assert.ok(y > 0, 'y changed');
    assert.events(['dragstart', 'drag', 'dragstop', 'change']);
    for (const name of ['dragstart', 'dragstop', 'change']) {
      assert.strictEqual(this.events.of(name).length, 1, `${name} fired once`);
    }
    assert.strictEqual(this.events.of('dragstart')[0].args[1], el);
    assert.strictEqual(this.events.of('dragstop')[0].args[1], el);
    assert.strictEqual(
      this.events.of('change')[0].args[1][0].el,
      el,
      'change gets node',
    );
  });

  test('resize changes the size and fires resize events', async function (assert) {
    const el = this.grid.el('target');
    await this.grid.resize('target', 3, 3);

    const { w, h } = this.grid.node('target');
    assert.ok(w > 2, 'w changed');
    assert.ok(h > 2, 'h changed');
    assert.events(['resizestart', 'resize', 'resizestop', 'change']);
    for (const name of ['resizestart', 'resizestop', 'change']) {
      assert.strictEqual(this.events.of(name).length, 1, `${name} fired once`);
    }
    assert.strictEqual(this.events.of('resizestart')[0].args[1], el);
    assert.strictEqual(this.events.of('resizestop')[0].args[1], el);
  });
});
