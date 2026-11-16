import { hash } from '@ember/helper';
import GridStack from 'ember-gridstack/components/grid-stack';
import GridStackItem from 'ember-gridstack/components/grid-stack-item';

// cellHeight: 'fill' divides the grid's height into `row` rows,
// so the layout always fills its (fixed-height) container.
<template>
  <div class="fill-frame">
    <GridStack
      class="fill-grid"
      @options={{hash cellHeight="fill" row=3 margin=6 mode="float"}}
    >
      <GridStackItem @options={{hash x=0 y=0 w=4 h=3}}>
        <div class="widget"><div class="widget-label">3 rows</div></div>
      </GridStackItem>
      <GridStackItem @options={{hash x=4 y=0 w=8 h=1}}>
        <div class="widget"><div class="widget-label">1 row</div></div>
      </GridStackItem>
      <GridStackItem @options={{hash x=4 y=1 w=8 h=2}}>
        <div class="widget"><div class="widget-label">2 rows</div></div>
      </GridStackItem>
    </GridStack>
  </div>
</template>
