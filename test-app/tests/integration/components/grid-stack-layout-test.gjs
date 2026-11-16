import { module, test } from 'qunit';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import { hash } from '@ember/helper';
import { registerDestructor } from '@ember/destroyable';
import { click, find, findAll, settled } from '@ember/test-helpers';
import GridStack from 'ember-gridstack/components/grid-stack';
import { setupGridTest } from '../../helpers/setup-grid-test';
import { pointerDrag } from '../../helpers/grid';

const domIds = () =>
  findAll('#ember-testing .grid-stack-item').map((el) =>
    el.getAttribute('gs-id'),
  );

const nodeIds = (gs) => gs.engine.nodes.map((n) => n.id).sort();

const strip = (list) =>
  list.map(({ id, x, y, w, h, component, props }) => ({
    id,
    x: x ?? 0,
    y: y ?? 0,
    w: w ?? 1,
    h: h ?? 1,
    component,
    props,
  }));

class Text extends Component {
  <template>
    <span class="text">{{@props.text}}{{@props.content}}</span>
  </template>
}

class Counter extends Component {
  @tracked count = this.args.props?.count ?? 0;

  constructor() {
    super(...arguments);
    registerDestructor(
      this,
      this.args.widget.registerSerializer(() => ({ count: this.count })),
    );
  }

  inc = () => this.count++;

  <template>
    <button type="button" class="inc" {{on "click" this.inc}}>
      {{this.count}}
    </button>
  </template>
}

module('Integration | Component | grid stack layout', function (hooks) {
  setupGridTest(hooks);

  test('renders children, add/remove, save/load round trip, serializers', async function (assert) {
    const layout = [
      {
        id: 'a',
        x: 0,
        y: 0,
        w: 2,
        h: 1,
        component: 'text',
        props: { text: 'A' },
      },
      {
        id: 'b',
        x: 2,
        y: 0,
        w: 2,
        h: 1,
        component: 'counter',
        props: { count: 1 },
      },
    ];
    const components = { text: Text, counter: Counter };

    let api;

    await this.grid.render({
      template: (d) => <template>
        {{#if d.visible}}
          <GridStack
            @layout={{layout}}
            @components={{components}}
            as |widget grid|
          >
            {{widget.id}}
          </GridStack>
        {{/if}}
      </template>,
    });
    api = find('.grid-stack')._gridComp;

    assert.deepEqual(domIds(), ['a', 'b']);
    assert.deepEqual(nodeIds(api.instance), ['a', 'b']);
    assert.dom('[gs-id="a"] .text').hasText('A', 'props reach the component');
    assert.dom('[gs-id="b"] .inc').hasText('1');

    await click('[gs-id="b"] .inc');
    await click('[gs-id="b"] .inc');
    const saved = api.save();
    assert.deepEqual(
      saved.find((w) => w.id === 'a'),
      { id: 'a', x: 0, y: 0, w: 2, component: 'text', props: { text: 'A' } },
      'save() with no args includes component and props',
    );
    assert.deepEqual(
      saved.find((w) => w.id === 'b').props,
      { count: 3 },
      'serializer state lands in save().props',
    );

    api.addWidget({
      id: 'c',
      x: 0,
      y: 1,
      w: 1,
      h: 1,
      component: 'text',
      props: { text: 'C' },
    });
    await settled();
    assert.dom('[gs-id="c"] .text').hasText('C', 'addWidget renders');
    api.removeWidget('a');
    await settled();
    assert.deepEqual(domIds().sort(), ['b', 'c']);
    assert.deepEqual(nodeIds(api.instance), ['b', 'c']);

    // re-create b so its count can only come from saved.props
    api.removeWidget('b');
    await settled();
    assert.dom('[gs-id="b"]').doesNotExist();
    api.load(saved);
    await settled();
    assert.deepEqual(nodeIds(api.instance), ['a', 'b'], 'load adds/removes');
    assert.deepEqual(strip(api.save()), strip(saved), 'round trip');
    assert
      .dom('[gs-id="b"] .inc')
      .hasText('3', 'serializer state restored after load');

    await this.grid.destroy();
  });

  test('yielded block renders when no @components entry matches', async function (assert) {
    const layout = [
      { id: 'a', w: 1, h: 1, component: 'chart', props: { n: 7 } },
    ];
    await this.grid.render({
      template: (d) => <template>
        {{#if d.visible}}
          <GridStack @layout={{layout}} as |widget|>
            <b class="y">{{widget.component}}:{{widget.props.n}}</b>
          </GridStack>
        {{/if}}
      </template>,
    });
    assert.dom('[gs-id="a"] .grid-stack-item-content .y').hasText('chart:7');
    await this.grid.destroy();
  });

  test('README JSON from the React and Vue wrappers loads unmodified', async function (assert) {
    const react = [
      {
        id: 'a',
        x: 0,
        y: 0,
        w: 2,
        h: 2,
        component: 'Text',
        props: { text: 'Hello' },
      },
    ];
    const vue = [
      {
        id: 'a',
        x: 0,
        y: 0,
        w: 3,
        h: 2,
        component: 'Text',
        props: { content: 'Hello!' },
      },
    ];
    const components = { Text };
    const fixtures = [
      { name: 'react', layout: react, text: 'Hello' },
      { name: 'vue', layout: vue, text: 'Hello!' },
    ];

    for (const f of fixtures) {
      const input = JSON.parse(JSON.stringify(f.layout));
      await this.grid.render({
        template: (d) => <template>
          {{#if d.visible}}
            <GridStack
              @options={{hash column=12 cellHeight=50}}
              @layout={{input}}
              @components={{components}}
            />
          {{/if}}
        </template>,
      });
      const api = find('.grid-stack')._gridComp;
      assert.dom('[gs-id="a"] .text').hasText(f.text, `${f.name} renders`);
      const out = api.save();
      assert.deepEqual(out, f.layout, `${f.name} save() emits the same JSON`);
      await this.grid.destroy();
      this.grid.visible = true;
    }
    this.grid.visible = false;
  });

  test('drag keeps DOM order == visual order and component state', async function (assert) {
    const layout = [
      { id: 'a', x: 0, y: 0, w: 2, h: 1, component: 'counter' },
      { id: 'b', x: 2, y: 0, w: 2, h: 1, component: 'counter' },
    ];
    const components = { counter: Counter };
    let api;
    await this.grid.render({
      template: (d) => <template>
        {{#if d.visible}}
          {{! template-lint-disable no-inline-styles }}
          <div style="width: 1000px">
            <GridStack
              @options={{hash float=false}}
              @layout={{layout}}
              @components={{components}}
              as |w grid|
            />
          </div>
        {{/if}}
      </template>,
    });
    api = find('.grid-stack')._gridComp;
    await click('[gs-id="a"] .inc');
    await click('[gs-id="a"] .inc');

    const el = find('[gs-id="a"]');
    const gs = api.instance;
    const scale = gs.el.getBoundingClientRect().width / gs.el.offsetWidth;
    await pointerDrag(el, gs.cellWidth() * scale * 4, 0);

    const visual = [...gs.engine.nodes]
      .sort((p, q) => p.y - q.y || p.x - q.x)
      .map((n) => n.id);
    assert.notEqual(el.gridstackNode.x, 0, 'a moved');
    assert.deepEqual(domIds(), visual, 'DOM order follows visual order');
    assert.dom('[gs-id="a"] .inc').hasText('2', 'tracked state kept');

    await this.grid.destroy();
  });
});
