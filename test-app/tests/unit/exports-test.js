import { module, test } from 'qunit';
import { setupTest } from 'test-app/tests/helpers';
import {
  GridStack,
  GridStackItem,
  GridStackLayout,
  gsItemAttributes,
  GridStackRegistry,
  GRID_STACK_EVENTS,
} from 'ember-gridstack';
import DeepGridStack from 'ember-gridstack/components/grid-stack';
import DeepGridStackJs from 'ember-gridstack/components/grid-stack.js';
import DeepGridStackItem from 'ember-gridstack/components/grid-stack-item';
import DeepGridStackItemJs from 'ember-gridstack/components/grid-stack-item.js';
import DeepGridStackLayout from 'ember-gridstack/components/grid-stack-layout';
import DeepGridStackLayoutJs from 'ember-gridstack/components/grid-stack-layout.js';
import DeepGsItemAttributes from 'ember-gridstack/modifiers/gs-item-attributes';
import DeepGsItemAttributesJs from 'ember-gridstack/modifiers/gs-item-attributes.js';
import DeepRegistry from 'ember-gridstack/services/grid-stack-registry';
import DeepRegistryJs from 'ember-gridstack/services/grid-stack-registry.js';

module('Unit | exports', function (hooks) {
  setupTest(hooks);

  test('root named exports are defined', function (assert) {
    assert.ok(GridStack);
    assert.ok(GridStackItem);
    assert.ok(gsItemAttributes);
    assert.ok(GridStackRegistry);
    assert.strictEqual(GRID_STACK_EVENTS.length, 13);
  });

  test('deep imports resolve to the same modules', function (assert) {
    assert.strictEqual(GridStack, DeepGridStack);
    assert.strictEqual(GridStackItem, DeepGridStackItem);
  });

  test('every documented path resolves, with and without .js', function (assert) {
    const paths = [
      [GridStack, DeepGridStack, DeepGridStackJs],
      [GridStackItem, DeepGridStackItem, DeepGridStackItemJs],
      [GridStackLayout, DeepGridStackLayout, DeepGridStackLayoutJs],
      [gsItemAttributes, DeepGsItemAttributes, DeepGsItemAttributesJs],
      [GridStackRegistry, DeepRegistry, DeepRegistryJs],
    ];
    for (const [root, bare, js] of paths) {
      assert.ok(root);
      assert.strictEqual(bare, root);
      assert.strictEqual(js, root);
    }
  });
});
