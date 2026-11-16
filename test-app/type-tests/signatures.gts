// Type-checked by `pnpm lint:types`; never built or run.
import { fn, hash } from '@ember/helper';
import { on } from '@ember/modifier';
import {
  GridStack,
  GridStackItem,
  gsItemAttributes,
  GRID_STACK_EVENTS,
  type GridStackSignature,
} from 'ember-gridstack';

type Args = GridStackSignature['Args'];

const onAdded: Args['onAdded'] = (_event, nodes) => nodes.length;
const onDragstop: Args['onDragstop'] = (_event, el) => el.gridstackNode;
const onDropped: Args['onDropped'] = (_event, _prev, next) => next.x;
const events: string[] = GRID_STACK_EVENTS;

<template>
  {{events.length}}
  <GridStack
    class="dashboard"
    @options={{hash column=12 mode="float"}}
    @onAdded={{onAdded}}
    @onDragstop={{onDragstop}}
    @onDropped={{onDropped}}
    as |grid|
  >
    <grid.Item @options={{hash x=0 y=0 w=2}} as |item|>
      <button type="button" {{on "click" item.resizeToContent}}>fit</button>
    </grid.Item>
    <GridStackItem id="card" @options={{hash minW=1}} />
    <button
      type="button"
      {{on "click" (fn grid.compact "list" true)}}
    >compact</button>
    {{grid.instance.el.id}}
  </GridStack>
  <div {{gsItemAttributes (hash x=1 y=2)}}></div>
</template>
