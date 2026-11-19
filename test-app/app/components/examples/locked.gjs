import { hash } from '@ember/helper';
import GridStack from 'ember-gridstack/components/grid-stack';
import GridStackItem from 'ember-gridstack/components/grid-stack-item';

<template>
  <GridStack @options={{hash cellHeight=60 margin=6}}>
    <GridStackItem @options={{hash x=0 y=0 w=3 h=2 locked=true}}>
      <div class="widget">
        <div class="widget-label">locked</div>
        <p class="widget-body">Drop "drag me" here: I stay put.</p>
      </div>
    </GridStackItem>
    <GridStackItem @options={{hash x=3 y=0 w=3 h=2}}>
      <div class="widget">
        <div class="widget-label">not locked</div>
        <p class="widget-body">Drop "drag me" here: I get pushed down.</p>
      </div>
    </GridStackItem>
    <GridStackItem @options={{hash x=6 y=0 w=3 h=2 noMove=true}}>
      <div class="widget">
        <div class="widget-label">noMove</div>
        <p class="widget-body">Try to drag me. You can still resize
          me.</p>
      </div>
    </GridStackItem>
    <GridStackItem @options={{hash x=9 y=0 w=3 h=2 noResize=true}}>
      <div class="widget">
        <div class="widget-label">noResize</div>
        <p class="widget-body">No resize handle. You can still drag
          me.</p>
      </div>
    </GridStackItem>
    <GridStackItem @options={{hash x=0 y=2 w=3 h=1}}>
      <div class="widget">
        <div class="widget-label">drag me</div>
      </div>
    </GridStackItem>
  </GridStack>
</template>
