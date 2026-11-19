import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { hash } from '@ember/helper';
import { on } from '@ember/modifier';
import GridStack from 'ember-gridstack/components/grid-stack';
import GridStackItem from 'ember-gridstack/components/grid-stack-item';

// save(false) returns positions only (no content); load() moves the
// Ember-rendered items back by their `id`.
export default class SaveLoad extends Component {
  @tracked saved = null;
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
    this.saved = this.grid.gridStack.save(false);
  }

  @action load() {
    if (this.saved) this.grid.gridStack.load(this.saved);
  }

  <template>
    <div class="toolbar">
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
    <GridStack @options={{hash cellHeight=60 margin=6}} as |grid|>
      {{this.register grid}}
      <GridStackItem @options={{hash id="one" x=0 y=0 w=4 h=1}}>
        <div class="widget"><div class="widget-label">one</div></div>
      </GridStackItem>
      <GridStackItem @options={{hash id="two" x=4 y=0 w=4 h=1}}>
        <div class="widget"><div class="widget-label">two</div></div>
      </GridStackItem>
      <GridStackItem @options={{hash id="three" x=8 y=0 w=4 h=1}}>
        <div class="widget">
          <div class="widget-label">three</div>
        </div>
      </GridStackItem>
    </GridStack>
    <pre class="code saved-json"><code>{{this.json}}</code></pre>
  </template>
}
