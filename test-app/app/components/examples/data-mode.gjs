import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { hash } from '@ember/helper';
import { on } from '@ember/modifier';
import GridStack from 'ember-gridstack/components/grid-stack';

// Data mode (spike): gridstack owns the items, built from @layout (the
// React/Vue wrapper JSON); Ember renders each widget's content.
const Note = <template>
  <div class="widget"><div
      class="widget-label"
    >{{@props.text}}</div></div>
</template>;

const LAYOUT = [
  { id: 'chart', x: 0, y: 0, w: 6, h: 2, component: 'chart' },
  {
    id: 'note',
    x: 6,
    y: 0,
    w: 6,
    h: 2,
    component: 'note',
    props: { text: 'Rendered by @components' },
  },
];

export default class DataMode extends Component {
  @tracked saved = null;
  components = { note: Note };
  grid = null;

  get json() {
    return this.saved
      ? JSON.stringify(this.saved, null, 1)
      : 'Not saved yet';
  }

  @action register(grid) {
    this.grid = grid;
  }

  @action save() {
    this.saved = this.grid.save();
  }

  @action load() {
    if (this.saved) this.grid.load(this.saved);
  }

  @action add() {
    this.grid.addWidget({
      w: 3,
      h: 1,
      component: 'note',
      props: { text: 'Added' },
    });
  }

  <template>
    <div class="toolbar">
      <button type="button" class="button" {{on "click" this.add}}>
        Add note
      </button>
      <button type="button" class="button" {{on "click" this.save}}>
        Save
      </button>
      <button
        type="button"
        class="button button-quiet"
        disabled={{if this.saved false true}}
        {{on "click" this.load}}
      >Load</button>
    </div>
    <GridStack
      @options={{hash cellHeight=60 margin=6}}
      @layout={{LAYOUT}}
      @components={{this.components}}
      as |widget grid|
    >
      {{this.register grid}}
      {{! yielded block: used for widgets without a @components entry }}
      <div class="widget">
        <div class="widget-label">{{widget.component}}
          (yielded block)</div>
      </div>
    </GridStack>
    <pre class="code saved-json"><code>{{this.json}}</code></pre>
  </template>
}
