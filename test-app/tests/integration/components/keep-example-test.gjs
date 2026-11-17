import { module, test } from 'qunit';
import { click, find, findAll, render, settled } from '@ember/test-helpers';
import { setupRenderingTest } from '../../helpers';
import { pointerDrag } from '../../helpers/grid';
import Keep, {
  loading,
} from 'test-app/components/examples/keep-instead-of-rebuild';

const dragTo = (itemEl, target, fx = 0.7, fy = 0.5) => {
  const r = itemEl.getBoundingClientRect();
  const t = target.getBoundingClientRect();
  return pointerDrag(
    itemEl,
    t.left + t.width * fx - (r.left + r.width / 2),
    t.top + t.height * fy - (r.top + r.height / 2),
    16,
  );
};

const created = () => Number(find('.keep-created').textContent.match(/\d+/)[0]);

module('Integration | Example | keep instead of rebuild', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.saved = { ...loading };
    loading.ms = 10;
    loading.tick = false;
    this.logged = [];
    this.console = { warn: console.warn, error: console.error };
    console.warn = (...args) => this.logged.push(['warn', ...args]);
    console.error = (...args) => this.logged.push(['error', ...args]);
  });

  hooks.afterEach(function () {
    Object.assign(loading, this.saved);
    Object.assign(console, this.console);
  });

  const setup = async () => {
    await render(
      <template>
        {{! template-lint-disable no-inline-styles }}
        <div style="width: 1000px"><Keep /></div>
      </template>,
    );
  };

  test('keep off: a move rebuilds and reloads the report', async function (assert) {
    await setup();
    const n = created();
    const svg = find('.keep-left .keep-chart');
    assert.ok(svg, 'chart loaded in the left grid');
    await dragTo(find('[gs-id="report"]'), find('.keep-right'));
    await settled();
    assert.strictEqual(created(), n + 1, 'rebuilt');
    assert.false(svg.isConnected, 'old chart gone');
    assert.dom('.keep-right [gs-id="report"] .keep-chart').exists();
    assert.deepEqual(this.logged, []);
  });

  test('keep on: a move keeps the instance', async function (assert) {
    await setup();
    await click('.keep-toggle');
    const n = created();
    const svg = find('.keep-chart');
    await dragTo(find('[gs-id="report"]'), find('.keep-right'));
    await settled();
    assert.strictEqual(created(), n, 'not rebuilt');
    assert.true(svg.isConnected);
    assert.strictEqual(find('[gs-id="report"] .keep-chart'), svg, 'same svg');
    assert.dom('.keep-spinner').doesNotExist();
    assert.true(
      find('.keep-right').contains(find('[gs-id="report"]')),
      'in the right grid',
    );
    assert.deepEqual(this.logged, []);
  });

  test('keep on: destroying the left grid rebuilds with the ticks', async function (assert) {
    await setup();
    await click('.keep-toggle');
    await dragTo(find('[gs-id="report"]'), find('.keep-right'));
    await settled();
    const ticks = find('.keep-ticks').textContent;
    const n = created();
    await click('.keep-destroy');
    assert.dom('.keep-left').doesNotExist();
    assert.dom('.keep-destroy').hasText('Restore left grid');
    assert.strictEqual(created(), n + 1, 'rebuilt once');
    assert.dom('.keep-right [gs-id="report"]').exists({ count: 1 });
    assert.dom('.keep-right .keep-ticks').hasText(ticks);
    assert.deepEqual(this.logged, []);
  });

  test('lead and hook legend', async function (assert) {
    await setup();
    assert.dom('.example-lead .badge').hasText('unstable');
    assert.deepEqual(
      findAll('.hook-legend dt code').map((e) => e.textContent),
      [
        'beforeRemove',
        'unstable_keep',
        'droppedFrom.state',
        'registerSerializer',
      ],
    );
  });
});
