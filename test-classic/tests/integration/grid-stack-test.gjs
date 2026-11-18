import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hash } from '@ember/helper';
import { GridStack } from 'ember-gridstack';

module('Integration | classic build | GridStack', function (hooks) {
  setupRenderingTest(hooks);

  test('renders a grid with one item', async function (assert) {
    await render(
      <template>
        <GridStack as |grid|>
          <grid.Item @options={{hash w=2 h=1}}>hi</grid.Item>
        </GridStack>
      </template>,
    );

    assert.dom('.grid-stack').exists();
    assert.dom('.grid-stack-item').exists({ count: 1 });
  });
});
