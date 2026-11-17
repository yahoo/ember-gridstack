import { module, test } from 'qunit';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import { hash } from '@ember/helper';
import { click, find, settled } from '@ember/test-helpers';
import GridStack from 'ember-gridstack/components/grid-stack';
import { setupGridTest } from '../../helpers/setup-grid-test';
import { pointerDrag } from '../../helpers/grid';

const lifecycle = { created: 0, destroyed: 0, seen: [] };

class Counter extends Component {
  @tracked count = 0;

  constructor() {
    super(...arguments);
    lifecycle.created++;
    const { widget } = this.args;
    lifecycle.seen.push(widget.droppedFrom);
    this.count = widget.droppedFrom?.state?.n ?? 0;
    widget.beforeRemove(() => ({ n: this.count }));
    widget.registerSerializer(() => ({ count: this.count }));
  }

  willDestroy() {
    super.willDestroy(...arguments);
    lifecycle.destroyed++;
  }

  inc = () => this.count++;

  <template>
    <button type="button" class="inc" {{on "click" this.inc}}>
      {{this.count}}
    </button>
  </template>
}

const components = { counter: Counter };

/** Drags `itemEl` from its top-left corner onto the point (x, y). */
const dragTo = (itemEl, { x, y }) => {
  const r = itemEl
    .querySelector('.grid-stack-item-content')
    .getBoundingClientRect();
  return pointerDrag(itemEl, x - (r.left + 10), y - (r.top + 10), 16);
};

const emptyCell = (gridEl) => {
  const r = gridEl.getBoundingClientRect();
  return { x: r.left + r.width * 0.6, y: r.top + r.height * 0.6 };
};

const live = () => document.querySelectorAll('#ember-testing .inc').length;

module('Integration | Component | grid stack layout drop', function (hooks) {
  setupGridTest(hooks);

  hooks.beforeEach(function () {
    lifecycle.created = lifecycle.destroyed = 0;
    lifecycle.seen = [];
  });

  test('a cross-grid drop rebuilds the widget in the target', async function (assert) {
    const left = [{ id: 'a', x: 0, y: 0, w: 2, h: 2, component: 'counter' }];
    const right = [{ id: 'b', x: 0, y: 0, w: 2, h: 2, component: 'counter' }];
    const dropped = [];
    const removedA = [];
    const onDropped = (event, prev, next) => dropped.push({ prev, next });
    const onRemovedA = (event, nodes) => removedA.push(nodes.map((n) => n.id));
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
                @onDropped={{onDropped}}
                @onRemoved={{onRemovedA}}
              />
            </div>
            <div style="width: 500px">
              <GridStack
                id="right"
                @options={{hash acceptWidgets=true column=6 minRow=4}}
                @layout={{right}}
                @components={{components}}
                @onDropped={{onDropped}}
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

    const itemEl = find('[gs-id="a"]');
    const content = itemEl.querySelector('.grid-stack-item-content');
    const empties = [];
    const observer = new MutationObserver(() => {
      if (content.childElementCount === 0) empties.push(true);
    });
    observer.observe(content, { childList: true, subtree: true });

    lifecycle.seen = [];
    await dragTo(itemEl, emptyCell(find('#right')));
    await settled();
    await Promise.resolve();

    assert.true(find('#right').contains(itemEl), 'element moved to B');
    assert.deepEqual(empties, [], 'content never empty after the drop');
    assert.deepEqual(
      A.widgets.map((w) => w.id),
      [],
    );
    assert.deepEqual(B.widgets.map((w) => w.id).sort(), ['a', 'b']);
    assert.strictEqual(lifecycle.seen.length, 1, 'rebuilt once');
    assert.strictEqual(lifecycle.seen[0]?.grid, A.api, 'droppedFrom.grid');
    assert.deepEqual(lifecycle.seen[0]?.state, { n: 2 }, 'droppedFrom.state');
    assert.dom('[gs-id="a"] .inc').hasText('2', 'state restored');
    const record = B.widgets.find((w) => w.id === 'a');
    assert.strictEqual(record.droppedFrom, undefined, 'cleared after render');
    assert.strictEqual(record.grid, B);
    assert.strictEqual(itemEl._gridItemRef.gridComp, B);

    assert.strictEqual(dropped.length, 1);
    assert.strictEqual(dropped[0].prev?.grid, A.instance, 'previousNode.grid');
    assert.strictEqual(dropped[0].next?.grid, B.instance, 'newNode.grid');
    assert.deepEqual(removedA, [['a']], "A's @onRemoved");

    assert.deepEqual(A.save(), []);
    assert.deepEqual(
      B.save()
        .map((w) => [w.id, w.component, w.props])
        .sort(),
      [
        ['a', 'counter', { count: 2 }],
        ['b', 'counter', { count: 0 }],
      ],
    );
    assert.strictEqual(
      lifecycle.created,
      lifecycle.destroyed + live(),
      'created === destroyed + live',
    );

    // and back again
    await click('[gs-id="a"] .inc');
    lifecycle.seen = [];
    await dragTo(itemEl, emptyCell(find('#left')));
    await settled();
    await Promise.resolve();
    observer.disconnect();

    assert.true(find('#left').contains(itemEl), 'element back in A');
    assert.deepEqual(empties, [], 'content never empty after the drop back');
    assert.strictEqual(lifecycle.seen[0]?.grid, B.api);
    assert.deepEqual(lifecycle.seen[0]?.state, { n: 3 });
    assert.deepEqual(
      A.save().map((w) => [w.id, w.props]),
      [['a', { count: 3 }]],
    );
    assert.deepEqual(
      B.save().map((w) => w.id),
      ['b'],
    );
    assert.strictEqual(dropped[1].prev?.grid, B.instance);
    assert.strictEqual(
      lifecycle.created,
      lifecycle.destroyed + live(),
      'created === destroyed + live',
    );

    await this.grid.destroy();
    assert.strictEqual(lifecycle.created, lifecycle.destroyed, 'no leaks');
  });

  test('save() never writes beforeRemove or droppedFrom', async function (assert) {
    const left = [
      { id: 'a', x: 0, y: 0, w: 2, h: 2, component: 'counter', props: {} },
    ];
    await this.grid.render({
      template: (d) => <template>
        {{#if d.visible}}
          <GridStack @layout={{left}} @components={{components}} />
        {{/if}}
      </template>,
    });
    const json = JSON.stringify(find('.grid-stack')._gridComp.save());
    assert.notOk(json.includes('beforeRemove'), json);
    assert.notOk(json.includes('droppedFrom'), json);
    assert.notOk(json.includes('serializers'), json);
    await this.grid.destroy();
  });
});
