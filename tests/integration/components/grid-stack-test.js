import { action } from '@ember/object';
import { run, next } from '@ember/runloop';
import { A, isArray } from '@ember/array';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerEvent, settled, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { camelize } from '@ember/string';

module('Integration | Component | grid stack', function (hooks) {
  setupRenderingTest(hooks);

  test('gridstack renders', async function (assert) {
    assert.expect(1);

    await render(hbs`
      <GridStack class="test-grid">
        <div class="grid-stack-item" gs-x="0" gs-y="0" gs-w="1" gs-h="1">
          <div class="grid-stack-item-content">My Widget</div>
        </div>
      </GridStack>
    `);

    assert
      .dom('.test-grid.grid-stack .grid-stack-item > .ui-resizable-handle.ui-resizable-se')
      .exists('Dom elements with grid-stack-item class are initialized by gridstack');
  });

  test('gridstack with items', async function (assert) {
    assert.expect(4);

    this.set('items', A([0, 1]));

    await render(hbs`
      <GridStack>
        {{#each this.items as |item|}}
          <GridStackItem @options={{hash x=0 y=item}}>
            {{item}}
          </GridStackItem>
        {{/each}}
      </GridStack>
    `);

    assert
      .dom('.grid-stack .grid-stack-item > .ui-resizable-handle.ui-resizable-se')
      .exists({ count: 2 }, 'initial grid-stack-item components are initialized by gridstack');

    run(() => {
      this.items.pushObject(2);
    });

    assert
      .dom('.grid-stack .grid-stack-item > .ui-resizable-handle.ui-resizable-se')
      .exists(
        { count: 3 },
        'new grid-stack-item components are initialized by gridstack when added through an each loop'
      );

    // Since each gridstack item has height = 1,
    // we can check how many items are recognized by using the row property
    assert.dom('.grid-stack').hasAttribute('gs-current-row', '3', 'gridstack recognizes new items');

    run(() => {
      this.items.popObject();
    });

    assert
      .dom('.grid-stack')
      .hasAttribute('gs-current-row', '2', 'gridstack updates its item count when one is removed through an each loop');
  });

  test('gridstack options', async function (assert) {
    assert.expect(4);

    this.set('options', {
      cellHeight: '200px',
    });

    await render(hbs`
      <GridStack @options={{this.options}}>
        <div class="grid-stack-item" gs-x="0" gs-y="0" gs-w="1" gs-h="1">
          <div class="grid-stack-item-content">My Widget</div>
        </div>
      </GridStack>
    `);

    assert.strictEqual(
      this.element.querySelector('.grid-stack-item').clientHeight,
      200,
      'Cell height option is passed through to gridstack'
    );

    this.set('options', {
      cellHeight: '300px',
    });

    assert.strictEqual(
      this.element.querySelector('.grid-stack-item').clientHeight,
      300,
      'Gridstack updates with options'
    );

    this.set('options', {
      cellHeight: '300px',
      staticGrid: true,
    });

    assert
      .dom('.grid-stack-static .grid-stack-item')
      .hasClass('ui-draggable-disabled', 'staticGrid property can disable editing');
    assert
      .dom('.grid-stack-static .grid-stack-item')
      .hasClass('ui-resizable-disabled', 'staticGrid property can disable editing');
  });

  test('grid stack item events', async function (assert) {
    const done = assert.async();
    assert.expect(1);

    // Create fake component for listening to events
    this.init = (containerComponent) => {
      containerComponent.element.addEventListener('resizestop', () => {
        assert.ok(true, 'resize action is called when item is resized');
        done();
      });
    };

    await render(hbs`
      <GridStack>
        <GridStackItem as |item|>
          <EventListener @init={{fn this.init item}}/>
        </GridStackItem>
        <div class="a-different-item" />
      </GridStack>
    `);

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

    this.set('items', A([1]));

    /* == Test event handlers when respective attrs not provided == */

    await render(hbs`
      <GridStack>
        {{#each this.items as |item|}}
          <GridStackItem @options={{hash x=0 y=item h=1}}>
            {{item}}
          </GridStackItem>
        {{/each}}
      </GridStack>
    `);

    run(() => this.items.pushObject(2));

    /* == Test event handler when respective attrs provided == */

    this.set('items', A([1]));

    const events = ['change', 'added', 'removed'];

    events.forEach((e) => {
      let onAttr = camelize(`on-${e}`);
      this.set(onAttr, (event, items) => {
        const ids = items.map((i) => i.y).join(',');
        assert.ok(true, `\`${onAttr}\` fires for [${ids}] when gridstack \`${e}\` event fires`);

        assert.strictEqual(event.type, e, `\`${onAttr}\` action provides the \`event\` argument`);

        assert.ok(isArray(items), `\`${onAttr}\` action provides the \`items\` argument`);
      });
    });

    await render(hbs`
      <GridStack
        @onChange={{this.onChange}}
        @onAdded={{this.onAdded}}
        @onRemoved={{this.onRemoved}}
      >
        {{#each this.items as |item|}}
          <GridStackItem @options={{hash x=0 y=item}}>
            {{item}}
          </GridStackItem>
        {{/each}}
      </GridStack>
    `);

    //Update gridstack
    run(() => this.items.pushObject(2));

    // this will trigger onChange in addition to onAdded as
    // the existing item at y=2 will be moved by gridstack
    run(() => this.items.pushObject(2));

    run(() => this.items.removeObject(2));
  });

  test('gridstack items with noMove/Resize', async function (assert) {
    await render(hbs`
      <GridStack>
        <GridStackItem @options={{hash x=0 y=0 noMove=true noResize=true}}>
          Test widget
        </GridStackItem>
      </GridStack>
    `);

    assert.deepEqual(
      [...find('.grid-stack-item').classList],
      ['grid-stack-item', 'ui-draggable-disabled', 'ui-resizable-disabled'],
      'grid-stack-item noResize and noMove properties are applied'
    );
  });

  test('gridstack is notified when items properties change', async function (assert) {
    assert.expect(2);

    this.set('onChange', () => assert.ok(true, '`onChange` was called'));

    this.set('options', { w: 6 });

    await render(hbs`
      <GridStack @onChange={{this.onChange}}>
        <GridStackItem @options={{this.options}}>
          Test
        </GridStackItem>
      </GridStack>
    `);

    this.set('options', { w: 12 });
    await settled();

    class GlimmerActionListener {
      @action
      onChange() {
        assert.ok(true, '`onChange` was called from glimmer action');
      }
    }
    const listener = new GlimmerActionListener();
    this.set('onChange', listener.onChange);

    this.set('options', { w: 10 });
    await settled();
  });

  test('gridstack updates the layout when items properties change', async function (assert) {
    this.set('items', [
      { id: 0, options: { x: 0, y: 0, w: 5, h: 1 } },
      { id: 1, options: { x: 6, y: 0, w: 3, h: 1 } },
      { id: 2, options: { x: 0, y: 1, w: 4, h: 1 } },
      { id: 3, options: { x: 6, y: 1, w: 2, h: 1 } },
    ]);

    await render(hbs`
      <GridStack>
        {{#each this.items as |item|}}
          <GridStackItem data-id={{item.id}} @options={{item.options}}>
            {{item.id}}
          </GridStackItem>
        {{/each}}
      </GridStack>
    `);

    this.items.forEach(({ id, options }) => {
      if (options.x === 0) {
        assert.dom(`[data-id="${id}"]`).doesNotHaveAttribute('gs-x', 'Initial grid-stack-item layout is correct');
      } else {
        assert
          .dom(`[data-id="${id}"]`)
          .hasAttribute('gs-x', `${options.x}`, 'Initial grid-stack-item layout is correct');
      }

      if (options.y === 0) {
        assert.dom(`[data-id="${id}"]`).doesNotHaveAttribute('gs-y', 'Initial grid-stack-item layout is correct');
      } else {
        assert
          .dom(`[data-id="${id}"]`)
          .hasAttribute('gs-y', `${options.y}`, 'Initial grid-stack-item layout is correct');
      }
    });

    // Update the position of item 1
    this.set('items.1.options', { x: 2, y: 1, w: 12, h: 1 });
    assert
      .dom(`[data-id="0"]`)
      .doesNotHaveAttribute('gs-x', 'Updating a grid-stack-item leaves unaffected items the same');
    assert
      .dom(`[data-id="0"]`)
      .doesNotHaveAttribute('gs-y', 'Updating a grid-stack-item leaves unaffected items the same');

    assert.dom(`[data-id="1"]`).doesNotHaveAttribute('gs-x', 'Updating a grid-stack-item updates moves the item');
    assert.dom(`[data-id="1"]`).hasAttribute('gs-y', '1', 'Updating a grid-stack-item updates moves the item');

    assert
      .dom(`[data-id="2"]`)
      .doesNotHaveAttribute('gs-x', 'Updating a grid-stack-item moves conflicting items to a different row');
    assert
      .dom(`[data-id="2"]`)
      .hasAttribute('gs-y', '2', 'Updating a grid-stack-item moves conflicting items to a different row');

    assert
      .dom(`[data-id="3"]`)
      .hasAttribute('gs-x', '6', 'Updating a grid-stack-item moves conflicting items to a different row');
    assert
      .dom(`[data-id="3"]`)
      .hasAttribute('gs-y', '2', 'Updating a grid-stack-item moves conflicting items to a different row');
  });

  test('do not fire `onChange` or `onRemoved` during teardown', async function (assert) {
    assert.expect(1);

    this.set('shouldRender', true);
    this.set('items', [
      { id: 0, options: { x: 0, y: 0, w: 5, h: 1 } },
      { id: 1, options: { x: 6, y: 0, w: 3, h: 1 } },
      { id: 2, options: { x: 0, y: 1, w: 4, h: 1 } },
      { id: 3, options: { x: 6, y: 1, w: 2, h: 1 } },
    ]);

    this.onChange = () => assert.notOk(true, '`onChange` should not fire on teardown');
    this.onRemoved = () => assert.notOk(true, '`onRemoved` should not fire on teardown');

    await render(hbs`
      {{#if this.shouldRender}}
        <GridStack
          onChange={{this.onChange}}
          onRemoved={{this.onChange}}
        >
          {{#each this.items as |item|}}
            <GridStackItem data-id={{item.id}} @options={{item.options}}>
              {{item.id}}
            </GridStackItem>
          {{/each}}
        </GridStack>
      {{/if}}
    `);

    this.set('shouldRender', false);
    assert.ok(true, 'all is good');
  });
});
