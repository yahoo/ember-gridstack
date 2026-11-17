import { module, test } from 'qunit';
import { click, findAll, render } from '@ember/test-helpers';
import { setupRenderingTest } from '../../helpers';
import DataMode from 'test-app/components/examples/data-mode';

module('Integration | Example | data mode', function (hooks) {
  setupRenderingTest(hooks);

  test('renders two grids and a toolbox with a clean console', async function (assert) {
    const logged = [];
    const { warn, error } = console;
    console.warn = (...args) => logged.push(['warn', ...args]);
    console.error = (...args) => logged.push(['error', ...args]);
    try {
      await render(<template><DataMode /></template>);
      assert.strictEqual(findAll('.data-mode-grid').length, 2);
      assert.dom('[gs-id="visits"] .stat-value').hasText('3');
      assert.dom('.toolbox-chip').exists({ count: 2 });
      assert.dom('.data-mode-trash').hasText('Drop to delete');
      await click('[gs-id="visits"] .button');
      await click('.toolbar .button');
      assert.dom('.saved-json').includesText('"count": 4');
    } finally {
      console.warn = warn;
      console.error = error;
    }
    assert.deepEqual(logged, [], 'no console warnings or errors');
  });
});
