import { module, test } from 'qunit';
import { setupTest } from 'test-app/tests/helpers';
import {
  GridStack,
  GridStackItem,
  gsItemAttributes,
  GridStackRegistry,
  GRID_STACK_EVENTS,
} from 'ember-gridstack';
import DeepGridStack from 'ember-gridstack/components/grid-stack';
import DeepGridStackItem from 'ember-gridstack/components/grid-stack-item.js';

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
});
