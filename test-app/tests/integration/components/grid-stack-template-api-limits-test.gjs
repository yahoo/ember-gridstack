// Records what the template API (<GridStack><GridStackItem/>{{#each}}) does
// in the data-mode DnD scenarios; see docs/wrapper-parity.md.
import { module, test } from 'qunit';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import { hash } from '@ember/helper';
import {
  click,
  find,
  findAll,
  settled,
  setupOnerror,
  resetOnerror,
} from '@ember/test-helpers';
import GridStack from 'ember-gridstack/components/grid-stack';
import GridStackItem from 'ember-gridstack/components/grid-stack-item';
import { setupGridTest } from '../../helpers/setup-grid-test';
import { pointerDrag } from '../../helpers/grid';

class Counter extends Component {
  @tracked count = 0;
  inc = () => this.count++;
  <template>
    <button
      type="button"
      class="inc"
      {{on "click" this.inc}}
    >{{this.count}}</button>
  </template>
}

const dragTo = (itemEl, x, y) => {
  const r = itemEl
    .querySelector('.grid-stack-item-content')
    .getBoundingClientRect();
  const fx = r.left + Math.min(10, r.width / 2);
  const fy = r.top + Math.min(10, r.height / 2);
  return pointerDrag(itemEl, x - fx, y - fy, 16);
};

class Items {
  @tracked left = [{ id: 'a', options: { x: 0, y: 0, w: 2, h: 2 } }];
  @tracked right = [{ id: 'b', options: { x: 0, y: 0, w: 2, h: 2 } }];
}

module('Integration | Component | template api limits', function (hooks) {
  setupGridTest(hooks);

  hooks.beforeEach(function () {
    this.errors = [];
    setupOnerror((e) => this.errors.push(String(e?.message ?? e)));
  });
  hooks.afterEach(() => resetOnerror());

  test('cross-grid drag with {{#each}}<GridStackItem>', async function (assert) {
    const items = new Items();
    await this.grid.render({
      template: (d) => <template>
        {{! template-lint-disable no-inline-styles }}
        {{#if d.visible}}
          <div style="display: flex; width: 1000px">
            <div style="width: 500px">
              <GridStack
                id="left"
                @options={{hash acceptWidgets=true column=6 minRow=4}}
              >
                {{#each items.left key="id" as |item|}}
                  <GridStackItem
                    data-id={{item.id}}
                    @options={{item.options}}
                  ><Counter /></GridStackItem>
                {{/each}}
              </GridStack>
            </div>
            <div style="width: 500px">
              <GridStack
                id="right"
                @options={{hash acceptWidgets=true column=6 minRow=4}}
              >
                {{#each items.right key="id" as |item|}}
                  <GridStackItem
                    data-id={{item.id}}
                    @options={{item.options}}
                  ><Counter /></GridStackItem>
                {{/each}}
              </GridStack>
            </div>
          </div>
        {{/if}}
      </template>,
    });
    await click('[data-id="a"] .inc');
    const itemEl = find('[data-id="a"]');
    const rr = find('#right').getBoundingClientRect();
    await dragTo(itemEl, rr.left + rr.width * 0.6, rr.top + rr.height * 0.6);
    await settled();

    const leftGs = find('#left').gridstack;
    const rightGs = find('#right').gridstack;
    const obs = {
      inRight: find('#right').contains(itemEl),
      leftNodes: leftGs.engine.nodes.map((n) => n.el?.dataset.id),
      rightNodes: rightGs.engine.nodes.map((n) => n.el?.dataset.id).sort(),
      count: find('[data-id="a"] .inc')?.textContent.trim(),
      errors: this.errors,
    };
    // without @onDropped the target refuses the drop (see grid-stack-template-drop-test)
    assert.false(obs.inRight, 'the element stays in the left grid');
    assert.deepEqual(obs.rightNodes, ['b']);
    assert.deepEqual(obs.leftNodes, ['a']);
    assert.strictEqual(obs.count, '1', 'same component');
    assert.deepEqual(this.errors, [], 'no error is raised');

    await this.grid.destroy();
    assert.strictEqual(findAll('.grid-stack').length, 0);
  });

  test('removable trash with {{#each}}<GridStackItem>', async function (assert) {
    const items = new Items();
    items.left = [{ id: 'a', options: { x: 0, y: 0, w: 2, h: 1 } }];
    await this.grid.render({
      template: (d) => <template>
        {{! template-lint-disable no-inline-styles }}
        {{#if d.visible}}
          <div style="width: 1000px">
            <div id="trash" style="width: 200px; height: 100px">trash</div>
            <GridStack @options={{hash removable="#trash"}}>
              {{#each items.left key="id" as |item|}}
                <GridStackItem
                  data-id={{item.id}}
                  @options={{item.options}}
                ><Counter /></GridStackItem>
              {{/each}}
            </GridStack>
          </div>
        {{/if}}
      </template>,
    });
    const gs = find('.grid-stack').gridstack;
    const tr = find('#trash').getBoundingClientRect();
    await dragTo(
      find('[data-id="a"]'),
      tr.left + tr.width / 2,
      tr.top + tr.height / 2,
    );
    await settled();
    const obs = {
      nodes: gs.engine.nodes.length,
      aInDom: Boolean(find('[data-id="a"]')),
      emberItems: items.left.map((i) => i.id),
      errors: [...this.errors],
    };
    assert.strictEqual(obs.nodes, 0, 'gridstack dropped the node');
    assert.true(obs.aInDom, 'Ember removes the element, not gridstack');
    assert.deepEqual(obs.emberItems, ['a'], 'until the app drops the record');

    items.left = [];
    await settled();
    assert.false(Boolean(find('[data-id="a"]')));
    assert.deepEqual(
      this.errors,
      [],
      'syncing the data afterwards (app must do it by hand from @onRemoved) raises no error',
    );
    await this.grid.destroy();
  });
});
