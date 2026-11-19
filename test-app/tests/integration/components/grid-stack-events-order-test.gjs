import { module, test } from 'qunit';
import { run } from '@ember/runloop';
import { settled } from '@ember/test-helpers';
import { setupGridTest } from '../../helpers/setup-grid-test';
import GridStack from 'ember-gridstack/components/grid-stack';
import GridStackItem from 'ember-gridstack/components/grid-stack-item';

module('Integration | Component | grid stack events order', function (hooks) {
  setupGridTest(hooks);

  test('events fired in one runloop are all delivered in order', async function (assert) {
    const calls = [];
    const handler = (event, detail) => calls.push([event.type, detail]);

    await this.grid.render({
      template: (d) => <template>
        {{#if d.visible}}
          <GridStack @onAdded={{handler}} @onRemoved={{handler}}>
            <GridStackItem data-id="a" />
          </GridStack>
        {{/if}}
      </template>,
    });
    calls.length = 0;

    const fire = (type, detail) =>
      this.grid.element.dispatchEvent(new CustomEvent(type, { detail }));
    run(() => {
      fire('added', ['first']);
      fire('added', ['second']);
      fire('removed', ['third']);
    });
    await settled();

    assert.deepEqual(calls, [
      ['added', ['first']],
      ['added', ['second']],
      ['removed', ['third']],
    ]);
    await this.grid.destroy();
  });
});
