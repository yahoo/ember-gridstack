import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | grid stack item', function (hooks) {
  setupRenderingTest(hooks);

  test('item renders', async function (assert) {
    assert.expect(4);

    // Create a fake version of `grid-stack` component to test update actions
    const MockGridStack = {
      addWidget() {
        assert.step('addWidget');
      },
      removeWidget() {
        assert.step('removeWidget');
        assert.verifySteps(['addWidget', 'removeWidget'], 'widget is added and then removed');
      },
    };

    const GridStackRegistry = this.owner.lookup('service:grid-stack-registry');

    GridStackRegistry.registerGrid('fake-id', MockGridStack);

    await render(hbs`
      <div id="fake-id" class="grid-stack">
        <GridStackItem>
          template block text
        </GridStackItem>
      </div>
    `);

    assert.dom().hasText('template block text', 'Inner template is yielded');
  });

  test('item options', async function (assert) {
    assert.expect(3);

    this.set('options', {
      minH: 2,
    });

    await render(hbs`<GridStackItem @options={{this.options}} />`);

    assert.dom('.grid-stack-item').hasAttribute('gs-min-h', '2', 'Item options are added as data attributes');

    this.set('options', {
      minH: 3,
    });

    assert.dom('.grid-stack-item').hasAttribute('gs-min-h', '3', 'Data attributes are updated with options');

    this.set('options', {
      minH: undefined,
    });

    assert.dom('.grid-stack-item').doesNotHaveAttribute('gs-min-h', 'Data attributes can be removed');
  });
});
