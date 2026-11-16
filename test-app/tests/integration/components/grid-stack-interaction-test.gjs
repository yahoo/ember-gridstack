import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import { hash } from '@ember/helper';
import GridStack from 'ember-gridstack/components/grid-stack';
import GridStackItem from 'ember-gridstack/components/grid-stack-item';
import { gsPos, pointerDrag, resizeDrag } from '../../helpers/grid';

const EVENTS = [
  'dragstart',
  'drag',
  'dragstop',
  'resizestart',
  'resize',
  'resizestop',
  'change',
];

module('Integration | Component | grid stack interaction', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(async function () {
    const calls = (this.calls = {});
    const h = (this.h = {});
    EVENTS.forEach((name) => {
      calls[name] = [];
      h[name] = (...args) => calls[name].push(args);
    });
    await render(
      <template>
        {{! template-lint-disable no-inline-styles }}
        <GridStack
          style="width: 1200px"
          @options={{hash cellHeight=50 column=12 mode="float"}}
          @onDragstart={{h.dragstart}}
          @onDrag={{h.drag}}
          @onDragstop={{h.dragstop}}
          @onResizestart={{h.resizestart}}
          @onResize={{h.resize}}
          @onResizestop={{h.resizestop}}
          @onChange={{h.change}}
        >
          <GridStackItem
            class="target"
            @options={{hash x=0 y=0 w=2 h=2}}
          >A</GridStackItem>
        </GridStack>
      </template>,
    );
  });

  test('drag moves the item and fires drag events', async function (assert) {
    const el = find('.target');
    await pointerDrag(el, 300, 160);

    assert.ok(gsPos(el, 'gs-x') > 0, 'gs-x changed');
    assert.ok(gsPos(el, 'gs-y') > 0, 'gs-y changed');
    for (const name of ['dragstart', 'dragstop', 'change']) {
      assert.strictEqual(this.calls[name].length, 1, `${name} fired once`);
    }
    assert.ok(this.calls.drag.length >= 1, 'drag fired');
    assert.strictEqual(this.calls.dragstart[0][1], el, 'dragstart gets el');
    assert.strictEqual(this.calls.dragstop[0][1], el, 'dragstop gets el');
    assert.strictEqual(this.calls.change[0][1][0].el, el, 'change gets node');
    assert.strictEqual(this.calls.resizestart.length, 0);
  });

  test('resize changes the size and fires resize events', async function (assert) {
    const el = find('.target');
    await resizeDrag(el, 300, 160);

    assert.ok(gsPos(el, 'gs-w') > 2, 'gs-w changed');
    assert.ok(gsPos(el, 'gs-h') > 2, 'gs-h changed');
    for (const name of ['resizestart', 'resizestop', 'change']) {
      assert.strictEqual(this.calls[name].length, 1, `${name} fired once`);
    }
    assert.ok(this.calls.resize.length >= 1, 'resize fired');
    assert.strictEqual(this.calls.resizestart[0][1], el);
    assert.strictEqual(this.calls.resizestop[0][1], el);
    assert.strictEqual(this.calls.dragstart.length, 0);
  });
});
