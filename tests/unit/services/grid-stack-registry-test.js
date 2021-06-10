import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

let Service;

module('Unit | Service | grid-stack-registry', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(async function () {
    Service = this.owner.lookup('service:grid-stack-registry');
  });

  test('it registers and unregisters grids', function (assert) {
    Service.registerGrid('id1', 'thing');
    Service.registerGrid('id2', 'thing');
    assert.throws(
      () => Service.registerGrid('id1', 'thing2'),
      /grid should not be already registered/,
      'grid cannot be registered twice'
    );

    Service.unregisterGridComponent('id1');
    Service.registerGrid('id1', 'thing2');
  });

  test('it can find registered grids', function (assert) {
    Service.registerGrid('id1', 'thing');

    const mockElement = {
      closest: () => ({ id: 'id1' }),
    };
    assert.strictEqual(
      Service.findGridComponent(mockElement),
      'thing',
      'Searches element for closest gridstack element'
    );
  });

  test('it throws error for unregistered grids', function (assert) {
    const mockElementNoId = {
      closest: () => ({ id: undefined }),
    };
    assert.throws(
      () => Service.findGridComponent(mockElement),
      /a/,
      'Throws error if a grid stack element is found but has no id'
    );

    const mockElement = {
      closest: () => ({ id: 'id1' }),
    };
    assert.throws(
      () => Service.findGridComponent(mockElement),
      /a/,
      'Throws error if no grid is found by the given id'
    );
  });
});
