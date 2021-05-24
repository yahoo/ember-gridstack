import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Modifier | item-attributes', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`<div class="modifier-elm" {{gs-item-attributes this.options}}></div>`);

    this.set('options', { x: 1, y: 2 });
    assert.dom('.modifier-elm').hasAttribute('data-gs-x', '1', 'modifier inserts the correct attribute');
    assert.dom('.modifier-elm').hasAttribute('data-gs-y', '2', 'modifier inserts the correct attribute');

    this.set('options', { x: 11, y: null });
    assert.dom('.modifier-elm').hasAttribute('data-gs-x', '11', 'modifier updates the correct attribute');
    assert.dom('.modifier-elm').doesNotHaveAttribute('data-gs-y');
  });
});
