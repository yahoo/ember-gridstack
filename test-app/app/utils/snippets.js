export const install = `ember install ember-gridstack
# or
pnpm add -D ember-gridstack`;

export const demo = `<GridStack
  @options={{hash float=this.shouldFloat cellHeight=80}}
  @onChange={{this.logChange}}
>
  <GridStackItem @options={{hash x=0 y=0 w=3 h=2}}>
    <StatWidget @label="Requests / min" @value="12,480" />
  </GridStackItem>

  {{#each this.items as |item|}}
    <GridStackItem @options={{hash w=3 h=2}}>
      <button type="button" {{on "click" (fn this.removeItem item)}}>
        Remove
      </button>
    </GridStackItem>
  {{/each}}
</GridStack>`;

export const templateTag = `import GridStack from 'ember-gridstack/components/grid-stack';
import GridStackItem from 'ember-gridstack/components/grid-stack-item';

<template>
  <GridStack @options={{hash cellHeight=80}}>
    <GridStackItem @options={{hash w=4 h=2 minW=2}}>
      Widget content
    </GridStackItem>
  </GridStack>
</template>`;

export const gridStack = `<GridStack
  @options={{hash column=12 float=true animate=true}}
  @onDragstop={{this.saveLayout}}
  @onResizestop={{this.saveLayout}}
  as |grid|
>
  {{! grid.gridStack is the gridstack.js GridStack instance }}
</GridStack>`;

export const gridStackItem = `<GridStackItem
  @options={{hash x=0 y=0 w=4 h=2 minW=2 maxW=6 noResize=false}}
  as |item|
>
  {{! item.elm is the .grid-stack-item element }}
</GridStackItem>`;

export const modifier = `{{! Sets gs-* attributes from camelCase options }}
<div {{gs-item-attributes (hash w=4 minW=2)}}></div>
{{! renders <div gs-w="4" gs-min-w="2"> }}`;

export const service = `import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class Toolbar extends Component {
  @service gridStackRegistry;

  get grid() {
    // closest GridStack component for an element inside a grid
    return this.gridStackRegistry.findGridComponent(this.args.element);
  }
}`;
