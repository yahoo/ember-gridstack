import { module, test } from 'qunit';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import { hash } from '@ember/helper';
import { click, find, settled } from '@ember/test-helpers';
import GridStack from 'ember-gridstack/components/grid-stack';
import { setupGridTest } from '../../helpers/setup-grid-test';
import { pointerDrag } from '../../helpers/grid';

const lifecycle = { created: 0, destroyed: 0, seen: [], keep: true };

class Counter extends Component {
  @tracked count = 0;

  constructor() {
    super(...arguments);
    lifecycle.created++;
    const { widget } = this.args;
    lifecycle.seen.push(widget.droppedFrom);
    this.count = widget.droppedFrom?.state ?? 0;
    widget.beforeRemove(({ unstable_keep }) =>
      lifecycle.keep ? (unstable_keep?.() ?? this.count) : this.count,
    );
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

class Page {
  @tracked showLeft = true;
  @tracked visible = true;
}

module('Integration | Component | grid stack layout keep', function (hooks) {
  setupGridTest(hooks);

  hooks.beforeEach(async function () {
    Object.assign(lifecycle, {
      created: 0,
      destroyed: 0,
      seen: [],
      keep: true,
    });
    const left = [{ id: 'a', x: 0, y: 0, w: 2, h: 2, component: 'counter' }];
    const right = [{ id: 'b', x: 0, y: 0, w: 2, h: 2, component: 'counter' }];
    const page = (this.page = new Page());
    await this.grid.render({
      template: () => <template>
        {{! template-lint-disable no-inline-styles }}
        {{#if page.visible}}
          <div style="display: flex; width: 1000px">
            <div style="width: 500px">
              {{#if page.showLeft}}
                <GridStack
                  id="left"
                  @options={{hash acceptWidgets=true column=6 minRow=4}}
                  @layout={{left}}
                  @components={{components}}
                />
              {{/if}}
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
    this.A = find('#left')._gridComp;
    this.B = find('#right')._gridComp;
    await click('[gs-id="a"] .inc');
    await click('[gs-id="a"] .inc');
    this.itemEl = find('[gs-id="a"]');
    this.content = this.itemEl.querySelector('.grid-stack-item-content');
    this.drop = async () => {
      await dragTo(this.itemEl, emptyCell(find('#right')));
      await settled();
    };
    this.teardown = async () => {
      page.visible = false;
      await settled();
    };
  });

  test('unstable_keep keeps the component instance alive', async function (assert) {
    const { A, B, itemEl } = this;
    const before = lifecycle.created;
    const record = A.widgets.find((w) => w.id === 'a');
    await this.drop();

    assert.true(find('#right').contains(itemEl), 'element moved to B');
    assert.strictEqual(lifecycle.created, before, 'no new instance');
    assert.strictEqual(lifecycle.destroyed, 0);
    assert.dom('[gs-id="a"] .inc').hasText('2', '@tracked state kept');
    await click('[gs-id="a"] .inc');
    assert.dom('[gs-id="a"] .inc').hasText('3', 'still interactive');
    assert.strictEqual(record.grid, B, 'widget.grid switched to B');
    assert.strictEqual(record.droppedFrom, undefined);
    assert.deepEqual(A.save(), [], 'A.save() lacks it');
    assert.deepEqual(
      B.save()
        .map((w) => [w.id, w.props])
        .sort(),
      [
        ['a', { count: 3 }],
        ['b', { count: 0 }],
      ],
      'B.save() has it with serializer props',
    );
    assert.dom('[gs-id="a"] .inc').exists({ count: 1 }, 'rendered once');

    await this.teardown();
    assert.strictEqual(lifecycle.created, lifecycle.destroyed, 'no leaks');
  });

  test('destroying the source rebuilds a kept widget in the target', async function (assert) {
    const { A, B, content } = this;
    await this.drop();
    await click('[gs-id="a"] .inc');
    const empties = [];
    const observer = new MutationObserver(() => {
      if (content.childElementCount === 0) empties.push(true);
    });
    observer.observe(content, { childList: true, subtree: true });
    lifecycle.seen = [];

    this.page.showLeft = false;
    await settled();
    await Promise.resolve();
    observer.disconnect();

    assert.strictEqual(lifecycle.seen.length, 1, 'rebuilt once');
    assert.strictEqual(lifecycle.seen[0]?.grid, A.api, 'droppedFrom.grid');
    assert.strictEqual(lifecycle.seen[0]?.state, 3, 'droppedFrom.state');
    assert.deepEqual(empties, [], 'no empty frame');
    assert.dom('[gs-id="a"] .inc').exists({ count: 1 });
    assert.dom('[gs-id="a"] .inc').hasText('3');
    const record = B.widgets.find((w) => w.id === 'a');
    assert.strictEqual(record.grid, B);
    assert.deepEqual(
      B.save()
        .map((w) => [w.id, w.props])
        .sort(),
      [
        ['a', { count: 3 }],
        ['b', { count: 0 }],
      ],
    );

    await this.teardown();
    assert.strictEqual(lifecycle.created, lifecycle.destroyed, 'no leaks');
  });

  test('a kept widget dropped back home is owned by its source again', async function (assert) {
    const { A, B } = this;
    const before = lifecycle.created;
    await this.drop();
    await dragTo(this.itemEl, emptyCell(find('#left')));
    await settled();

    assert.true(find('#left').contains(this.itemEl));
    assert.strictEqual(lifecycle.created, before, 'same instance');
    assert.dom('[gs-id="a"] .inc').hasText('2');
    assert.deepEqual(
      A.save().map((w) => w.id),
      ['a'],
    );
    assert.deepEqual(
      B.save().map((w) => w.id),
      ['b'],
    );

    this.page.showLeft = false;
    await settled();
    assert.dom('[gs-id="a"]').doesNotExist();
    await this.teardown();
    assert.strictEqual(lifecycle.created, lifecycle.destroyed, 'no leaks');
  });

  test('without the opt-in the default rule applies', async function (assert) {
    lifecycle.keep = false;
    const before = lifecycle.created;
    lifecycle.seen = [];
    await this.drop();

    assert.strictEqual(lifecycle.created, before + 1, 'rebuilt');
    assert.strictEqual(lifecycle.seen[0]?.grid, this.A.api);
    assert.strictEqual(lifecycle.seen[0]?.state, 2);
    assert.dom('[gs-id="a"] .inc').hasText('2');
    await this.teardown();
    assert.strictEqual(lifecycle.created, lifecycle.destroyed, 'no leaks');
  });
});
