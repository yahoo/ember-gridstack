import { hash, array } from '@ember/helper';
import GridStack from 'ember-gridstack/components/grid-stack';
import GridStackItem from 'ember-gridstack/components/grid-stack-item';

const widgets = [
  { id: 'a', x: 0 },
  { id: 'b', x: 3 },
  { id: 'c', x: 6 },
  { id: 'd', x: 9 },
];

// The column count follows the grid's own width:
// 1 column up to 700px, 6 up to 1000px, otherwise 12.
<template>
  <GridStack
    @options={{hash
      cellHeight=60
      margin=6
      columnOpts=(hash
        breakpoints=(array (hash w=700 c=1) (hash w=1000 c=6)) columnMax=12
      )
    }}
  >
    {{#each widgets as |widget|}}
      <GridStackItem @options={{hash id=widget.id x=widget.x y=0 w=3 h=1}}>
        <div class="widget">
          <div class="widget-label">Widget {{widget.id}}</div>
        </div>
      </GridStackItem>
    {{/each}}
  </GridStack>
</template>
