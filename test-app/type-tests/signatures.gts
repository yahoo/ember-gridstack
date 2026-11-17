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
  applyItemAttributes,
  type GridStackItemSignature,
  type GridStackLayoutSignature,
  type GsItemAttributesSignature,
} from 'ember-gridstack';
import DeepGridStack from 'ember-gridstack/components/grid-stack';
import DeepGridStackJs from 'ember-gridstack/components/grid-stack.js';
import DeepGridStackItem from 'ember-gridstack/components/grid-stack-item';
import DeepGridStackItemJs from 'ember-gridstack/components/grid-stack-item.js';
import DeepGridStackLayout from 'ember-gridstack/components/grid-stack-layout';
import DeepGridStackLayoutJs from 'ember-gridstack/components/grid-stack-layout.js';
import DeepGsItemAttributes from 'ember-gridstack/modifiers/gs-item-attributes';
import DeepGsItemAttributesJs from 'ember-gridstack/modifiers/gs-item-attributes.js';
import DeepRegistry from 'ember-gridstack/services/grid-stack-registry';
import DeepRegistryJs from 'ember-gridstack/services/grid-stack-registry.js';

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

// every documented deep path resolves to the root export's type, with and without .js
const sameGridStack: [typeof GridStack, typeof GridStack] = [
  DeepGridStack,
  DeepGridStackJs,
];
const sameItem: [typeof GridStackItem, typeof GridStackItem] = [
  DeepGridStackItem,
  DeepGridStackItemJs,
];
const sameLayout: [typeof GridStackLayout, typeof GridStackLayout] = [
  DeepGridStackLayout,
  DeepGridStackLayoutJs,
];
const sameModifier: [typeof gsItemAttributes, typeof gsItemAttributes] = [
  DeepGsItemAttributes,
  DeepGsItemAttributesJs,
];
const sameRegistry: [typeof GridStackRegistry, typeof GridStackRegistry] = [
  DeepRegistry,
  DeepRegistryJs,
];
export const deepPaths = [
  sameGridStack,
  sameItem,
  sameLayout,
  sameModifier,
  sameRegistry,
];

type ItemArgs = GridStackItemSignature['Args'];
export const itemArgs: ItemArgs = { options: { id: 'a', w: 2 } };
// @ts-expect-error options must be gridstack widget options
export const badItemArgs: ItemArgs = { options: { w: 'wide' } };
export const itemElement: GridStackItemSignature['Element'] =
  document.createElement('div');

type ModifierPositional = GsItemAttributesSignature['Args']['Positional'];
export const modifierArgs: ModifierPositional = [{ x: 1 }];
// @ts-expect-error at most one positional arg
export const badModifierArgs: ModifierPositional = [{ x: 1 }, { y: 2 }];

applyItemAttributes(document.body, { x: 1 }, { onlyRemovals: true });
// @ts-expect-error onlyRemovals is a boolean
applyItemAttributes(document.body, { x: 1 }, { onlyRemovals: 'yes' });

export const found: GridStack | GridStackLayout | undefined = registry.find(
  document.body,
);
export const named: GridStack | GridStackLayout | undefined =
  registry.get('board');
// @ts-expect-error find may return undefined
export const foundStrict: GridStack = registry.find(document.body);
// @ts-expect-error get takes a name
registry.get(1);

export const keepCtx: BeforeRemoveContext = {};
// @ts-expect-error unstable_keep is a function
export const badKeepCtx: BeforeRemoveContext = { unstable_keep: true };

declare const layoutGrid: GridStackLayout;
export const from: DroppedFrom = { grid: layoutGrid, state: 1 };
// @ts-expect-error a data-mode DroppedFrom comes from a layout grid
export const badFrom: DroppedFrom = { grid: registry, state: 1 };

export const widget: LayoutWidget = { id: 'a', component: 'note', props: {} };
// @ts-expect-error component is a name
export const badWidget: LayoutWidget = { component: Note };

declare const ctx: LayoutWidgetContext;
export const ctxGrid: GridStackLayout = ctx.grid;
export const ctxId: string = ctx.id;
// @ts-expect-error widget context is read-only
ctx.id = 'b';

export const layoutArgs: GridStackLayoutSignature['Args'] = {
  layout: [widget],
  components,
};
export const badLayoutArgs: GridStackLayoutSignature['Args'] = {
  // @ts-expect-error components map names to components
  components: { note: 'note' },
};

export const widgetArgs: WidgetComponentSignature['Args'] = {
  grid: layoutGrid,
  widget: ctx,
};
// @ts-expect-error a widget component needs its widget context
export const badWidgetArgs: WidgetComponentSignature['Args'] = {
  grid: layoutGrid,
};
// @ts-expect-error a widget component must be a component
export const badComponents: Record<string, WidgetComponent> = { note: 1 };
