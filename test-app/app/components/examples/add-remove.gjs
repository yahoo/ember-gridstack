import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { hash, fn } from '@ember/helper';
import { on } from '@ember/modifier';
import GridStack from 'ember-gridstack/components/grid-stack';
import GridStackItem from 'ember-gridstack/components/grid-stack-item';

// Items come from a tracked array; gridstack picks up new
// <GridStackItem>s and forgets removed ones.
export default class AddRemove extends Component {
  @tracked items = [{ id: 1 }, { id: 2 }];
  nextId = 3;

  @action add() {
    this.items = [...this.items, { id: this.nextId++ }];
  }

  @action remove(item) {
    this.items = this.items.filter((i) => i !== item);
  }

  <template>
    <div class="toolbar">
      <button type="button" class="button" {{on "click" this.add}}>
        Add widget
      </button>
    </div>
    <GridStack @options={{hash cellHeight=60 margin=6}}>
      {{#each this.items as |item|}}
        <GridStackItem @options={{hash w=3 h=2}}>
          <div class="widget">
            <div class="widget-label">Widget {{item.id}}</div>
            <button
              type="button"
              class="button button-quiet"
              {{on "click" (fn this.remove item)}}
            >Remove</button>
          </div>
        </GridStackItem>
      {{/each}}
    </GridStack>
  </template>
}
