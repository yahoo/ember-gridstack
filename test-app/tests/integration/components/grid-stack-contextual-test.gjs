import { module, test } from 'qunit';
import { hash } from '@ember/helper';
import { find } from '@ember/test-helpers';
import { setupGridTest } from '../../helpers/setup-grid-test';
import GridStack from 'ember-gridstack/components/grid-stack';
import GridStackItem from 'ember-gridstack/components/grid-stack-item';

module('Integration | Component | grid stack contextual', function (hooks) {
  setupGridTest(hooks);

  test('grid.Item becomes a widget of its grid', async function (assert) {
    await this.grid.render({
      template: (d) => <template>
        {{#if d.visible}}
          <GridStack as |grid|>
            <grid.Item data-id="a" @options={{hash x=0 y=0 w=2 h=1}} />
            <grid.Item data-id="b" @options={{hash x=4 y=0 w=2 h=1}} />
          </GridStack>
        {{/if}}
      </template>,
    });
    assert.layout({ a: { w: 2 }, b: { x: 4, w: 2 } });
    assert.inSync();
    await this.grid.destroy();
  });

  test('nested grids: each item belongs to its own grid', async function (assert) {
    await this.grid.render({
      template: (d) => <template>
        {{#if d.visible}}
          <GridStack class="outer" as |outer|>
            <outer.Item data-id="o1" @options={{hash w=6 h=4}}>
              <GridStack class="inner" as |inner|>
                <inner.Item data-id="i1" @options={{hash w=2 h=1}} />
                <GridStackItem data-id="i2" @options={{hash x=3 w=2 h=1}} />
              </GridStack>
            </outer.Item>
            <GridStackItem data-id="o2" @options={{hash x=6 w=2 h=1}} />
          </GridStack>
        {{/if}}
      </template>,
    });
    const outer = find('.outer').gridstack;
    const inner = find('.inner').gridstack;
    const ids = (gs) => gs.engine.nodes.map((n) => n.el.dataset.id).sort();
    assert.deepEqual(ids(outer), ['o1', 'o2']);
    assert.deepEqual(ids(inner), ['i1', 'i2']);
    assert.strictEqual(this.grid.node('i1').grid, inner);
    assert.strictEqual(this.grid.node('o1').grid, outer);
    await this.grid.destroy();
  });
});
