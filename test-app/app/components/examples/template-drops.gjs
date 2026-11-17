import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { on } from '@ember/modifier';
import { modifier } from 'ember-modifier';
import GridStack from 'ember-gridstack/components/grid-stack';

// Template mode: Ember renders the items from two lists. A drop moves the
// record from one list to the other in @onDropped; the new item reads the
// old one's state from droppedFrom.
class Counter extends Component {
  @tracked count = 0;

  constructor() {
    super(...arguments);
    const { item } = this.args;
    if (typeof item.droppedFrom?.state === 'number') {
      this.count = item.droppedFrom.state;
    }
    item.beforeRemove(() => this.count);
  }

  inc = () => this.count++;

  <template>
    <div class="widget">
      <div class="widget-label">{{@label}}</div>
      <div class="stat-value">{{this.count}}</div>
      <button type="button" class="button" {{on "click" this.inc}}>
        +1
      </button>
    </div>
  </template>
}

const OPTIONS = {
  acceptWidgets: true,
  removable: '.template-drops-trash',
  cellHeight: 60,
  margin: 6,
  column: 4,
  minRow: 3,
};

const record = (id, label, x, y) => ({
  id,
  label,
  options: { id, x, y, w: 2, h: 2 },
});

let created = 0;

// the toolbox renders after both grids, so they are set up by now
const dragIn = modifier((element) => {
  const grid = element
    .closest('.template-drops')
    .querySelector('.grid-stack');
  grid.gridstack.constructor.setupDragIn(
    element.querySelectorAll('.toolbox-chip'),
    { helper: 'clone' },
  );
});

export default class TemplateDrops extends Component {
  @service gridStackRegistry;

  @tracked lists = {
    left: [
      record('apples', 'Apples', 0, 0),
      record('pears', 'Pears', 2, 0),
    ],
    right: [record('plums', 'Plums', 0, 0)],
  };

  keyOf(grid) {
    return ['left', 'right'].find(
      (key) => this.gridStackRegistry.get(`drops-${key}`) === grid,
    );
  }

  onDropped = (event, previousNode, newNode) => {
    const to = this.keyOf(this.gridStackRegistry.find(newNode.grid));
    const lists = { ...this.lists };
    if (previousNode) {
      const from = this.keyOf(
        this.gridStackRegistry.find(previousNode.grid),
      );
      const moved = lists[from].find((r) => r.id === newNode.id);
      lists[from] = lists[from].filter((r) => r !== moved);
      lists[to] = [...lists[to], moved];
    } else {
      created++;
      lists[to] = [
        ...lists[to],
        record(
          `new-${created}`,
          `New ${created}`,
          newNode.x,
          newNode.y,
        ),
      ];
    }
    this.lists = lists;
  };

  // also fires on the source grid of a cross-grid drop; only a trashed
  // element is still inside its own grid
  onRemoved = (event, nodes) => {
    const grid = this.gridStackRegistry.find(event.target);
    const key = this.keyOf(grid);
    const gone = nodes
      .filter((n) => this.gridStackRegistry.find(n.el) === grid)
      .map((n) => n.id);
    if (!gone.length) return;
    this.lists = {
      ...this.lists,
      [key]: this.lists[key].filter((r) => !gone.includes(r.id)),
    };
  };

  <template>
    <div class="template-drops">
      <div class="data-mode-grids">
        <GridStack
          class="data-mode-grid"
          aria-label="Left grid"
          @name="drops-left"
          @options={{OPTIONS}}
          @onDropped={{this.onDropped}}
          @onRemoved={{this.onRemoved}}
          as |grid|
        >
          {{#each this.lists.left key="id" as |r|}}
            <grid.Item @options={{r.options}} as |item|>
              <Counter @item={{item}} @label={{r.label}} />
            </grid.Item>
          {{/each}}
        </GridStack>
        <GridStack
          class="data-mode-grid"
          aria-label="Right grid"
          @name="drops-right"
          @options={{OPTIONS}}
          @onDropped={{this.onDropped}}
          @onRemoved={{this.onRemoved}}
          as |grid|
        >
          {{#each this.lists.right key="id" as |r|}}
            <grid.Item @options={{r.options}} as |item|>
              <Counter @item={{item}} @label={{r.label}} />
            </grid.Item>
          {{/each}}
        </GridStack>
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
        </div>
        <div class="data-mode-trash template-drops-trash">Drop to
          delete</div>
      </div>
    </div>
  </template>
}
