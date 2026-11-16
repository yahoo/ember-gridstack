import { module, test } from 'qunit';
import { hash } from '@ember/helper';
import { setupGridTest } from '../../helpers/setup-grid-test';
import GridStack from 'ember-gridstack/components/grid-stack';
import GridStackItem from 'ember-gridstack/components/grid-stack-item';

module('Integration | Component | grid stack id', function (hooks) {
  setupGridTest(hooks);

  test('user ids on grid and items are kept and items are widgets', async function (assert) {
    await this.grid.render({
      template: (d) => <template>
        {{#if d.visible}}
          <GridStack id="dashboard" @options={{d.gridOptions}}>
            <GridStackItem id="card-1" data-id="a" @options={{hash w=2 h=1}} />
            <GridStackItem id="card-2" data-id="b" @options={{hash w=2 h=1}} />
          </GridStack>
        {{/if}}
      </template>,
    });

    assert.strictEqual(this.grid.element.id, 'dashboard');
    assert.strictEqual(this.grid.el('a').id, 'card-1');
    assert.strictEqual(this.grid.el('b').id, 'card-2');
    assert.ok(this.grid.node('a'), 'a is a widget');
    assert.ok(this.grid.node('b'), 'b is a widget');
    assert.inSync();

    this.grid.instance.removeWidget(this.grid.el('a'), false);
    assert.deepEqual(
      this.grid.instance.engine.nodes.map((n) => n.el.id),
      ['card-2'],
    );
    await this.grid.destroy();
  });
});
