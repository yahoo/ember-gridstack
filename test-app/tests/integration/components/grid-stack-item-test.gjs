import { module, test } from 'qunit';
import { render } from '@ember/test-helpers';
import GridStackItem from 'ember-gridstack/components/grid-stack-item';
import { setupGridTest } from '../../helpers/setup-grid-test';

module('Integration | Component | grid stack item', function (hooks) {
  setupGridTest(hooks);

  test('item renders', async function (assert) {
    assert.expect(2);

    // Create a fake version of `grid-stack` component to test update actions
    const MockGridStack = {
      addWidget() {
        assert.step('addWidget');
      },
      removeWidget() {
        assert.step('removeWidget');
        assert.verifySteps(
          ['addWidget', 'removeWidget'],
          'widget is added and then removed',
        );
      },
    };

    const GridStackRegistry = this.owner.lookup('service:grid-stack-registry');

    GridStackRegistry.registerGrid('fake-id', MockGridStack);

    await render(
      <template>
        <div id="fake-id" class="grid-stack">
          <GridStackItem>
            template block text
          </GridStackItem>
        </div>
      </template>,
    );

    assert.dom().hasText('template block text', 'Inner template is yielded');
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
