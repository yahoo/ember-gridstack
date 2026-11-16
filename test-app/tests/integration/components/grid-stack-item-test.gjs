import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import GridStackItem from 'ember-gridstack/components/grid-stack-item';

class State {
  @tracked options;
}

module('Integration | Component | grid stack item', function (hooks) {
  setupRenderingTest(hooks);

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
    assert.expect(3);

    const state = new State();
    state.options = { minH: 2 };

    await render(
      <template><GridStackItem @options={{state.options}} /></template>,
    );

    assert
      .dom('.grid-stack-item')
      .hasAttribute(
        'gs-min-h',
        '2',
        'Item options are added as data attributes',
      );

    state.options = { minH: 3 };
    await settled();

    assert
      .dom('.grid-stack-item')
      .hasAttribute(
        'gs-min-h',
        '3',
        'Data attributes are updated with options',
      );

    state.options = { minH: undefined };
    await settled();

    assert
      .dom('.grid-stack-item')
      .doesNotHaveAttribute('gs-min-h', 'Data attributes can be removed');
  });
});
