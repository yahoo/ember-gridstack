import { module, test } from 'qunit';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import { hash } from '@ember/helper';
import { registerDestructor } from '@ember/destroyable';
import {
  click,
  find,
  findAll,
  resetOnerror,
  settled,
  setupOnerror,
} from '@ember/test-helpers';
import GridStack from 'ember-gridstack/components/grid-stack';
import GridStackLayout from 'ember-gridstack/components/grid-stack-layout';
import GridStackItem from 'ember-gridstack/components/grid-stack-item';
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

const Text = <template>
  <span class="text">{{@props.text}}{{@props.content}}</span>
</template>;

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
          <GridStack @layout={{layout}} @components={{components}} as |widget|>
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
      const fixture = JSON.parse(JSON.stringify(f.layout));
      await this.grid.render({
        template: (d) => <template>
          {{#if d.visible}}
            <GridStack
              @options={{hash column=12 cellHeight=50}}
              @layout={{fixture}}
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

  test('lazyLoad renders only once the item intersects', async function (assert) {
    const Real = window.IntersectionObserver;
    const observers = [];
    window.IntersectionObserver = class {
      constructor(cb) {
        this.cb = cb;
        observers.push(this);
      }
      observe(el) {
        this.el = el;
      }
      disconnect() {
        this.el = null;
      }
      fire() {
        this.cb([{ isIntersecting: true, target: this.el }]);
      }
    };
    try {
      const layout = [
        { id: 'a', w: 1, h: 1, component: 'text', props: { text: 'L' } },
      ];
      const components = { text: Text };
      await this.grid.render({
        template: (d) => <template>
          {{#if d.visible}}
            <GridStack
              @options={{hash lazyLoad=true}}
              @layout={{layout}}
              @components={{components}}
            />
          {{/if}}
        </template>,
      });
      // the observer is attached in a setTimeout after creation
      await new Promise((r) => setTimeout(r, 0));
      assert.dom('[gs-id="a"]').exists('item element exists');
      assert.dom('[gs-id="a"] .text').doesNotExist('content not rendered yet');
      assert.strictEqual(observers.length, 1);
      observers[0].fire();
      await settled();
      assert.dom('[gs-id="a"] .text').hasText('L', 'rendered on intersect');
      await this.grid.destroy();
    } finally {
      window.IntersectionObserver = Real;
    }
  });

  test('sizeToContent: widget.resizeToContent() grows the node', async function (assert) {
    const state = new (class {
      @tracked tall = false;
    })();
    const layout = [{ id: 'a', w: 2, h: 1, sizeToContent: true }];
    let widgetCtx;
    const capture = (w) => {
      widgetCtx = w;
    };
    await this.grid.render({
      template: (d) => <template>
        {{! template-lint-disable no-inline-styles }}
        {{#if d.visible}}
          <div style="width: 1000px">
            <GridStack
              @options={{hash cellHeight=50}}
              @layout={{layout}}
              as |widget|
            >
              {{capture widget}}
              {{#if state.tall}}
                <div style="height: 300px">tall</div>
              {{else}}
                <div style="height: 20px">short</div>
              {{/if}}
            </GridStack>
          </div>
        {{/if}}
      </template>,
    });
    const before = widgetCtx.node.h;
    state.tall = true;
    await settled();
    widgetCtx.resizeToContent();
    await settled();
    assert.true(
      find('[gs-id="a"]').gridstackNode.h > before,
      `h grew from ${before} to ${find('[gs-id="a"]').gridstackNode.h}`,
    );
    await this.grid.destroy();
  });

  test('@layout change reloads by id', async function (assert) {
    const state = new (class {
      @tracked layout = [
        { id: 'a', x: 0, y: 0, w: 2, h: 1, component: 'counter' },
        { id: 'b', x: 2, y: 0, w: 2, h: 1, component: 'text', props: {} },
      ];
    })();
    const components = { text: Text, counter: Counter };
    await this.grid.render({
      template: (d) => <template>
        {{! template-lint-disable no-inline-styles }}
        {{#if d.visible}}
          <div style="width: 1000px">
            <GridStack
              @options={{hash float=true}}
              @layout={{state.layout}}
              @components={{components}}
            />
          </div>
        {{/if}}
      </template>,
    });
    const api = find('.grid-stack')._gridComp;
    await click('[gs-id="a"] .inc');
    const button = find('[gs-id="a"] .inc');

    state.layout = [
      { id: 'a', x: 4, y: 1, w: 3, h: 1, component: 'counter' },
      {
        id: 'c',
        x: 0,
        y: 0,
        w: 2,
        h: 1,
        component: 'text',
        props: { text: 'C' },
      },
    ];
    await settled();

    assert.deepEqual(domIds().sort(), ['a', 'c'], 'b removed, c added');
    assert.dom('[gs-id="c"] .text').hasText('C');
    assert.strictEqual(
      find('[gs-id="a"] .inc'),
      button,
      'same id keeps its component instance',
    );
    assert.dom('[gs-id="a"] .inc').hasText('1', 'and its state');
    assert.deepEqual(
      strip(api.save()).sort((p, q) => p.id.localeCompare(q.id)),
      [
        {
          id: 'a',
          x: 4,
          y: 1,
          w: 3,
          h: 1,
          component: 'counter',
          props: { count: 1 },
        },
        {
          id: 'c',
          x: 0,
          y: 0,
          w: 2,
          h: 1,
          component: 'text',
          props: { text: 'C' },
        },
      ],
    );
    await this.grid.destroy();
  });

  test('save() on a template-mode grid keeps content next to a data-mode grid', async function (assert) {
    const layout = [{ id: 'a', w: 2, h: 1, component: 'text', props: {} }];
    const components = { text: Text };
    await this.grid.render({
      template: (d) => <template>
        {{#if d.visible}}
          <GridStack id="tpl">
            <GridStackItem @options={{hash id="t"}}><b>hello</b></GridStackItem>
          </GridStack>
          <GridStack @layout={{layout}} @components={{components}} />
        {{/if}}
      </template>,
    });
    const saved = find('#tpl').gridstack.save();
    assert.strictEqual(
      saved[0]?.content?.trim(),
      '<b>hello</b>',
      'content saved',
    );
    const data = find('[gs-id="a"]').closest('.grid-stack')._gridComp.save();
    assert.strictEqual(data[0].component, 'text', 'data grid still saves');
    assert.notOk('content' in data[0]);
    await this.grid.destroy();
  });

  test('nested grids (subGridOpts) assert in data mode', async function (assert) {
    const layout = [
      { id: 'p', w: 4, h: 4, subGridOpts: { children: [{ id: 'c' }] } },
    ];
    const errors = [];
    setupOnerror((e) => errors.push(e));
    try {
      await this.grid.render({
        template: (d) => <template>
          {{#if d.visible}}
            <GridStack @layout={{layout}} />
          {{/if}}
        </template>,
      });
    } catch (e) {
      errors.push(e);
    }
    resetOnerror();
    assert.ok(
      errors.some((e) =>
        /nested grids \(subGridOpts\) are not supported in data mode yet/.test(
          e?.message,
        ),
      ),
      errors.map((e) => e?.message).join(' | '),
    );
    await this.grid.destroy();
  });

  test('SSR: without the modifier the grid renders empty', async function (assert) {
    let comp;
    // modifiers never run on a server render
    class ServerLayout extends GridStackLayout {
      constructor() {
        super(...arguments);
        comp = this;
      }
      setup() {}
      willDestroyNode() {}
    }
    const layout = [{ id: 'a', component: 'text' }];
    await this.grid.render({
      template: (d) => <template>
        {{#if d.visible}}
          <ServerLayout @layout={{layout}} />
        {{/if}}
      </template>,
    });
    assert.dom('.grid-stack').exists();
    assert.dom('.grid-stack').hasNoText();
    assert.strictEqual(find('.grid-stack').childElementCount, 0);
    assert.deepEqual(comp.widgets, []);
    assert.strictEqual(comp.instance, null);
    await this.grid.destroy();
  });

  test('a REINIT option change rebuilds the grid, keeping layout and serializer state', async function (assert) {
    let created = 0;
    let destroyed = 0;
    class Counted extends Counter {
      constructor() {
        super(...arguments);
        created++;
        registerDestructor(this, () => destroyed++);
      }
    }
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
    const components = { text: Text, counter: Counted };
    await this.grid.render({
      options: { float: true },
      template: (d) => <template>
        {{#if d.visible}}
          <GridStackLayout
            @layout={{layout}}
            @options={{d.gridOptions}}
            @components={{components}}
          />
        {{/if}}
      </template>,
    });
    const el = find('.grid-stack');
    const api = el._gridComp;
    const counts = () => [
      findAll('.grid-stack-item-content .text').length,
      findAll('.grid-stack-item-content .inc').length,
    ];

    const first = el.gridstack;
    await this.grid.setOptions({ cellHeight: 55 });
    assert.strictEqual(
      el.gridstack,
      first,
      'non-reinit key keeps the instance',
    );
    assert.strictEqual(el.gridstack.opts.cellHeight, 55);

    api.instance.update(find('[gs-id="b"]'), { x: 4, y: 1 });
    await click('[gs-id="b"] .inc');
    const expected = strip(api.save()).sort((p, q) => p.id.localeCompare(q.id));
    assert.deepEqual(expected.find((w) => w.id === 'b').props, { count: 2 });
    created = 0;
    destroyed = 0;

    await this.grid.setOptions({ handle: '.text' });
    assert.notStrictEqual(el.gridstack, first, 'new instance');
    assert.strictEqual(el.gridstack.opts.handle, '.text');
    const sorted = () =>
      strip(api.save()).sort((p, q) => p.id.localeCompare(q.id));
    assert.deepEqual(sorted(), expected, 'layout kept');
    assert.dom('[gs-id="b"] .inc').hasText('2', 'serializer state kept');
    assert.deepEqual(counts(), [1, 1], 'no duplicates');
    assert.strictEqual(created, 1, 'counter re-created once');
    assert.strictEqual(destroyed, 1, 'old counter destroyed');

    const second = el.gridstack;
    await this.grid.setOptions({
      draggable: { scroll: false },
      marginTop: 7,
      marginUnit: 'px',
    });
    assert.notStrictEqual(el.gridstack, second);
    assert.false(el.gridstack.opts.draggable.scroll, 'draggable applied');
    assert.strictEqual(el.gridstack.opts.marginTop, 7);
    assert.deepEqual(sorted(), expected);
    assert.deepEqual(counts(), [1, 1]);
    assert.strictEqual(created, 2);
    assert.strictEqual(domIds().length, 2);
    assert.strictEqual(
      [...el.classList].filter((c) => c.startsWith('grid-stack-instance-'))
        .length,
      0,
    );
    await this.grid.destroy();
  });
});
