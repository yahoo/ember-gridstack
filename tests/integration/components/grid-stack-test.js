import Component from '@ember/component';
import { run, next } from '@ember/runloop';
import { A, isArray } from '@ember/array';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerEvent } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { camelize } from '@ember/string';

module('Integration | Component | grid stack', function(hooks) {
  setupRenderingTest(hooks);

  test('gridstack renders', async function(assert) {
    assert.expect(2);

    await render(hbs`
      <GridStack>
        <div class='grid-stack-item'
          data-gs-x='0' data-gs-y='0'
          data-gs-width='1' data-gs-height='1'
        >
          <div class='grid-stack-item-content'>My Widget</div>
        </div>
      </GridStack>
    `);

    assert
      .dom('.grid-stack .grid-stack-item')
      .hasClass('ui-draggable', 'Dom elements with grid-stack-item class are initialized by gridstack');

    assert
      .dom('.grid-stack .grid-stack-item')
      .hasClass('ui-resizable', 'Dom elements with grid-stack-item class are initialized by gridstack');
  });

  test('gridstack with items', async function(assert) {
    assert.expect(4);

    this.set('items', A([1, 2]));

    await render(hbs`
      <GridStack>
        {{#each items as |item|}}
          <GridStackItem
            @options={{hash x=0 y=item}}
          >
            {{item}}
          </GridStackItem>
        {{/each}}
      </GridStack>
    `);

    assert
      .dom('.grid-stack .grid-stack-item.ui-draggable.ui-resizable')
      .exists({ count: 2 }, 'initial grid-stack-item components are initialized by gridstack');

    run(() => {
      this.get('items').pushObject(3);
    });

    assert
      .dom('.grid-stack .grid-stack-item.ui-draggable.ui-resizable')
      .exists(
        { count: 3 },
        'new grid-stack-item components are initialized by gridstack when added through an each loop'
      );

    // Since each gridstack item has height = 1,
    // we can check how many items are recognized by using the row property
    assert.dom('.grid-stack').hasAttribute('data-gs-current-row', '3', 'gridstack recognizes new items');

    run(() => {
      this.get('items').popObject();
    });

    assert
      .dom('.grid-stack')
      .hasAttribute(
        'data-gs-current-row',
        '2',
        'gridstack updates its item count when one is removed through an each loop'
      );
  });

  test('gridstack options', async function(assert) {
    assert.expect(4);

    this.set('options', {
      cellHeight: '200px'
    });

    await render(hbs`
      <GridStack
        @options={{options}}
      >
        <div class='grid-stack-item'
          data-gs-x='0' data-gs-y='0'
          data-gs-width='1' data-gs-height='1'
        >
          <div class='grid-stack-item-content'>My Widget</div>
        </div>
      </GridStack>
    `);

    assert.equal(
      this.element.querySelector('.grid-stack-item').clientHeight,
      200,
      'Cell height option is passed through to gridstack'
    );

    this.set('options', {
      cellHeight: '300px'
    });

    assert.equal(this.element.querySelector('.grid-stack-item').clientHeight, 300, 'Gridstack updates with options');

    this.set('options', {
      cellHeight: '300px',
      staticGrid: true
    });

    assert
      .dom('.grid-stack-static .grid-stack-item')
      .hasClass('ui-draggable-disabled', 'staticGrid property can disable editing');
    assert
      .dom('.grid-stack-static .grid-stack-item')
      .hasClass('ui-resizable-disabled', 'staticGrid property can disable editing');
  });

  test('grid stack item events', async function(assert) {
    assert.expect(1);

    // Create fake component for listening to events
    let eventListener = Component.extend({
      didInsertElement() {
        this._super(...arguments);
        this.containerComponent.element.addEventListener('resizestop', () => {
          assert.ok(true, 'resize action is called when item is resized');
        });
      }
    });

    this.owner.register('component:event-listener', eventListener);

    await render(hbs`
      <GridStack>
        <GridStackItem as |item|>
          <EventListener @containerComponent={{item}}/>
        </GridStackItem>
        <div class='a-different-item' />
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

  test('onChange, onAdded, onRemove actions', async function(assert) {
    // onAdded should run twice, onChange, onRemoved should each run once
    assert.expect(12);

    this.set('items', A([1]));

    /* == Test event handlers when respective attrs not provided == */

    await render(hbs`
      <GridStack>
        {{#each this.items as |item|}}
          <GridStackItem
            @options={{hash x=0 y=item}}
          >
            {{item}}
          </GridStackItem>
        {{/each}}
      </GridStack>
    `);

    run(() => this.get('items').pushObject(2));

    /* == Test event handler when respective attrs provided == */

    this.set('items', A([1]));

    const events = ['change', 'added', 'removed'];

    events.forEach(e => {
      let onAttr = camelize(`on-${e}`);
      this.set(onAttr, (event, items) => {
        assert.ok(`\`${onAttr}\` fires when gridstack \`${e}\` event fires`);

        assert.equal(event.type, e, `\`${onAttr}\` action provides the \`event\` argument`);

        assert.ok(isArray(items), `\`${onAttr}\` action provides the \`items\` argument`);
      });
    });

    await render(hbs`
      <GridStack
        @onChange={{action this.onChange}}
        @onAdded={{action this.onAdded}}
        @onRemoved={{action this.onRemoved}}
      >
        {{#each this.items as |item|}}
          <GridStackItem
            @options={{hash x=0 y=item}}
          >
            {{item}}
          </GridStackItem>
        {{/each}}
      </GridStack>
    `);

    //Update gridstack
    run(() => this.get('items').pushObject(2));

    // this will trigger onChange in addition to onAdded as
    // the existing item at y=2 will be moved by gridstack
    run(() => this.get('items').pushObject(2));

    run(() => this.get('items').removeObject(2));
  });

  test('gridstack items with noMove/Resize', async function(assert) {
    await render(hbs`
      <GridStack>
        <GridStackItem
          @options={{hash x=0 y=0 noMove='true' noResize='true'}}
        >
          Test widget
        </GridStackItem>
      </GridStack>
    `);

    assert
      .dom('.grid-stack .grid-stack-item.ui-draggable.ui-resizable.ui-draggable-disabled.ui-resizable-disabled')
      .exists({ count: 1 }, 'grid-stack-item noResize and noMove properties are applied');
  });

  test('gridstack is notified when items properties change', async function(assert) {
    assert.expect(1);

    this.set('onChange', () => assert.ok(true, '`onChange` was called'));
    this.set('width', 6);

    await render(hbs`
      <GridStack @onChange={{this.onChange}}>
        <GridStackItem @options={{hash x=0 y=0 width=this.width height=1}}>
          Test
        </GridStackItem>
      </GridStack>
    `);

    this.set('width', 12);
  });

  test('gridstack updates the layout when items properties change', async function(assert) {
    this.set('items', [
      { id: 0, options: { x: 0, y: 0, width: 5, height: 1 } },
      { id: 1, options: { x: 6, y: 0, width: 3, height: 1 } },
      { id: 2, options: { x: 0, y: 1, width: 4, height: 1 } },
      { id: 3, options: { x: 6, y: 1, width: 2, height: 1 } }
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

    this.items.forEach(({id, options}) => {
      assert.dom(`[data-id="${id}"]`).hasAttribute('data-gs-x', `${options.x}`, 'Initial grid-stack-item layout is correct');
      assert.dom(`[data-id="${id}"]`).hasAttribute('data-gs-y', `${options.y}`, 'Initial grid-stack-item layout is correct');
    });

    // Update the position of item 1
    this.set('items.1.options', { x: 2, y: 1, width: 12, height: 1 });

    assert.dom(`[data-id="0"]`).hasAttribute('data-gs-x', '0', 'Updating a grid-stack-item leaves unaffected items the same');
    assert.dom(`[data-id="0"]`).hasAttribute('data-gs-y', '0', 'Updating a grid-stack-item leaves unaffected items the same');

    assert.dom(`[data-id="1"]`).hasAttribute('data-gs-x', '2', 'Updating a grid-stack-item updates moves the item');
    assert.dom(`[data-id="1"]`).hasAttribute('data-gs-y', '1', 'Updating a grid-stack-item updates moves the item');

    assert.dom(`[data-id="2"]`).hasAttribute('data-gs-x', '0', 'Updating a grid-stack-item moves conflicting items to a different row');
    assert.dom(`[data-id="2"]`).hasAttribute('data-gs-y', '2', 'Updating a grid-stack-item moves conflicting items to a different row');

    assert.dom(`[data-id="3"]`).hasAttribute('data-gs-x', '6', 'Updating a grid-stack-item moves conflicting items to a different row');
    assert.dom(`[data-id="3"]`).hasAttribute('data-gs-y', '2', 'Updating a grid-stack-item moves conflicting items to a different row');
  });
});
