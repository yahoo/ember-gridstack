import { module, test } from 'qunit';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import { array, hash } from '@ember/helper';
import { click, find, findAll, settled } from '@ember/test-helpers';
import GridStack from 'ember-gridstack/components/grid-stack';
import { setupGridTest } from '../../helpers/setup-grid-test';
import { pointerDrag } from '../../helpers/grid';

const lifecycle = { created: 0, destroyed: 0 };

class Counter extends Component {
  @tracked count = 0;

  constructor() {
    super(...arguments);
    lifecycle.created++;
    this.count = this.args.widget.droppedFrom?.state ?? 0;
    this.args.widget.beforeRemove(() => this.count);
  }

  willDestroy() {
    super.willDestroy(...arguments);
    lifecycle.destroyed++;
  }

  inc = () => {
    this.count++;
  };

  <template>
    <button type="button" class="inc" {{on "click" this.inc}}>
      {{this.count}}
    </button>
  </template>
}

const Note = <template>
  <i class="note">{{@props.text}}</i>
</template>;

const components = { counter: Counter, note: Note };

/** Center of `el` in screen pixels. */
const center = (el) => {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
};

/** Drags `itemEl` so its grab point lands on `target`'s center. */
const dragOnto = (itemEl, target) => {
  const r = itemEl
    .querySelector('.grid-stack-item-content')
    .getBoundingClientRect();
  const from = {
    x: r.left + Math.min(10, r.width / 2),
    y: r.top + Math.min(10, r.height / 2),
  };
  const to = center(target);
  return pointerDrag(itemEl, to.x - from.x, to.y - from.y, 16);
};

module('Integration | Component | grid stack layout dnd', function (hooks) {
  setupGridTest(hooks);

  hooks.beforeEach(function () {
    lifecycle.created = lifecycle.destroyed = 0;
  });

  test('3: drag a widget to another grid (acceptWidgets)', async function (assert) {
    const left = [{ id: 'a', x: 0, y: 0, w: 2, h: 2, component: 'counter' }];
    const right = [{ id: 'b', x: 0, y: 0, w: 2, h: 2, component: 'counter' }];
    await this.grid.render({
      template: (d) => <template>
        {{! template-lint-disable no-inline-styles }}
        {{#if d.visible}}
          <div style="display: flex; width: 1000px">
            <div style="width: 500px">
              <GridStack
                id="left"
                @options={{hash acceptWidgets=true column=6 minRow=4}}
                @layout={{left}}
                @components={{components}}
              />
            </div>
            <div style="width: 500px">
              <GridStack
                id="right"
                @options={{hash acceptWidgets=true column=6 minRow=4}}
                @layout={{right}}
                @components={{components}}
              />
            </div>
          </div>
        {{/if}}
      </template>,
    });
    const A = find('#left')._gridComp;
    const B = find('#right')._gridComp;
    await click('[gs-id="a"] .inc');
    await click('[gs-id="a"] .inc');
    assert.strictEqual(lifecycle.created, 2);

    // empty cell below b in the right grid
    const rightRect = find('#right').getBoundingClientRect();
    const target = {
      getBoundingClientRect: () => ({
        left: rightRect.left + rightRect.width * 0.6,
        top: rightRect.top + rightRect.height * 0.6,
        width: 0,
        height: 0,
      }),
    };
    const itemEl = find('[gs-id="a"]');
    await dragOnto(itemEl, {
      getBoundingClientRect: target.getBoundingClientRect,
    });
    await settled();

    assert.true(
      find('#right').contains(itemEl),
      'synthetic mouse DnD crosses grids: item element moved to the right grid',
    );
    assert.deepEqual(
      A.instance.engine.nodes.map((n) => n.id),
      [],
    );
    assert.deepEqual(B.instance.engine.nodes.map((n) => n.id).sort(), [
      'a',
      'b',
    ]);
    assert.deepEqual(
      A.widgets.map((w) => w.id),
      [],
      'old grid dropped the record',
    );
    assert.deepEqual(
      B.widgets.map((w) => w.id).sort(),
      ['a', 'b'],
      'new grid owns the record',
    );
    assert.strictEqual(
      itemEl._gridItemRef.gridComp,
      B,
      '_gridItemRef transferred',
    );
    assert.strictEqual(
      findAll('[gs-id="a"] .inc').length,
      1,
      'content rendered exactly once',
    );
    assert.strictEqual(lifecycle.destroyed, 1, 'old instance destroyed');
    assert.strictEqual(lifecycle.created, 3, 'rebuilt in the target');
    assert
      .dom('[gs-id="a"] .inc')
      .hasText('2', 'state handed over via beforeRemove/droppedFrom');

    const saveA = A.save();
    const saveB = B.save();
    assert.deepEqual(saveA, []);
    assert.deepEqual(saveB.map((w) => [w.id, w.component]).sort(), [
      ['a', 'counter'],
      ['b', 'counter'],
    ]);

    await this.grid.destroy();
  });

  test('4: setupDragIn creates a widget from a spec', async function (assert) {
    await this.grid.render({
      template: (d) => <template>
        {{! template-lint-disable no-inline-styles }}
        {{#if d.visible}}
          <div style="width: 1000px">
            <div class="toolbox"><div
                class="item grid-stack-item"
                style="width: 80px; height: 40px"
              >
                <div class="grid-stack-item-content">note</div>
              </div></div>
            <GridStack
              @options={{hash acceptWidgets=true minRow=4}}
              @layout={{(array)}}
              @components={{components}}
            />
          </div>
        {{/if}}
      </template>,
    });
    find('.grid-stack').gridstack.constructor.setupDragIn(
      '.toolbox .item',
      { helper: 'clone' },
      [{ component: 'note', props: { text: 'dragged in' }, w: 2, h: 1 }],
    );
    const grid = find('.grid-stack');
    const r = grid.getBoundingClientRect();
    await dragOnto(find('.toolbox .item'), {
      getBoundingClientRect: () => ({
        left: r.left + r.width / 2,
        top: r.top + r.height / 4,
        width: 0,
        height: 0,
      }),
    });
    await settled();

    const api = grid._gridComp;
    const ids = api.instance.engine.nodes.map((n) => n.id);
    assert.strictEqual(ids.length, 1, 'one widget added');
    assert.ok(/^gs-ember-\d+$/.test(ids[0]), `synthetic id ${ids[0]}`);
    assert.dom('.grid-stack .grid-stack-item .note').hasText('dragged in');
    assert.strictEqual(api.save()[0].component, 'note');
    assert.deepEqual(api.save()[0].props, { text: 'dragged in' });

    await this.grid.destroy();
  });

  test('5: removable drops a widget in the trash', async function (assert) {
    const layout = [
      { id: 'a', x: 0, y: 0, w: 2, h: 1, component: 'counter' },
      { id: 'b', x: 2, y: 0, w: 2, h: 1, component: 'counter' },
    ];
    await this.grid.render({
      template: (d) => <template>
        {{! template-lint-disable no-inline-styles }}
        {{#if d.visible}}
          <div style="width: 1000px">
            <div id="trash" style="width: 200px; height: 100px">trash</div>
            <GridStack
              @options={{hash removable="#trash"}}
              @layout={{layout}}
              @components={{components}}
            />
          </div>
        {{/if}}
      </template>,
    });
    const api = find('.grid-stack')._gridComp;
    const itemEl = find('[gs-id="a"]');
    const content = itemEl.querySelector('.grid-stack-item-content');
    await dragOnto(itemEl, find('#trash'));
    await settled();

    assert.deepEqual(
      api.instance.engine.nodes.map((n) => n.id),
      ['b'],
    );
    assert.dom('[gs-id="a"]').doesNotExist('item element removed');
    assert.strictEqual(lifecycle.destroyed, 1, 'component willDestroy fired');
    assert.deepEqual(
      api.widgets.map((w) => w.id),
      ['b'],
      'record dropped',
    );
    assert.false(content.isConnected, 'content element detached');
    assert.strictEqual(
      content.childElementCount,
      0,
      'no rendered content left',
    );

    await this.grid.destroy();
  });
});
