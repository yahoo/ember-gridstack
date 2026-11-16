import { action } from '@ember/object';
import { run, next } from '@ember/runloop';
import { isArray } from '@ember/array';
import { fn, hash } from '@ember/helper';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerEvent, settled, find } from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import GridStack from 'ember-gridstack/components/grid-stack';
import GridStackItem from 'ember-gridstack/components/grid-stack-item';
import EventListener from 'test-app/components/event-listener';

/**
 * Read an item's gs-x/gs-y position. Older gridstack 12.x releases omit the attribute
 * for a 0 position, newer releases always write it (gridstack#3181).
 */
function gsPos(selector, attr) {
  return Number(find(selector).getAttribute(attr) ?? 0);
}

const camelize = (str) => str.replace(/-(\w)/g, (_, c) => c.toUpperCase());

class State {
  @tracked items = [];
  @tracked options;
  @tracked onChange;
  @tracked onAdded;
  @tracked onRemoved;
  @tracked shouldRender = true;
}

class Item {
  @tracked options;

  constructor(id, options) {
    this.id = id;
    this.options = options;
  }
}

module('Integration | Component | grid stack', function (hooks) {
  setupRenderingTest(hooks);

  test('gridstack renders', async function (assert) {
    assert.expect(1);

    await render(
      <template>
        <GridStack class="test-grid">
          <div class="grid-stack-item" gs-x="0" gs-y="0" gs-w="1" gs-h="1">
            <div class="grid-stack-item-content">My Widget</div>
          </div>
        </GridStack>
      </template>,
    );

    assert
      .dom(
        '.test-grid.grid-stack .grid-stack-item > .ui-resizable-handle.ui-resizable-se',
      )
      .exists(
        'Dom elements with grid-stack-item class are initialized by gridstack',
      );
  });

  test('gridstack with items', async function (assert) {
    assert.expect(4);

    const state = new State();
    state.items = [0, 1];

    await render(
      <template>
        <GridStack>
          {{#each state.items as |item|}}
            <GridStackItem @options={{hash x=0 y=item}}>
              {{item}}
            </GridStackItem>
          {{/each}}
        </GridStack>
      </template>,
    );

    assert
      .dom(
        '.grid-stack .grid-stack-item > .ui-resizable-handle.ui-resizable-se',
      )
      .exists(
        { count: 2 },
        'initial grid-stack-item components are initialized by gridstack',
      );

    state.items = [...state.items, 2];
    await settled();

    assert
      .dom(
        '.grid-stack .grid-stack-item > .ui-resizable-handle.ui-resizable-se',
      )
      .exists(
        { count: 3 },
        'new grid-stack-item components are initialized by gridstack when added through an each loop',
      );

    // Since each gridstack item has height = 1,
    // we can check how many items are recognized by using the row property
    assert
      .dom('.grid-stack')
      .hasAttribute('gs-current-row', '3', 'gridstack recognizes new items');

    state.items = state.items.slice(0, -1);
    await settled();

    assert
      .dom('.grid-stack')
      .hasAttribute(
        'gs-current-row',
        '2',
        'gridstack updates its item count when one is removed through an each loop',
      );
  });

  test('gridstack options', async function (assert) {
    assert.expect(4);

    const state = new State();
    state.options = { cellHeight: '200px' };

    await render(
      <template>
        <GridStack @options={{state.options}}>
          <div class="grid-stack-item" gs-x="0" gs-y="0" gs-w="1" gs-h="1">
            <div class="grid-stack-item-content">My Widget</div>
          </div>
        </GridStack>
      </template>,
    );

    assert.strictEqual(
      this.element.querySelector('.grid-stack-item').clientHeight,
      200,
      'Cell height option is passed through to gridstack',
    );

    state.options = { cellHeight: '300px' };
    await settled();

    assert.strictEqual(
      this.element.querySelector('.grid-stack-item').clientHeight,
      300,
      'Gridstack updates with options',
    );

    state.options = { cellHeight: '300px', staticGrid: true };
    await settled();

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

    // Create fake component for listening to events
    const init = (containerComponent) => {
      containerComponent.element.addEventListener('resizestop', () => {
        assert.ok(true, 'resize action is called when item is resized');
        done();
      });
    };

    await render(
      <template>
        <GridStack>
          <GridStackItem as |item|>
            <EventListener @init={{fn init item}} />
          </GridStackItem>
          <div class="a-different-item" />
        </GridStack>
      </template>,
    );

    next(async () => {
      await triggerEvent('.grid-stack-item', 'resizestop');
    });

    // Check that the action is not called when a different item is resized
    run(async () => {
      await triggerEvent('.a-different-item', 'resizestop');
    });
  });

  test('onChange, onAdded, onRemove actions', async function (assert) {
    assert.expect(12);

    const state = new State();
    state.items = [1];

    /* == Test event handlers when respective attrs not provided == */

    await render(
      <template>
        <GridStack>
          {{#each state.items as |item|}}
            <GridStackItem @options={{hash x=0 y=item h=1}}>
              {{item}}
            </GridStackItem>
          {{/each}}
        </GridStack>
      </template>,
    );

    state.items = [...state.items, 2];
    await settled();

    /* == Test event handler when respective attrs provided == */

    state.items = [1];

    const events = ['change', 'added', 'removed'];

    events.forEach((e) => {
      let onAttr = camelize(`on-${e}`);
      state[onAttr] = (event, items) => {
        const ids = items.map((i) => i.y).join(',');
        assert.ok(
          true,
          `\`${onAttr}\` fires for [${ids}] when gridstack \`${e}\` event fires`,
        );

        assert.strictEqual(
          event.type,
          e,
          `\`${onAttr}\` action provides the \`event\` argument`,
        );

        assert.ok(
          isArray(items),
          `\`${onAttr}\` action provides the \`items\` argument`,
        );
      };
    });

    await render(
      <template>
        <GridStack
          @onChange={{state.onChange}}
          @onAdded={{state.onAdded}}
          @onRemoved={{state.onRemoved}}
        >
          {{#each state.items as |item|}}
            <GridStackItem @options={{hash x=0 y=item}}>
              {{item}}
            </GridStackItem>
          {{/each}}
        </GridStack>
      </template>,
    );

    //Update gridstack
    state.items = [...state.items, 2];
    await settled();

    // this will trigger onChange in addition to onAdded as
    // the existing item at y=2 will be moved by gridstack
    state.items = [...state.items, 2];
    await settled();

    state.items = state.items.filter((i) => i !== 2);
    await settled();
  });

  test('gridstack items with noMove/Resize', async function (assert) {
    await render(
      <template>
        <GridStack>
          <GridStackItem @options={{hash x=0 y=0 noMove=true noResize=true}}>
            Test widget
          </GridStackItem>
        </GridStack>
      </template>,
    );

    assert.deepEqual(
      [...find('.grid-stack-item').classList],
      ['grid-stack-item', 'ui-draggable-disabled', 'ui-resizable-disabled'],
      'grid-stack-item noResize and noMove properties are applied',
    );
  });

  test('gridstack is notified when items properties change', async function (assert) {
    assert.expect(2);

    const state = new State();
    state.onChange = () => assert.ok(true, '`onChange` was called');
    state.options = { w: 6 };

    await render(
      <template>
        <GridStack @onChange={{state.onChange}}>
          <GridStackItem @options={{state.options}}>
            Test
          </GridStackItem>
        </GridStack>
      </template>,
    );

    state.options = { w: 12 };
    await settled();

    class GlimmerActionListener {
      @action
      onChange() {
        assert.ok(true, '`onChange` was called from glimmer action');
      }
    }
    const listener = new GlimmerActionListener();
    state.onChange = listener.onChange;

    state.options = { w: 10 };
    await settled();
  });

  test('gridstack updates the layout when items properties change', async function (assert) {
    assert.expect(16);
    const state = new State();
    state.items = [
      new Item(0, { x: 0, y: 0, w: 5, h: 1 }),
      new Item(1, { x: 6, y: 0, w: 3, h: 1 }),
      new Item(2, { x: 0, y: 1, w: 4, h: 1 }),
      new Item(3, { x: 6, y: 1, w: 2, h: 1 }),
    ];

    await render(
      <template>
        <GridStack>
          {{#each state.items as |item|}}
            <GridStackItem data-id={{item.id}} @options={{item.options}}>
              {{item.id}}
            </GridStackItem>
          {{/each}}
        </GridStack>
      </template>,
    );

    state.items.forEach(({ id, options }) => {
      assert.strictEqual(
        gsPos(`[data-id="${id}"]`, 'gs-x'),
        options.x,
        'Initial grid-stack-item layout is correct',
      );
      assert.strictEqual(
        gsPos(`[data-id="${id}"]`, 'gs-y'),
        options.y,
        'Initial grid-stack-item layout is correct',
      );
    });

    // Update the position of item 1
    state.items[1].options = { x: 2, y: 1, w: 12, h: 1 };
    await settled();

    assert.strictEqual(
      gsPos(`[data-id="0"]`, 'gs-x'),
      0,
      'Updating a grid-stack-item leaves unaffected items the same',
    );
    assert.strictEqual(
      gsPos(`[data-id="0"]`, 'gs-y'),
      0,
      'Updating a grid-stack-item leaves unaffected items the same',
    );

    assert.strictEqual(
      gsPos(`[data-id="1"]`, 'gs-x'),
      0,
      'Updating a grid-stack-item updates moves the item',
    );
    assert
      .dom(`[data-id="1"]`)
      .hasAttribute(
        'gs-y',
        '1',
        'Updating a grid-stack-item updates moves the item',
      );

    assert.strictEqual(
      gsPos(`[data-id="2"]`, 'gs-x'),
      0,
      'Updating a grid-stack-item moves conflicting items to a different row',
    );
    assert
      .dom(`[data-id="2"]`)
      .hasAttribute(
        'gs-y',
        '2',
        'Updating a grid-stack-item moves conflicting items to a different row',
      );

    assert
      .dom(`[data-id="3"]`)
      .hasAttribute(
        'gs-x',
        '6',
        'Updating a grid-stack-item moves conflicting items to a different row',
      );
    assert
      .dom(`[data-id="3"]`)
      .hasAttribute(
        'gs-y',
        '2',
        'Updating a grid-stack-item moves conflicting items to a different row',
      );
  });

  test('do not fire `onChange` or `onRemoved` during teardown', async function (assert) {
    assert.expect(1);

    const state = new State();
    state.shouldRender = true;
    state.items = [
      new Item(0, { x: 0, y: 0, w: 5, h: 1 }),
      new Item(1, { x: 6, y: 0, w: 3, h: 1 }),
      new Item(2, { x: 0, y: 1, w: 4, h: 1 }),
      new Item(3, { x: 6, y: 1, w: 2, h: 1 }),
    ];

    state.onChange = () =>
      assert.notOk(true, '`onChange` should not fire on teardown');
    state.onRemoved = () =>
      assert.notOk(true, '`onRemoved` should not fire on teardown');

    await render(
      <template>
        {{#if state.shouldRender}}
          <GridStack
            @onChange={{state.onChange}}
            @onRemoved={{state.onRemoved}}
          >
            {{#each state.items as |item|}}
              <GridStackItem data-id={{item.id}} @options={{item.options}}>
                {{item.id}}
              </GridStackItem>
            {{/each}}
          </GridStack>
        {{/if}}
      </template>,
    );

    state.shouldRender = false;
    await settled();
    assert.ok(true, 'all is good');
  });
});
