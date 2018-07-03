import Component from '@ember/component';
import { run, next } from '@ember/runloop';
import { A, isArray } from '@ember/array';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('grid-stack', 'Integration | Component | grid stack', {
  integration: true
});

test('gridstack renders', function(assert) {
  assert.expect(1);

  this.render(hbs`
    {{#grid-stack}}
        <div class='grid-stack-item'
            data-gs-x='0' data-gs-y='0'
            data-gs-width='1' data-gs-height='1'
        >
          <div class='grid-stack-item-content'>My Widget</div>
        </div>
    {{/grid-stack}}
  `);

  assert.ok(this.$('.grid-stack .grid-stack-item').is('.ui-draggable.ui-resizable'),
    'Dom elements with grid-stack-item class are initialized by gridstack');
});

test('gridstack with items', function(assert) {
  assert.expect(4);

  this.set('items', A([1, 2]));

  this.render(hbs`
    {{#grid-stack}}
      {{#each items as |item|}}
        {{grid-stack-item}}
      {{/each}}
    {{/grid-stack}}
  `);

  assert.equal(this.$('.grid-stack .grid-stack-item.ui-draggable.ui-resizable').length,
    2,
  'initial grid-stack-item components are initialized by gridstack');

  run(() => {
    this.get('items').pushObject(3);
  });

  assert.equal(this.$('.grid-stack .grid-stack-item.ui-draggable.ui-resizable').length,
    3,
  'new grid-stack-item components are initialized by gridstack when added through an each loop');

  // Since gridstack defaults to adding new items vertically, and each item has height = 1,
  // we can check how many items are recognized by using the height property
  assert.equal(this.$('.grid-stack').attr('data-gs-current-height'),
    3,
  'gridstack recognizes new items');

  run(() => {
    this.get('items').popObject();
  });

  assert.equal(this.$('.grid-stack').attr('data-gs-current-height'),
    2,
  'gridstack updates its item count when one is removed through an each loop');
});

test('gridstack options', function(assert) {
  assert.expect(3);

  this.set('options', {
    cellHeight: '200px'
  });

  this.render(hbs`
    {{#grid-stack
      options=options
    }}
        <div class='grid-stack-item'
            data-gs-x='0' data-gs-y='0'
            data-gs-width='1' data-gs-height='1'
        >
          <div class='grid-stack-item-content'>My Widget</div>
        </div>
    {{/grid-stack}}
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

test('grid stack item events', function(assert) {
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

  this.register('component:event-listener', eventListener);

  this.render(hbs`
    {{#grid-stack}}
      {{#grid-stack-item as |item|}}
        {{event-listener containerComponent=item}}
      {{/grid-stack-item}}
      <div class='a-different-item' />
    {{/grid-stack}}
  `);

  next(() => {
    this.$('.grid-stack-item').trigger('resizestop');
  });

  // Check that the action is not called when a different item is resized
  run(() => {
    this.$('.a-different-item').trigger('resizestop');
  });
});

test('onChange action', function(assert) {
  assert.expect(6);

  this.set('items', A([1]));

  /* == Test `change` event handler when `didUpdateGrid` attr not provided == */

  this.render(hbs`
    {{#grid-stack}}
      {{#each items as |item|}}
        {{#grid-stack-item}}
          {{item}}
        {{/grid-stack-item}}
      {{/each}}
    {{/grid-stack}}
  `);

  run(() => this.get('items').pushObject(2));

  /* == Test `change` event handler when `didUpdateGrid` attr provided == */

  this.set('items', A([1]));

  this.set('onChange', (event, items) => {
    assert.ok('`onChange` fires when gridstack `change` event fires');

    assert.equal(event.type,
      'change',
    '`onChange` action provides the `event` argument');

    assert.ok(isArray(items),
      '`onChange` action provides the `items` argument');
  });

  this.render(hbs`
    {{#grid-stack
      onChange=(action onChange)
    }}
      {{#each items as |item|}}
        {{#grid-stack-item}}
          {{item}}
        {{/grid-stack-item}}
      {{/each}}
    {{/grid-stack}}
  `);

  //Update gridstack
  run(() => this.get('items').pushObject(2));
  run(() => this.get('items').removeObject(2));
});
