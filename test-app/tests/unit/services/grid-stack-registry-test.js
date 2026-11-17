import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

let Service;

module('Unit | Service | grid-stack-registry', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(async function () {
    Service = this.owner.lookup('service:grid-stack-registry');
  });

  test('it registers names once', function (assert) {
    const a = {};
    Service.registerName('main', a);
    assert.strictEqual(Service.get('main'), a);
    assert.throws(
      () => Service.registerName('main', {}),
      /already registered/,
      'a name cannot be registered twice',
    );
    Service.unregisterName('main', {});
    assert.strictEqual(Service.get('main'), a, 'only its own grid unregisters');
    Service.unregisterName('main', a);
    assert.strictEqual(Service.get('main'), undefined);
    assert.strictEqual(Service.find(undefined), undefined);
  });

  test('the legacy id registry is gone', function (assert) {
    assert.strictEqual(Service.registerGrid, undefined);
    assert.strictEqual(Service.findGridComponent, undefined);
    assert.strictEqual(Service.unregisterGridComponent, undefined);
  });
});
