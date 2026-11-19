import { module, test } from 'qunit';
import { tracked } from '@glimmer/tracking';
import { hash } from '@ember/helper';
import { find, settled } from '@ember/test-helpers';
import GridStack from 'ember-gridstack/components/grid-stack';
import GridStackItem from 'ember-gridstack/components/grid-stack-item';
import { setupGridTest } from '../../helpers/setup-grid-test';

class State {
  @tracked show = true;
  grids = {};
  capture = (name, grid) => {
    this.grids[name] = grid;
    return '';
  };
}

const layout = [{ id: 'w', x: 0, y: 0, w: 2, h: 1 }];

module('Integration | Service | grid-stack-registry', function (hooks) {
  setupGridTest(hooks);

  test('find and get in template and data mode', async function (assert) {
    const s = new State();
    await this.grid.render({
      template: (d) => <template>
        {{#if d.visible}}
          {{#if s.show}}
            <GridStack
              id="x"
              @name="sidebar"
              @options={{hash column=6}}
              as |grid|
            >
              {{s.capture "template" grid}}
              <GridStackItem data-id="a" @options={{hash id="a" w=2 h=1}}>
                <span class="inner">a</span>
              </GridStackItem>
            </GridStack>
          {{/if}}
          <GridStack id="data" @name="board" @layout={{layout}} as |w grid|>
            {{s.capture "data" grid}}
            <b class="data-inner">{{w.id}}</b>
          </GridStack>
        {{/if}}
      </template>,
    });
    const registry = this.owner.lookup('service:grid-stack-registry');
    const T = s.grids.template;
    const D = s.grids.data;
    assert.ok(T, 'template grid yielded');
    assert.ok(D, 'data grid yielded');
    assert.dom('#x').hasClass('grid-stack', 'the id lands on the grid');

    for (const [label, target] of [
      ['instance', T.instance],
      ['.grid-stack', find('#x')],
      ['item element', find('[data-id="a"]')],
      ['inner element', find('#x .inner')],
    ]) {
      assert.strictEqual(registry.find(target), T, `template: ${label}`);
    }
    for (const [label, target] of [
      ['instance', D.instance],
      ['.grid-stack', find('#data')],
      ['item element', find('#data .grid-stack-item')],
      ['inner element', find('.data-inner')],
    ]) {
      assert.strictEqual(registry.find(target), D, `data: ${label}`);
    }
    assert.strictEqual(registry.get('sidebar'), T);
    assert.strictEqual(registry.get('board'), D);
    assert.strictEqual(registry.find(document.body), undefined);
    assert.strictEqual(registry.find(undefined), undefined);

    const el = find('#x');
    s.show = false;
    await settled();
    assert.strictEqual(registry.get('sidebar'), undefined, 'unregistered');
    assert.strictEqual(registry.find(el), undefined);
    assert.strictEqual(registry.get('board'), D);
    await this.grid.destroy();
    assert.strictEqual(registry.get('board'), undefined);
  });
});
