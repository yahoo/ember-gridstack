import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled, find } from '@ember/test-helpers';
import GridStack from 'ember-gridstack/components/grid-stack';
import GridStackItem from 'ember-gridstack/components/grid-stack-item';
import { State, Item, gridFor, itemTexts } from '../../helpers/grid';

const sorted = (a) => [...a].sort();

module('Integration | Component | grid stack reorder', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(async function () {
    this.state = new State();
    this.state.items = [0, 1, 2, 3].map(
      (id) => new Item(String(id), { x: 0, y: id, w: 1, h: 1 }),
    );
    this.state.options = { mode: 'float', cellHeight: 50 };
    const state = this.state;
    await render(
      <template>
        {{! template-lint-disable no-inline-styles }}
        <div style="width: 1000px">
          <GridStack @options={{state.options}}>
            {{#each state.items as |item|}}
              <GridStackItem data-id={{item.id}} @options={{item.options}}>
                {{item.id}}
              </GridStackItem>
            {{/each}}
          </GridStack>
        </div>
      </template>,
    );
    this.grid = gridFor(this.owner, '.grid-stack');
  });

  async function moveFirstAway(ctx) {
    ctx.grid.gridStack.update(find('[data-id="0"]'), { x: 0, y: 5 });
    await settled();
  }

  function check(assert, ctx, expected) {
    assert.deepEqual(
      sorted(itemTexts()),
      sorted(expected),
      'rendered items match',
    );
    expected.forEach((id) =>
      assert.dom(`[data-id="${id}"]`).exists({ count: 1 }),
    );
    assert.strictEqual(ctx.grid.gridStack.engine.nodes.length, expected.length);
  }

  test('reverse the array after gridstack moved an item', async function (assert) {
    await moveFirstAway(this);
    this.state.items = [...this.state.items].reverse();
    await settled();
    check(assert, this, ['0', '1', '2', '3']);
  });

  test('push an item after gridstack moved an item', async function (assert) {
    await moveFirstAway(this);
    this.state.items = [
      ...this.state.items,
      new Item('4', { x: 1, y: 0, w: 1, h: 1 }),
    ];
    await settled();
    check(assert, this, ['0', '1', '2', '3', '4']);
  });
});
