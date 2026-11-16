import { module, test } from 'qunit';
import { hash } from '@ember/helper';
import { settled } from '@ember/test-helpers';
import { setupGridTest } from '../../helpers/setup-grid-test';
import GridStack from 'ember-gridstack/components/grid-stack';

module('Integration | Component | grid stack yield api', function (hooks) {
  setupGridTest(hooks);

  hooks.beforeEach(async function () {
    const yielded = (this.yielded = {});
    const capture = (key, value) => {
      yielded[key] = value;
      return '';
    };
    await this.grid.render({
      template: (d) => <template>
        {{#if d.visible}}
          <GridStack @options={{hash float=true}} as |grid|>
            {{capture "grid" grid}}
            <grid.Item
              data-id="a"
              @options={{hash id="a" x=0 y=2 w=2 h=1}}
              as |item|
            >
              {{capture "item" item}}
            </grid.Item>
            <grid.Item data-id="b" @options={{hash id="b" x=4 y=0 w=2 h=1}} />
          </GridStack>
        {{/if}}
      </template>,
    });
  });

  test('instance', function (assert) {
    assert.strictEqual(this.yielded.grid.instance, this.grid.instance);
  });

  test('compact', async function (assert) {
    this.yielded.grid.compact();
    await settled();
    assert.layout({ a: { y: 0 } });
  });

  test('save', function (assert) {
    const saved = this.yielded.grid.save(false);
    assert.deepEqual(
      saved.map(({ x, y }) => ({ x, y })).sort((p, q) => p.x - q.x),
      [
        { x: 0, y: 2 },
        { x: 4, y: 0 },
      ],
    );
  });

  test('load', async function (assert) {
    const saved = this.yielded.grid.save(false);
    saved.find((n) => n.id === 'a').x = 6;
    this.yielded.grid.load(saved, false);
    await settled();
    assert.layout({ a: { x: 6 } });
  });

  test('enableMove', function (assert) {
    this.yielded.grid.enableMove(false);
    assert.true(this.grid.instance.opts.disableDrag);
    this.yielded.grid.enableMove(true);
    assert.notOk(this.grid.instance.opts.disableDrag);
  });

  test('enableResize', function (assert) {
    this.yielded.grid.enableResize(false);
    assert.true(this.grid.instance.opts.disableResize);
    this.yielded.grid.enableResize(true);
    assert.notOk(this.grid.instance.opts.disableResize);
  });

  test('setMode', function (assert) {
    this.yielded.grid.setMode('list');
    assert.strictEqual(this.grid.instance.opts.mode, 'list');
  });

  test('removeAll', async function (assert) {
    this.yielded.grid.removeAll();
    await settled();
    assert.strictEqual(this.grid.instance.engine.nodes.length, 0);
    assert.ok(this.grid.el('a'), 'DOM left to Ember');
  });

  test('item element', function (assert) {
    assert.strictEqual(this.yielded.item.element, this.grid.el('a'));
  });

  test('item resizeToContent', function (assert) {
    const { instance } = this.grid;
    const calls = [];
    const orig = instance.resizeToContent.bind(instance);
    instance.resizeToContent = (el) => {
      calls.push(el);
      return orig(el);
    };
    this.yielded.item.resizeToContent();
    assert.deepEqual(calls, [this.grid.el('a')]);
  });
});
