import { module, test } from 'qunit';
import GridStack from 'ember-gridstack/components/grid-stack';
import GridStackItem from 'ember-gridstack/components/grid-stack-item';
import { setupGridTest } from '../../helpers/setup-grid-test';

module('Integration | Component | grid stack item', function (hooks) {
  setupGridTest(hooks);

  test('item renders', async function (assert) {
    await this.grid.render({
      template: (d) => <template>
        <GridStack>
          {{#each d.items key="id" as |item|}}
            <GridStackItem @options={{item.options}}>
              template block text
            </GridStackItem>
          {{/each}}
        </GridStack>
      </template>,
      items: [{ id: 'a' }],
    });

    assert
      .dom('.grid-stack-item')
      .hasText('template block text', 'Inner template is yielded');
    assert.strictEqual(
      document.querySelector('.grid-stack').gridstack.engine.nodes.length,
      1,
      'widget is added to its grid',
    );
  });

  test('item options', async function (assert) {
    await this.grid.render({
      template: (d) => <template>
        {{#each d.items key="id" as |item|}}
          <GridStackItem @options={{item.options}} />
        {{/each}}
      </template>,
      items: [{ id: 'a', minH: 2 }],
    });

    assert
      .dom('.grid-stack-item')
      .hasAttribute(
        'gs-min-h',
        '2',
        'Item options are added as data attributes',
      );

    await this.grid.update('a', { minH: 3 });

    assert
      .dom('.grid-stack-item')
      .hasAttribute(
        'gs-min-h',
        '3',
        'Data attributes are updated with options',
      );

    await this.grid.update('a', { minH: undefined });

    assert
      .dom('.grid-stack-item')
      .doesNotHaveAttribute('gs-min-h', 'Data attributes can be removed');
  });
});
