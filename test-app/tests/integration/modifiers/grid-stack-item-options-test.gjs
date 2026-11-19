import { module, test } from 'qunit';
import { setupGridTest } from '../../helpers/setup-grid-test';

module('Integration | Component | grid stack item options', function (hooks) {
  setupGridTest(hooks);

  test('an @options change updates gridstack once and leaves no stale attributes', async function (assert) {
    await this.grid.render({
      items: [{ id: 'a', x: 0, y: 0, w: 2, h: 1, minW: 1 }],
    });
    const { instance } = this.grid;
    const el = this.grid.el('a');

    let updates = 0;
    let inUpdate = false;
    const update = instance.update.bind(instance);
    instance.update = (...args) => {
      updates++;
      inUpdate = true;
      try {
        return update(...args);
      } finally {
        inUpdate = false;
      }
    };
    // gridstack writes gs-* itself inside update(); the addon must not
    const outsideWrites = [];
    const setAttribute = el.setAttribute.bind(el);
    el.setAttribute = (name, value) => {
      if (name.startsWith('gs-') && !inUpdate) outsideWrites.push(name);
      return setAttribute(name, value);
    };

    await this.grid.update('a', { x: 3, y: 0, w: 2, h: 1, minW: '' });

    assert.strictEqual(updates, 1, 'gridstack update called once');
    assert.deepEqual(outsideWrites, [], 'no gs-* writes outside update()');
    assert.layout({ a: { x: 3, y: 0, w: 2, h: 1 } });
    assert.strictEqual(el.getAttribute('gs-x'), String(this.grid.node('a').x));
    assert.false(el.hasAttribute('gs-min-w'), 'blanked option removed');
    assert.inSync();
  });
});
