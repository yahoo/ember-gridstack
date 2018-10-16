import Component from '@ember/component';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | grid stack item', function(hooks) {
  setupRenderingTest(hooks);

  test('item renders', async function(assert) {
    assert.expect(3);

    // Create a fake version of `grid-stack` component to test update actions
    let mockGridStack = Component.extend({
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

    this.owner.register('component:mock-grid-stack', mockGridStack);

    await render(hbs`
      {{#mock-grid-stack}}
        {{#grid-stack-item}}
          template block text
        {{/grid-stack-item}}
      {{/mock-grid-stack}}
    `);

    assert.dom('*').hasText('template block text', 'Inner template is yielded');
  });

  test('item options', async function(assert) {
    assert.expect(3);

    this.set('options', {
      minHeight: 2
    });

    await render(hbs`
      {{grid-stack-item
        options=options
      }}
    `);

    assert.dom('.grid-stack-item').hasAttribute('data-gs-min-height', 2, 'Item options are added as data attributes');

    this.set('options', {
      minHeight: 3
    });

    assert.dom('.grid-stack-item').hasAttribute('data-gs-min-height', 3, 'Data attributes are updated with options');

    this.set('options', {
      minHeight: undefined,
    });

    assert.dom('.grid-stack-item').hasAttribute('data-gs-min-height', undefined, 'Data attributes can be removed');
  });
});
