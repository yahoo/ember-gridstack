import { module, test } from 'qunit';
import { tracked } from '@glimmer/tracking';
import { click, find, findAll, render, settled } from '@ember/test-helpers';
import { setupRenderingTest } from '../../helpers';
import { pointerDrag } from '../../helpers/grid';
import TemplateDrops from 'test-app/components/examples/template-drops';

// gridstack looks for drop targets under the dragged item's center
const dragTo = (itemEl, target, fx = 0.5, fy = 0.5) => {
  const r = itemEl.getBoundingClientRect();
  const t = target.getBoundingClientRect();
  return pointerDrag(
    itemEl,
    t.left + t.width * fx - (r.left + r.width / 2),
    t.top + t.height * fy - (r.top + r.height / 2),
    16,
  );
};

class Visible {
  @tracked on = true;
}

module('Integration | Example | template drops', function (hooks) {
  setupRenderingTest(hooks);

  test('moves, drags in and trashes with a clean console', async function (assert) {
    const logged = [];
    const { warn, error } = console;
    console.warn = (...args) => logged.push(['warn', ...args]);
    console.error = (...args) => logged.push(['error', ...args]);
    const v = new Visible();
    try {
      await render(
        <template>
          {{! template-lint-disable no-inline-styles }}
          {{#if v.on}}<div style="width: 1000px"><TemplateDrops /></div>{{/if}}
        </template>,
      );
      const [left, right] = findAll('.data-mode-grid');
      const label = (grid) =>
        [...grid.querySelectorAll('.widget-label')].map((l) =>
          l.textContent.trim(),
        );
      assert.deepEqual(label(left), ['Apples', 'Pears']);

      await click('[gs-id="apples"] .button');
      await dragTo(find('[gs-id="apples"]'), right, 0.7, 0.7);
      await settled();
      assert.deepEqual(label(left), ['Pears']);
      assert.deepEqual(label(right), ['Plums', 'Apples']);
      assert.dom('[gs-id="apples"] .stat-value').hasText('1', 'state moved');

      await dragTo(find('[gs-id="pears"]'), find('.template-drops-trash'));
      await settled();
      assert.strictEqual(left.gridstack.engine.nodes.length, 0);
      assert.deepEqual(label(left), []);

      await dragTo(find('.toolbox-chip'), left, 0.7, 0.7);
      await settled();
      assert.deepEqual(label(left), ['New 1']);
      assert.dom('.toolbox-chip').exists({ count: 1 });
      v.on = false;
      await settled();
    } finally {
      console.warn = warn;
      console.error = error;
    }
    assert.deepEqual(logged, [], 'no console warnings or errors');
  });
});
