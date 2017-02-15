import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('grid-stack-item', 'Integration | Component | grid stack item', {
  integration: true
});

test('item renders', function(assert) {
  assert.expect(3);

  // Create a fake version of `grid-stack` component to test update actions
  let assertMessage = '',
      mockGridStack = Ember.Component.extend({
        gridStackContainer: true,
        actions: {
          addWidget() {
            assert.ok(true, '`addWidget` action is called on init');
          },
          removeWidget() {
            assert.ok(true, '`removeWidget` action is called when cleaning up');
          }
        }
      });

  this.register('component:mock-grid-stack', mockGridStack);

  // Test didInsertElement calls update
  assertMessage = 'grid-stack component is notified to update when item renders';

  this.render(hbs`
    {{#mock-grid-stack}}
      {{#grid-stack-item}}
        template block text
      {{/grid-stack-item}}
    {{/mock-grid-stack}}
  `);

  assert.equal(this.$().text().trim(),
    'template block text',
  'Inner template is yielded');

  // Test willDestroyElement calls update
  assertMessage = 'grid-stack component is notified to update when item is destroyed';
});

test('item options', function(assert) {
  assert.expect(3);

  this.set('options', {
    minHeight: 2
  });

  this.render(hbs`
    {{grid-stack-item
      options=options
    }}
  `);

  assert.equal(this.$('.grid-stack-item').attr('data-gs-min-height'),
    2,
  'Item options are added as data attributes');

  this.set('options', {
    minHeight: 3
  });

  assert.equal(this.$('.grid-stack-item').attr('data-gs-min-height'),
    3,
  'Data attributes are updated with options');

  this.set('options', {
    minHeight: undefined,
  });

  assert.equal(this.$('.grid-stack-item').attr('data-gs-min-height'),
    undefined,
  'Data attributes can be removed');
});
