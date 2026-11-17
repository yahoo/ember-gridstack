// Type-checked by `pnpm lint:types`; never built or run.
import Component from '@glimmer/component';
import type Owner from '@ember/owner';
import type { TemplateOnlyComponent } from '@ember/component/template-only';
import { fn, hash } from '@ember/helper';
import { on } from '@ember/modifier';
import {
  GridStack,
  GridStackItem,
  GridStackLayout,
  GridStackRegistry,
  gsItemAttributes,
  GRID_STACK_EVENTS,
  type BeforeRemoveContext,
  type DroppedFrom,
  type GridStackSignature,
  type LayoutWidget,
  type LayoutWidgetContext,
  type WidgetComponent,
  type WidgetComponentSignature,
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
  <GridStack
    @name="sidebar"
    @options={{hash acceptWidgets=true}}
    @onDropped={{onDroppedTemplate}}
  >
    <GridStackItem @options={{hash id="x"}} as |item|>
      {{counted item}}
    </GridStackItem>
  </GridStack>
  <GridStack
    @name="board"
    @layout={{layout}}
    @components={{components}}
    @onDropped={{onDropped}}
  />
  <GridStackLayout @name="direct" @layout={{layout}} as |widget grid|>
    {{keepOrCount widget}}
    {{widget.droppedFrom.grid.instance.el.id}}
    {{grid.instance.el.id}}
  </GridStackLayout>
</template>

class Note extends Component<WidgetComponentSignature> {
  count: number;

  constructor(owner: Owner, args: WidgetComponentSignature['Args']) {
    super(owner, args);
    const from: DroppedFrom | undefined = args.widget.droppedFrom;
    this.count = typeof from?.state === 'number' ? from.state : 0;
    const off: () => void = args.widget.beforeRemove(
      ({ unstable_keep }) => unstable_keep?.() ?? this.count,
    );
    off();
  }
}

const Label: TemplateOnlyComponent<WidgetComponentSignature> = <template>
  {{@widget.id}}
</template>;
const components: Record<string, WidgetComponent> = {
  note: Note,
  label: Label,
};
const layout: LayoutWidget[] = [{ id: 'a', component: 'note', props: {} }];
const keepOrCount = (widget: LayoutWidgetContext): void => {
  widget.beforeRemove((ctx: BeforeRemoveContext) => ctx.unstable_keep?.());
};

declare const registry: GridStackRegistry;
const onDroppedTemplate: Args['onDropped'] = (_event, previousNode, next) => {
  const from = registry.find(previousNode?.grid);
  const to = registry.find(next.el) ?? registry.get('board');
  return [from?.instance, to?.save()];
};
const counted = (item: GridStackItem): number => {
  const off: () => void = item.beforeRemove(() => 1);
  off();
  const grid = item.droppedFrom?.grid;
  grid?.instance?.el.id;
  return typeof item.droppedFrom?.state === 'number'
    ? item.droppedFrom.state
    : 0;
};
