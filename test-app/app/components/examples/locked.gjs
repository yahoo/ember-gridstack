import { hash } from '@ember/helper';
import GridStack from 'ember-gridstack/components/grid-stack';
import GridStackItem from 'ember-gridstack/components/grid-stack-item';

// locked: other widgets can't push it. noMove / noResize: the user
// can't drag / resize it.
<template>
  <GridStack @options={{hash cellHeight=60 margin=6}}>
    <GridStackItem @options={{hash x=0 y=0 w=4 h=2 locked=true}}>
      <div class="widget"><div class="widget-label">locked</div></div>
    </GridStackItem>
    <GridStackItem @options={{hash x=4 y=0 w=4 h=2 noMove=true}}>
      <div class="widget"><div class="widget-label">noMove</div></div>
    </GridStackItem>
    <GridStackItem @options={{hash x=8 y=0 w=4 h=2 noResize=true}}>
      <div class="widget">
        <div class="widget-label">noResize</div>
      </div>
    </GridStackItem>
    <GridStackItem @options={{hash x=0 y=2 w=4 h=1}}>
      <div class="widget"><div class="widget-label">free</div></div>
    </GridStackItem>
  </GridStack>
</template>
