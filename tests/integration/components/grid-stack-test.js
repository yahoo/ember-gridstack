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
    assert.expect(1);

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

    assert.ok(this.$('.grid-stack .grid-stack-item').is('.ui-draggable.ui-resizable'),
      'Dom elements with grid-stack-item class are initialized by gridstack');
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

    assert.dom('.grid-stack .grid-stack-item.ui-draggable.ui-resizable').exists(
      { count: 2 },
      'initial grid-stack-item components are initialized by gridstack'
    );

    run(() => {
      this.get('items').pushObject(3);
    });

    assert.dom('.grid-stack .grid-stack-item.ui-draggable.ui-resizable').exists(
      { count: 3 },
      'new grid-stack-item components are initialized by gridstack when added through an each loop'
    );

    // Since each gridstack item has height = 1,
    // we can check how many items are recognized by using the height property
    assert.dom('.grid-stack').hasAttribute('data-gs-current-row', '3', 'gridstack recognizes new items');

    run(() => {
      this.get('items').popObject();
    });

    assert.dom('.grid-stack').hasAttribute(
      'data-gs-current-row',
      '2',
      'gridstack updates its item count when one is removed through an each loop'
    );
  });

  test('gridstack options', async function(assert) {
    assert.expect(3);

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

    assert.equal(this.$('.grid-stack-item').height(),
      200,
    'Cell height option is passed through to gridstack');

    this.set('options', {
      cellHeight: '300px'
    });

    assert.equal(this.$('.grid-stack-item').height(),
      300,
    'Gridstack updates with options');

    this.set('options', {
      cellHeight: '300px',
      staticGrid: true
    });

    assert.ok(this.$('.grid-stack-static .grid-stack-item').is('.ui-draggable-disabled.ui-resizable-disabled'),
      'staticGrid property can disable editing');
  });

  test('grid stack item events', async function(assert) {
    assert.expect(1);

    // Create fake component for listening to events
    let eventListener = Component.extend({
          didInsertElement() {
            this._super(...arguments);
            this.get('containerComponent').$().on('resizestop', () => {
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

        assert.equal(
          event.type,
          e,
          `\`${onAttr}\` action provides the \`event\` argument`
        );

        assert.ok(
          isArray(items),
          `\`${onAttr}\` action provides the \`items\` argument`
        );
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

    assert.dom('.grid-stack .grid-stack-item.ui-draggable.ui-resizable.ui-draggable-disabled.ui-resizable-disabled').exists(
      { count: 1 },
      'grid-stack-item noResize and noMove properties are applied'
    );
  });
});
