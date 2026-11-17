import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { modifier } from 'ember-modifier';
import GridStack from 'ember-gridstack/components/grid-stack';

// Data mode: gridstack owns the items, built from @layout (the React/Vue
// wrapper JSON); Ember renders each widget's content. A widget dropped on
// the other grid is rebuilt there; beforeRemove hands its state over.
class Counter extends Component {
  @tracked count = this.args.props?.count ?? 0;

  constructor() {
    super(...arguments);
    const { widget } = this.args;
    if (typeof widget.droppedFrom?.state === 'number') {
      this.count = widget.droppedFrom.state;
    }
    widget.beforeRemove(
      ({ unstable_keep }) => unstable_keep?.() ?? this.count,
    );
    widget.registerSerializer(() => ({ count: this.count }));
  }

  inc = () => this.count++;

  <template>
    <div class="widget">
      <div class="widget-label">{{@props.label}}</div>
      <div class="stat-value">{{this.count}}</div>
      <button type="button" class="button" {{on "click" this.inc}}>
        +1
      </button>
    </div>
  </template>
}

const Note = <template>
  <div class="widget">
    <div class="widget-label">Note</div>
    <p class="widget-body">{{@props.text}}</p>
  </div>
</template>;

const LEFT = [
  {
    id: 'visits',
    x: 0,
    y: 0,
    w: 2,
    h: 2,
    component: 'counter',
    props: { label: 'Visits', count: 3 },
  },
  {
    id: 'hint',
    x: 2,
    y: 0,
    w: 2,
    h: 2,
    component: 'note',
    props: { text: 'Drag a widget to the other grid.' },
  },
];

const RIGHT = [
  {
    id: 'signups',
    x: 0,
    y: 0,
    w: 2,
    h: 2,
    component: 'counter',
    props: { label: 'Signups' },
  },
];

const TOOLBOX = [
  {
    w: 2,
    h: 2,
    component: 'counter',
    props: { label: 'New counter' },
  },
  { w: 2, h: 1, component: 'note', props: { text: 'New note' } },
];

const OPTIONS = {
  acceptWidgets: true,
  removable: '.data-mode-trash',
  cellHeight: 60,
  margin: 6,
  column: 4,
  minRow: 3,
};

// gridstack's class is only reachable through an instance; the toolbox
// renders after both grids, so they are set up by now
const dragIn = modifier((element) => {
  const host = element.closest('.data-mode');
  const GridStackClass =
    host.querySelector('.grid-stack').gridstack.constructor;
  GridStackClass.setupDragIn(
    element.querySelectorAll('.toolbox-chip'),
    { helper: 'clone' },
    TOOLBOX,
  );
});

export default class DataMode extends Component {
  @tracked saved = null;
  components = { counter: Counter, note: Note };
  host = null;

  get json() {
    return this.saved
      ? JSON.stringify(this.saved, null, 1)
      : 'Not saved yet';
  }

  setHost = modifier((element) => {
    this.host = element;
  });

  // `el.gridstack` is the GridStack instance; data-mode grids save
  // {id,x,y,w,h,component,props}
  @action save() {
    const [left, right] = [
      ...this.host.querySelectorAll('.data-mode-grid'),
    ].map((el) => el.gridstack.save());
    this.saved = { left, right };
  }

  <template>
    <div class="data-mode" {{this.setHost}}>
      <div class="toolbar">
        <button type="button" class="button" {{on "click" this.save}}>
          Save both
        </button>
      </div>
      <div class="data-mode-grids">
        <GridStack
          class="data-mode-grid"
          aria-label="Left grid"
          @options={{OPTIONS}}
          @layout={{LEFT}}
          @components={{this.components}}
        />
        <GridStack
          class="data-mode-grid"
          aria-label="Right grid"
          @options={{OPTIONS}}
          @layout={{RIGHT}}
          @components={{this.components}}
        />
      </div>
      <div class="data-mode-tools">
        <div
          class="toolbox"
          aria-label="Drag a chip onto a grid"
          {{dragIn}}
        >
          <div class="toolbox-chip grid-stack-item">
            <div class="grid-stack-item-content">Counter</div>
          </div>
          <div class="toolbox-chip grid-stack-item">
            <div class="grid-stack-item-content">Note</div>
          </div>
        </div>
        <div class="data-mode-trash">Drop to delete</div>
      </div>
    </div>
    <pre class="code saved-json"><code>{{this.json}}</code></pre>
  </template>
}
