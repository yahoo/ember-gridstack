export const install = `ember install ember-gridstack
# or
pnpm add -D ember-gridstack`;

export const demo = `import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { hash, fn } from '@ember/helper';
import { on } from '@ember/modifier';
import GridStack from
  'ember-gridstack/components/grid-stack';
import GridStackItem from
  'ember-gridstack/components/grid-stack-item';

export default class Demo extends Component {
  @tracked items = [];
  @tracked mode = 'float'; // 'top' | 'float' | 'list' | 'compact'
  @tracked events = [];

  @action log(name, event) {
    this.events = [name, ...this.events].slice(0, 8);
  }

  @action remove(item) {
    this.items = this.items.filter(
      (i) => i !== item,
    );
  }

  <template>
    <GridStack
      @options={{hash
        mode=this.mode
        cellHeight=80
      }}
      @onChange={{fn this.log "change"}}
    >
      <GridStackItem
        @options={{hash x=0 y=0 w=3 h=2}}
      >
        <StatWidget @label="Requests" />
      </GridStackItem>

      {{#each this.items as |item|}}
        <GridStackItem
          @options={{hash w=3 h=2}}
        >
          <button
            type="button"
            {{on "click" (fn this.remove item)}}
          >Remove</button>
        </GridStackItem>
      {{/each}}
    </GridStack>
  </template>
}`;

export const demoClassic = `<GridStack
  @options={{hash
    mode=this.mode
    cellHeight=80
  }}
  @onChange={{fn this.log "change"}}
>
  <GridStackItem
    @options={{hash x=0 y=0 w=3 h=2}}
  >
    <StatWidget @label="Requests" />
  </GridStackItem>

  {{#each this.items as |item|}}
    <GridStackItem @options={{hash w=3 h=2}}>
      <button
        type="button"
        {{on "click" (fn this.remove item)}}
      >Remove</button>
    </GridStackItem>
  {{/each}}
</GridStack>`;

export const templateTag = `import { hash } from '@ember/helper';
import GridStack from
  'ember-gridstack/components/grid-stack';
import GridStackItem from
  'ember-gridstack/components/grid-stack-item';

<template>
  <GridStack @options={{hash cellHeight=80}}>
    <GridStackItem
      @options={{hash w=4 h=2 minW=2}}
    >
      Widget content
    </GridStackItem>
  </GridStack>
</template>`;

export const gridStack = `<GridStack
  @options={{hash
    column=12
    mode="float"
    animate=true
  }}
  @onDragstop={{this.saveLayout}}
  @onResizestop={{this.saveLayout}}
  as |grid|
>
  {{! grid.gridStack: gridstack.js instance }}
</GridStack>`;

export const gridStackItem = `<GridStackItem
  @options={{hash
    x=0 y=0 w=4 h=2
    minW=2 maxW=6
    noResize=false
  }}
  as |item|
>
  {{! item.elm: the .grid-stack-item element }}
</GridStackItem>`;

export const modifier = `{{! Sets gs-* attributes from options }}
<div {{gs-item-attributes (hash w=4 minW=2)}}>
</div>
{{! renders <div gs-w="4" gs-min-w="2"> }}`;

export const service = `import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class Toolbar extends Component {
  @service gridStackRegistry;

  get grid() {
    // closest GridStack for an element in a grid
    return this.gridStackRegistry
      .findGridComponent(this.args.element);
  }
}`;
