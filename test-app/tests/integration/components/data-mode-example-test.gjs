import { module, test } from 'qunit';
import { click, find, findAll, render, settled } from '@ember/test-helpers';
import { setupRenderingTest } from '../../helpers';
import DataMode from 'test-app/components/examples/data-mode';

const fire = (target, type, x, y) =>
  target.dispatchEvent(
    new MouseEvent(type, {
      bubbles: true,
      cancelable: true,
      view: window,
      button: 0,
      buttons: type === 'mouseup' ? 0 : 1,
      clientX: x,
      clientY: y,
    }),
  );

const dragOnto = async (itemEl, targetEl) => {
  const handle = itemEl.querySelector('.grid-stack-item-content');
  const r = handle.getBoundingClientRect();
  const t = targetEl.getBoundingClientRect();
  const x0 = r.left + 10;
  const y0 = r.top + 10;
  const dx = t.left + t.width / 2 - (r.left + r.width / 2);
  const dy = t.top + t.height / 2 - (r.top + r.height / 2);
  fire(handle, 'mousedown', x0, y0);
  fire(document, 'mousemove', x0 + Math.sign(dx) * 4, y0 + Math.sign(dy) * 4);
  for (let i = 1; i <= 16; i++) {
    fire(document, 'mousemove', x0 + (dx * i) / 16, y0 + (dy * i) / 16);
  }
  fire(document, 'mouseup', x0 + dx, y0 + dy);
  await settled();
};

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

  test('narrow: one column, cross-grid drag and trash work', async function (assert) {
    await render(
      <template>
        {{! template-lint-disable no-inline-styles }}
        <div style="width: 390px"><DataMode /></div>
      </template>,
    );
    const [left, right] = findAll('.data-mode-grid');
    assert.strictEqual(left.gridstack.getColumn(), 1, 'one column');
    await dragOnto(find('[gs-id="visits"]'), right);
    assert.dom(right.querySelector('[gs-id="visits"]')).exists('moved right');
    // the trash sits below the visible part of the test container
    find('[gs-id="signups"]').scrollIntoView({ block: 'start' });
    await dragOnto(find('[gs-id="signups"]'), find('.data-mode-trash'));
    assert.dom('[gs-id="signups"]').doesNotExist('trashed');
  });

  test('lead and hook legend', async function (assert) {
    await render(<template><DataMode /></template>);
    assert.dom('.example-lead').exists();
    assert.deepEqual(
      findAll('.hook-legend dt code').map((e) => e.textContent),
      [
        '@layout',
        '@components',
        'beforeRemove',
        'droppedFrom',
        'registerSerializer',
        'removable',
      ],
    );
  });
});
