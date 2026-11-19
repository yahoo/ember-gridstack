import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import gsItemAttributes from 'ember-gridstack/modifiers/gs-item-attributes';

class State {
  @tracked options;
}

module('Integration | Modifier | item-attributes', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    const state = new State();

    await render(
      <template>
        <div class="modifier-elm" {{gsItemAttributes state.options}}></div>
      </template>,
    );

    state.options = { x: 1, y: 2 };
    await settled();
    assert
      .dom('.modifier-elm')
      .hasAttribute('gs-x', '1', 'modifier inserts the correct attribute');
    assert
      .dom('.modifier-elm')
      .hasAttribute('gs-y', '2', 'modifier inserts the correct attribute');

    state.options = { x: 11, y: null };
    await settled();
    assert
      .dom('.modifier-elm')
      .hasAttribute('gs-x', '11', 'modifier updates the correct attribute');
    assert.dom('.modifier-elm').doesNotHaveAttribute('gs-y');
  });
});
