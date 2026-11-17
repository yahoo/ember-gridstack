import { module, test } from 'qunit';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import { array, hash } from '@ember/helper';
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

const fire = (target, type, x, y) =>
  target.dispatchEvent(
    new MouseEvent(type, {
      bubbles: true,
      cancelable: true,
      view: window,
      button: 0,
      buttons: type === 'mouseup' ? 0 : 1,
      clientX: x,
      clientY: y,
    }),
  );

/** Drags `itemEl` by its handle so its centre lands on `targetEl`'s centre; returns whether `targetEl` had `ui-droppable-over` before mouseup. */
const dragOnto = async (itemEl, targetEl) => {
  const handle = itemEl.querySelector('.grid-stack-item-content');
  const r = handle.getBoundingClientRect();
  const t = targetEl.getBoundingClientRect();
  const x0 = r.left + 10;
  const y0 = r.top + 10;
  const dx = t.left + t.width / 2 - (r.left + r.width / 2);
  const dy = t.top + t.height / 2 - (r.top + r.height / 2);
  fire(handle, 'mousedown', x0, y0);
  fire(document, 'mousemove', x0 + Math.sign(dx) * 4, y0 + Math.sign(dy) * 4);
  for (let i = 1; i <= 16; i++) {
    fire(document, 'mousemove', x0 + (dx * i) / 16, y0 + (dy * i) / 16);
  }
  const over = targetEl.classList.contains('ui-droppable-over');
  fire(document, 'mouseup', x0 + dx, y0 + dy);
  await settled();
  return over;
};

const DEMO = {
  acceptWidgets: true,
  removable: '.data-mode-trash',
  cellHeight: 60,
  margin: 6,
  column: 4,
  minRow: 3,
};

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

  test('drag-in from a toolbox renders a new widget', async function (assert) {
    const dropped = [];
    const seen = [];
    const see = (from) => void seen.push(from);
    const Note = <template>
      {{see @widget.droppedFrom}}
      <i class="note">{{@props.text}}</i>
    </template>;
    const noteComponents = { note: Note };
    const onDropped = (event, prev, next) => dropped.push({ prev, next });
    await this.grid.render({
      template: (d) => <template>
        {{! template-lint-disable no-inline-styles }}
        {{#if d.visible}}
          <div style="width: 1000px">
            <div class="toolbox"><div
                class="item grid-stack-item"
                style="width: 80px; height: 40px"
              ><div class="grid-stack-item-content">note</div></div></div>
            <GridStack
              @options={{hash acceptWidgets=true minRow=4}}
              @layout={{(array)}}
              @components={{noteComponents}}
              @onDropped={{onDropped}}
            />
          </div>
        {{/if}}
      </template>,
    });
    find('.grid-stack').gridstack.constructor.setupDragIn(
      '.toolbox .item',
      undefined,
      [{ w: 2, h: 2, component: 'note', props: { text: 'x' } }],
    );
    const grid = find('.grid-stack');
    const r = grid.getBoundingClientRect();
    await dragTo(find('.toolbox .item'), {
      x: r.left + r.width / 2,
      y: r.top + r.height / 4,
    });
    await settled();

    assert.dom('.grid-stack .grid-stack-item .note').hasText('x');
    assert.strictEqual(dropped.length, 1);
    assert.strictEqual(dropped[0].prev, undefined, 'previousNode undefined');
    assert.deepEqual(seen, [undefined], 'droppedFrom undefined');
    assert.dom('.toolbox .item').exists('toolbox item stays');
    await this.grid.destroy();
  });

  test('dropping on the trash destroys the component', async function (assert) {
    const layout = [{ id: 'a', x: 0, y: 0, w: 2, h: 1, component: 'counter' }];
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
    const itemEl = find('[gs-id="a"]');
    const t = find('#trash').getBoundingClientRect();
    await dragTo(itemEl, { x: t.left + t.width / 2, y: t.top + t.height / 2 });
    await settled();

    assert.strictEqual(lifecycle.destroyed, 1, 'willDestroy ran');
    assert.dom('[gs-id="a"]').doesNotExist();
    assert.dom('.inc').doesNotExist('nothing left in the DOM');
    assert.false(itemEl.isConnected);
    await this.grid.destroy();
  });

  for (const side of ['left', 'right']) {
    test(`demo geometry: a ${side} data item is trashed on the shared trash`, async function (assert) {
      const left = [
        { id: 'a', x: 0, y: 0, w: 2, h: 2, component: 'counter' },
        { id: 'c', x: 2, y: 0, w: 2, h: 2, component: 'counter' },
      ];
      const right = [{ id: 'b', x: 0, y: 0, w: 2, h: 2, component: 'counter' }];
      const onDropped = () => {};
      await this.grid.render({
        template: (d) => <template>
          {{! template-lint-disable no-inline-styles }}
          {{#if d.visible}}
            <div style="width: 1000px">
              <div class="data-mode-grids">
                <GridStack
                  class="data-mode-grid"
                  id="left"
                  @options={{DEMO}}
                  @layout={{left}}
                  @components={{components}}
                  @onDropped={{onDropped}}
                />
                <GridStack
                  class="data-mode-grid"
                  id="right"
                  @options={{DEMO}}
                  @layout={{right}}
                  @components={{components}}
                  @onDropped={{onDropped}}
                />
              </div>
              <div class="data-mode-tools">
                <div class="data-mode-trash">Drop to delete</div>
              </div>
            </div>
          {{/if}}
        </template>,
      });
      const id = side === 'left' ? 'a' : 'b';
      const itemEl = find(`[gs-id="${id}"]`);
      const over = await dragOnto(itemEl, find('.data-mode-trash'));
      assert.true(over, 'trash is highlighted during the drag');
      assert.dom(`[gs-id="${id}"]`).doesNotExist();
      assert.false(itemEl.isConnected);
      assert.strictEqual(lifecycle.destroyed, 1, 'willDestroy ran');
      assert.strictEqual(live(), 2);
      await this.grid.destroy();
    });
  }

  test('demo geometry: data and template grids each with a trash', async function (assert) {
    const left = [
      { id: 'a', x: 0, y: 0, w: 2, h: 2, component: 'counter' },
      { id: 'c', x: 2, y: 0, w: 2, h: 2, component: 'counter' },
    ];
    const right = [{ id: 'b', x: 0, y: 0, w: 2, h: 2, component: 'counter' }];
    const tmplOpts = { ...DEMO, removable: '.template-drops-trash' };
    const tmplItem = { id: 't', x: 0, y: 0, w: 2, h: 2 };
    const onDropped = () => {};
    const removed = [];
    const onRemoved = (e, nodes) => removed.push(...nodes.map((n) => n.id));
    await this.grid.render({
      template: (d) => <template>
        {{! template-lint-disable no-inline-styles }}
        {{#if d.visible}}
          <div style="width: 1000px">
            <div class="data-mode-grids">
              <GridStack
                class="data-mode-grid"
                @options={{DEMO}}
                @layout={{left}}
                @components={{components}}
                @onDropped={{onDropped}}
              />
              <GridStack
                class="data-mode-grid"
                @options={{DEMO}}
                @layout={{right}}
                @components={{components}}
                @onDropped={{onDropped}}
              />
            </div>
            <div class="data-mode-tools">
              <div class="data-mode-trash">Drop to delete</div>
            </div>
            <GridStack
              class="data-mode-grid"
              id="tmpl"
              @options={{tmplOpts}}
              @onRemoved={{onRemoved}}
              as |grid|
            >
              <grid.Item data-id="t" @options={{tmplItem}}>t</grid.Item>
            </GridStack>
            <div class="data-mode-tools">
              <div class="template-drops-trash">Drop to delete</div>
            </div>
          </div>
        {{/if}}
      </template>,
    });
    assert.true(
      await dragOnto(find('[gs-id="a"]'), find('.data-mode-trash')),
      'data trash over',
    );
    assert.dom('[gs-id="a"]').doesNotExist();
    assert.true(
      await dragOnto(find('[gs-id="b"]'), find('.template-drops-trash')),
      'template trash over for a data item',
    );
    assert.dom('[gs-id="b"]').doesNotExist();
    assert.true(
      await dragOnto(find('[data-id="t"]'), find('.template-drops-trash')),
      'template trash over for a template item',
    );
    assert.deepEqual(removed, ['t'], 'template grid reports the removal');
    assert.strictEqual(lifecycle.destroyed, 2);
    await this.grid.destroy();
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
