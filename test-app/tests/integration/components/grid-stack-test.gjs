import { action } from '@ember/object';
import { run, next } from '@ember/runloop';
import { fn } from '@ember/helper';
import { module, test } from 'qunit';
import { triggerEvent } from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import GridStack from 'ember-gridstack/components/grid-stack';
import GridStackItem from 'ember-gridstack/components/grid-stack-item';
import EventListener from 'test-app/components/event-listener';
import { setupGridTest } from '../../helpers/setup-grid-test';

const FOUR_ITEMS = [
  { id: 0, x: 0, y: 0, w: 5, h: 1 },
  { id: 1, x: 6, y: 0, w: 3, h: 1 },
  { id: 2, x: 0, y: 1, w: 4, h: 1 },
  { id: 3, x: 6, y: 1, w: 2, h: 1 },
];

const INITIALIZED =
  '.grid-stack .grid-stack-item > .ui-resizable-handle.ui-resizable-se';

module('Integration | Component | grid stack', function (hooks) {
  setupGridTest(hooks);

  test('gridstack renders', async function (assert) {
    await this.grid.render({
      template: () => <template>
        <GridStack class="test-grid">
          <div class="grid-stack-item" gs-x="0" gs-y="0" gs-w="1" gs-h="1">
            <div class="grid-stack-item-content">My Widget</div>
          </div>
        </GridStack>
      </template>,
    });

    assert
      .dom(`.test-grid${INITIALIZED}`)
      .exists(
        'Dom elements with grid-stack-item class are initialized by gridstack',
      );
  });

  test('gridstack with items', async function (assert) {
    await this.grid.render({
      items: [
        { id: 0, x: 0, y: 0 },
        { id: 1, x: 0, y: 1 },
      ],
    });

    assert
      .dom(INITIALIZED)
      .exists(
        { count: 2 },
        'initial grid-stack-item components are initialized by gridstack',
      );

    await this.grid.add({ id: 2, x: 0, y: 2 });

    assert
      .dom(INITIALIZED)
      .exists(
        { count: 3 },
        'new grid-stack-item components are initialized by gridstack when added through an each loop',
      );

    // Since each gridstack item has height = 1,
    // we can check how many items are recognized by using the row property
    assert
      .dom('.grid-stack')
      .hasAttribute('gs-current-row', '3', 'gridstack recognizes new items');

    await this.grid.remove(2);

    assert
      .dom('.grid-stack')
      .hasAttribute(
        'gs-current-row',
        '2',
        'gridstack updates its item count when one is removed through an each loop',
      );
    assert.inSync();
  });

  test('gridstack options', async function (assert) {
    // options are applied in place now, so skip the height transition
    await this.grid.render({
      options: { cellHeight: '200px', animate: false },
      items: [{ id: 'a', x: 0, y: 0, w: 1, h: 1 }],
    });

    assert.strictEqual(
      this.grid.el('a').clientHeight,
      200,
      'Cell height option is passed through to gridstack',
    );

    await this.grid.setOptions({ cellHeight: '300px' });

    assert.strictEqual(
      this.grid.el('a').clientHeight,
      300,
      'Gridstack updates with options',
    );

    await this.grid.setOptions({ staticGrid: true });

    assert
      .dom('.grid-stack-static .grid-stack-item')
      .hasClass(
        'ui-draggable-disabled',
        'staticGrid property can disable editing',
      );
    assert
      .dom('.grid-stack-static .grid-stack-item')
      .hasClass(
        'ui-resizable-disabled',
        'staticGrid property can disable editing',
      );
  });

  test('grid stack item events', async function (assert) {
    const done = assert.async();
    assert.expect(1);

    let containerComponent;
    const init = (item) => (containerComponent = item);

    await this.grid.render({
      template: () => <template>
        <GridStack>
          <GridStackItem as |item|>
            <EventListener @init={{fn init item}} />
          </GridStackItem>
          <div class="a-different-item" />
        </GridStack>
      </template>,
    });

    // item.element is set once the item is inserted
    containerComponent.element.addEventListener('resizestop', () => {
      assert.ok(true, 'resize action is called when item is resized');
      done();
    });

    next(async () => {
      await triggerEvent('.grid-stack-item', 'resizestop');
    });

    // Check that the action is not called when a different item is resized
    run(async () => {
      await triggerEvent('.a-different-item', 'resizestop');
    });
  });

  test('onChange, onAdded, onRemove actions', async function (assert) {
    /* == no handlers: changes must not throw == */
    await this.grid.render({
      template: (d) => <template>
        <GridStack>
          {{#each d.items key="id" as |item|}}
            <GridStackItem @options={{item.options}}>
              {{item.id}}
            </GridStackItem>
          {{/each}}
        </GridStack>
      </template>,
      items: [{ id: 1, x: 0, y: 1, h: 1 }],
    });
    await this.grid.add({ id: 2, x: 0, y: 2, h: 1 });

    /* == with handlers == */
    await this.grid.render({ items: [{ id: 1, x: 0, y: 1 }] });

    await this.grid.add({ id: 2, x: 0, y: 2 });
    // this will trigger onChange in addition to onAdded as
    // the existing item at y=2 will be moved by gridstack
    await this.grid.add({ id: '2b', x: 0, y: 2 });
    await this.grid.setItems(this.grid.items.filter((i) => i.id === '1'));

    assert.events(['added', 'removed', 'change']);
    assert.strictEqual(this.events.length, 4, 'added twice');
    this.events.forEach(({ name, args: [event, items] }) => {
      assert.strictEqual(
        event.type,
        name,
        `\`${name}\` handler provides the \`event\` argument`,
      );
      assert.true(
        Array.isArray(items),
        `\`${name}\` handler provides the \`items\` argument`,
      );
    });
  });

  test('gridstack items with noMove/Resize', async function (assert) {
    await this.grid.render({
      items: [{ id: 'a', x: 0, y: 0, noMove: true, noResize: true }],
    });

    assert.deepEqual(
      [...this.grid.el('a').classList],
      ['grid-stack-item', 'ui-draggable-disabled', 'ui-resizable-disabled'],
      'grid-stack-item noResize and noMove properties are applied',
    );
  });

  test('gridstack is notified when items properties change', async function (assert) {
    assert.expect(2);

    class State {
      @tracked onChange = () => assert.ok(true, '`onChange` was called');
    }
    const state = new State();

    await this.grid.render({
      template: (d) => <template>
        <GridStack @onChange={{state.onChange}}>
          {{#each d.items key="id" as |item|}}
            <GridStackItem data-id={{item.id}} @options={{item.options}}>
              Test
            </GridStackItem>
          {{/each}}
        </GridStack>
      </template>,
      items: [{ id: 'a', w: 6 }],
    });

    await this.grid.update('a', { w: 12 });

    class GlimmerActionListener {
      @action
      onChange() {
        assert.ok(true, '`onChange` was called from glimmer action');
      }
    }
    const listener = new GlimmerActionListener();
    state.onChange = listener.onChange;

    await this.grid.update('a', { w: 10 });
  });

  test('gridstack updates the layout when items properties change', async function (assert) {
    await this.grid.render({ items: FOUR_ITEMS });

    assert.layout(
      {
        0: { x: 0, y: 0 },
        1: { x: 6, y: 0 },
        2: { x: 0, y: 1 },
        3: { x: 6, y: 1 },
      },
      'Initial grid-stack-item layout is correct',
    );

    await this.grid.update(1, { x: 2, y: 1, w: 12, h: 1 });

    assert.layout(
      { 0: { x: 0, y: 0 } },
      'Updating a grid-stack-item leaves unaffected items the same',
    );
    assert.layout(
      { 1: { x: 0, y: 1 } },
      'Updating a grid-stack-item moves the item',
    );
    assert.layout(
      { 2: { x: 0, y: 2 }, 3: { x: 6, y: 2 } },
      'Updating a grid-stack-item moves conflicting items to a different row',
    );
    assert.inSync();
  });

  test('do not fire `onChange` or `onRemoved` during teardown', async function (assert) {
    await this.grid.render({ items: FOUR_ITEMS });

    await this.grid.destroy();
    assert.deepEqual(this.events.names(), [], 'no events on teardown');
  });

  module('operations', function () {
    const OPS = {
      add: (grid) => grid.add({ id: 'new', x: 0, y: 0, w: 2, h: 1 }),
      remove: (grid) => grid.remove('b'),
      move: (grid) => grid.move('a', { x: 4, y: 3 }),
      drag: (grid) => grid.dragTo('a', { x: 4, y: 3 }),
    };
    const cases = {};
    for (const mode of ['float', 'list', 'compact']) {
      for (const op of Object.keys(OPS)) {
        cases[`${mode} ${op}`] = { mode, op };
      }
    }

    test.each('stays in sync', cases, async function (assert, { mode, op }) {
      await this.grid.render({
        options: { cellHeight: 50, column: 12, mode },
        items: [
          { id: 'a', x: 0, y: 0, w: 2, h: 1 },
          { id: 'b', x: 0, y: 1, w: 2, h: 1 },
          { id: 'c', x: 0, y: 2, w: 2, h: 1 },
        ],
      });
      await OPS[op](this.grid);
      assert.inSync();
    });
  });
});
