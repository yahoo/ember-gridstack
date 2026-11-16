import { hash } from '@ember/helper';
import GridStack from 'ember-gridstack/components/grid-stack';
import GridStackItem from 'ember-gridstack/components/grid-stack-item';

// A <GridStack> inside a <GridStackItem> is its own grid; inner items
// register with the closest grid.
<template>
  <GridStack @options={{hash cellHeight=60 margin=6}}>
    <GridStackItem @options={{hash x=0 y=0 w=8 h=3}}>
      <div class="widget nested-host">
        <div class="widget-label">Nested grid</div>
        <GridStack
          class="nested-grid"
          @options={{hash cellHeight=40 margin=4 column=4}}
        >
          <GridStackItem @options={{hash x=0 y=0 w=2 h=1}}>
            <div class="widget">
              <div class="widget-label">Inner 1</div>
            </div>
          </GridStackItem>
          <GridStackItem @options={{hash x=2 y=0 w=2 h=1}}>
            <div class="widget">
              <div class="widget-label">Inner 2</div>
            </div>
          </GridStackItem>
        </GridStack>
      </div>
    </GridStackItem>
    <GridStackItem @options={{hash x=8 y=0 w=4 h=2}}>
      <div class="widget"><div class="widget-label">Outer</div></div>
    </GridStackItem>
  </GridStack>
</template>
