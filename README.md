# ember-gridstack [![CI][ci-badge]][ci-badge-url] [![Latest NPM release][npm-badge]][npm-badge-url] [![Ember Observer Score][ember-observer-badge]][ember-observer-badge-url]

Ember components to build drag-and-drop multi-column grids powered by [gridstack.js](https://gridstackjs.com/)

## Compatibility

- Ember.js (`ember-source`) v4.12 or above
- Build setups: Vite + Embroider, or classic ember-cli with ember-auto-import v2 or above (no Embroider required)
- gridstack.js v14
- Node.js v20.19 or above
- Published as a v2 (Embroider) addon
- Tested against Ember 4.12, 5.12, 6.12 (LTS), release and beta, in a Vite + Embroider app; classic ember-cli + ember-auto-import v2 build checked in CI

## Installation

```
ember install ember-gridstack
```

or add it with your package manager, e.g. `pnpm add -D ember-gridstack` or `npm install -D ember-gridstack`.

## Migrating to 6.0

- ember-gridstack is now a v2 (Embroider) addon. Your app needs `ember-source` >= 4.12 and ember-auto-import >= 2 (or Embroider).
- gridstack is a regular dependency that your app's bundler resolves; it is no longer copied into the vendor tree.
- `gridstack/dist/gridstack.css` is imported by the addon automatically, so remove any manual import of it.
- gridstack.js goes from 12 to 14. See the [gridstack.js changelog](https://github.com/gridstack/gridstack.js/blob/master/doc/CHANGES.md).
- `float` is replaced by `mode` (`'top'`, `'float'`, `'list'` or `'compact'`). Legacy `float: true` is migrated to `mode: 'float'` automatically, but use `mode` in new code. `save()` now writes `mode`, not `float`.
- `update()` (and so changing a `<GridStackItem>`'s `@options`) may refuse a move onto a locked item or past `maxRow`. The item then stays where it was.
- Changed `@options` are applied in place with `updateOptions()` instead of re-creating the grid. Only the options listed under [Options](#options) re-create it.
- DOM order is owned by Ember: the addon turns off gridstack's re-sorting of `.grid-stack-item` elements, so `{{#each}}` keeps working after items move. Tab order follows your template, not the visual layout.
- New `@onResizecontent` action.
- Contextual components: `<GridStack as |grid|>` yields `grid.Item`, a `<GridStackItem>` bound to that grid. Plain `<GridStackItem>` still works and joins the closest `<GridStack>`.
- No generated element ids: grids are found through their element, so you can set your own `id` on `<GridStack>` and `<GridStackItem>`.
- `item.element` is `undefined` until the item is inserted.
- Event delivery is no longer coalesced: every gridstack event reaches its `@on*` action, in order, with its own arguments, even several in one run loop.
- The `grid-stack-registry` service finds grids by element, GridStack instance or `@name` (`find`, `get`). `registerGrid`, `findGridComponent` and `unregisterGridComponent` are removed; use `registry.find(element)` or `registry.get(name)`.
- A grid no longer finds its `<GridStackItem>`s through the registry by element id; items resolve their grid from the DOM.
- A cross-grid drop whose `id` already exists in the target grid is refused, with a dev warning (`ember-gridstack.drop-id-collision`).
- An item dropped on another grid (`acceptWidgets`) is now removed from the source and created fresh in the target by your `@onDropped`; a grid with `acceptWidgets` and no `@onDropped` refuses drops. See [Cross-grid drops](#cross-grid-drops-template-mode).
- `@ember/render-modifiers` is no longer a dependency. Add it to your app yourself if you used it through this addon.
- `package.json` has an `exports` map. The public import paths are the package root and `components/*`, `modifiers/*` and `services/*` (with or without `.js`). Other paths such as `utils/*` still resolve, but they are private and can change in any release.
- New root named exports: `import { GridStack, GridStackItem, gsItemAttributes, GridStackRegistry, GRID_STACK_EVENTS } from 'ember-gridstack'`.
- TypeScript / Glint types ship in `declarations/`: `GridStackSignature`, `GridStackItemSignature`, `GsItemAttributesSignature`. They change nothing for JavaScript users.
- The yielded grid and item have new members, see [Yields](#yields).

## Migrating to v5

View the full [v5.0.0 release notes](./CHANGELOG.md#500-2025-05-22) for updates and breaking changes.

## Basic Usage

```hbs
<GridStack @options={{hash mode='float'}} @onChange={{this.change}} as |grid|>
  <grid.Item @options={{hash x=0 y=0 w=6 h=2}}>
    Widget #1
  </grid.Item>
  <grid.Item @options={{hash x=6 y=0 w=6 h=2}}>
    Widget #2
  </grid.Item>
</GridStack>
```

### Template tag (`.gjs` / `.gts`)

```gjs
import { hash } from '@ember/helper';
import { GridStack } from 'ember-gridstack';

<template>
  <GridStack @options={{hash mode='float'}} @onChange={{@onChange}} as |grid|>
    <grid.Item @options={{hash x=0 y=0 w=6 h=2}}>
      Widget #1
    </grid.Item>
  </GridStack>
</template>
```

`<GridStackItem>` without the contextual form still works and joins the closest `<GridStack>`. See [Exports](#exports) for every import path.

A live demo with every component, the modifier and the service is at https://yahoo.github.io/ember-gridstack/.

## Components

### `<GridStack>`

Used to construct a grid-stack layout

#### Args

| Arg        | Type               | Description                                                     |
| ---------- | ------------------ | --------------------------------------------------------------- |
| `@options` | `GridStackOptions` | gridstack grid options, see [Options](#options)                 |
| `@name`    | `string`           | registers the grid with `gridStackRegistry.get(name)`           |
| `@on*`     | function per event | one action per gridstack event, see [Events](#events)           |
| attributes | `HTMLDivElement`   | `...attributes` go on the `.grid-stack` element (`id` is yours) |

#### Options

`@options` is passed through to `GridStack.init()`; every gridstack grid option is valid.

**Example:**

```hbs
<GridStack @options={{hash mode='float' column=12 maxRow=10}}>
  ...
</GridStack>
```

When `@options` changes, the changed keys go to `gridStack.updateOptions()` and the instance is kept. These options can't be applied that way. Changing one of them, or removing any option, destroys and re-creates the instance (the list is exported as `REINIT_OPTIONS` from `ember-gridstack/components/grid-stack`):

`alwaysShowResizeHandle`, `draggable`, `handle`, `handleClass`, `itemClass`, `layout`, `placeholderClass`, `placeholderText`, `resizable`, `removable`, `children`, `disableOneColumnMode`, `marginTop`, `marginRight`, `marginBottom`, `marginLeft`, `marginUnit`.

DOM order is owned by Ember: the addon disables gridstack's `_sortDom()` on its own instances, so the `.grid-stack-item` elements stay in template order whatever the visual layout.

The full list of options can be found here: https://github.com/gridstack/gridstack.js/tree/master/doc#grid-options

#### Events

All 13 gridstack events can be handled as Ember actions. They take the form `on{Eventname}`, run after render, and are read when the event fires, so changing an `@on*` argument needs no re-init. Every event is delivered, in order, with its own arguments.

| Event           | Action             | Arguments                    |
| --------------- | ------------------ | ---------------------------- |
| `added`         | `@onAdded`         | `(event, nodes)`             |
| `change`        | `@onChange`        | `(event, nodes)`             |
| `removed`       | `@onRemoved`       | `(event, nodes)`             |
| `enable`        | `@onEnable`        | `(event)`                    |
| `disable`       | `@onDisable`       | `(event)`                    |
| `dragstart`     | `@onDragstart`     | `(event, element)`           |
| `drag`          | `@onDrag`          | `(event, element)`           |
| `dragstop`      | `@onDragstop`      | `(event, element)`           |
| `resizestart`   | `@onResizestart`   | `(event, element)`           |
| `resize`        | `@onResize`        | `(event, element)`           |
| `resizestop`    | `@onResizestop`    | `(event, element)`           |
| `resizecontent` | `@onResizecontent` | `(event, nodes)`             |
| `dropped`       | `@onDropped`       | `(event, previous, newNode)` |

**Example:**

```hbs
<GridStack
  @onAdded={{this.added}}
  @onChange={{this.change}}
  @onDisable={{this.disabled}}
  @onDragstart={{this.dragStart}}
  @onDrag={{this.drag}}
  @onDragstop={{this.dragStop}}
  @onDropped={{this.dropped}}
  @onEnable={{this.enabled}}
  @onRemoved={{this.removed}}
  @onResizestart={{this.resizeStart}}
  @onResize={{this.resize}}
  @onResizestop={{this.resizeStop}}
  @onResizecontent={{this.resizeContent}}
>
```

The full list of events can found here: https://github.com/gridstack/gridstack.js/tree/master/doc#events

#### Yields

`<GridStack as |grid|>` yields the component itself. Every method is bound, so it can be passed straight to `{{on}}` or `fn`. They do nothing (return `undefined`) before the grid is inserted.

| Member                                      | Description                                                                   |
| ------------------------------------------- | ----------------------------------------------------------------------------- |
| `grid.Item`                                 | `<GridStackItem>` bound to this grid                                          |
| `grid.instance`                             | the `GridStack` instance (`null` before insert / after destroy)               |
| `grid.compact(layout?, doSort?)`            | `GridStack.compact()`                                                         |
| `grid.save(saveContent?, saveGridOpt?, …)`  | `GridStack.save()`                                                            |
| `grid.load(layout, addRemove?)`             | `GridStack.load()`                                                            |
| `grid.enableMove(doEnable, recurse?)`       | `GridStack.enableMove()`                                                      |
| `grid.enableResize(doEnable, recurse?)`     | `GridStack.enableResize()`                                                    |
| `grid.setMode(mode)`                        | `GridStack.mode()`: `'top'`, `'float'`, `'list'` or `'compact'`               |
| `grid.removeAll(removeDOM?, triggerEvent?)` | `GridStack.removeAll()`; `removeDOM` defaults to `false` (Ember owns the DOM) |

**Example:**

```hbs
<GridStack as |grid|>
  <button type='button' {{on 'click' (fn grid.compact 'list')}}>Compact</button>
  <grid.Item @options={{hash x=0 y=0 w=6 h=2}}>
    Widget #1
  </grid.Item>
</GridStack>
```

### `<GridStackItem>`

Used to construct a grid item inside a `<GridStack>` component. Prefer the yielded `grid.Item`; a plain `<GridStackItem>` joins the closest `<GridStack>`.

#### Args

| Arg        | Type              | Description                                                          |
| ---------- | ----------------- | -------------------------------------------------------------------- |
| `@options` | `GridStackWidget` | gridstack item options (`x`, `y`, `w`, `h`, `minW`, `noMove`, …)     |
| attributes | `HTMLDivElement`  | `...attributes` go on the `.grid-stack-item` element (`id` is yours) |

#### Options

`<GridStackItem>` can take an `options` object attribute to configure the grid item. All gridstack item options are valid and take the form `gs-{option}`. However, when using `<GridStackItem>` the `gs` is omitted.

**Example:**

```hbs
<GridStackItem @options={{hash w=4 h=4 x=0 y=0 noMove=true}}>
  ...
</GridStackItem>
```

The full list of options can be found here: https://github.com/gridstack/gridstack.js/tree/master/doc#item-options

Changing `@options` calls `GridStack.update()` once; an option set to a blank value removes its `gs-*` attribute.

#### Yields

`<GridStackItem as |item|>` (and `<grid.Item as |item|>`) yields the component itself.

| Member                   | Description                                                                        |
| ------------------------ | ---------------------------------------------------------------------------------- |
| `item.element`           | the `.grid-stack-item` element; `undefined` until the item is inserted (tracked)   |
| `item.grid`              | the owning `<GridStack>` component                                                 |
| `item.resizeToContent()` | `GridStack.resizeToContent()` for this item (needs a child element in the content) |
| `item.beforeRemove(fn)`  | runs when a cross-grid drop claims the item; returns an unregister function        |
| `item.droppedFrom`       | `{ grid, state }` while the target renders a dropped item, else `undefined`        |

**Example:**

```hbs
<grid.Item @options={{hash x=0 y=0 w=6 h=2}} as |item|>
  <div>
    <button type='button' {{on 'click' item.resizeToContent}}>Fit</button>
  </div>
</grid.Item>
```

### Cross-grid drops (template mode)

Template mode follows data mode's rule: an item dropped into another grid is removed from the source and created fresh in the target. Ember owns the items, so your `@onDropped(event, previousNode, newNode)` on the target moves the record from one list to the other; the new `<GridStackItem>` is placed at the drop spot. Items need `@options.id`. To carry state over, return it from `item.beforeRemove(fn)`; the new item reads `item.droppedFrom.state` (and `droppedFrom.grid`, the source grid's yielded API) while it renders.

```gjs
// <GridStack @name="left"> and <GridStack @name="right">, lists keyed by name
@tracked lists = { left: [...], right: [...] };

// find() returns the same object the grid yields as `as |grid|`, which is
// also what get(name) returns, so compare them to map a grid to its list
keyOf = (grid) =>
  Object.keys(this.lists).find((name) => this.registry.get(name) === grid);

moveItem = (event, previousNode, newNode) => {
  const from = this.keyOf(this.registry.find(previousNode.grid));
  const to = this.keyOf(this.registry.find(newNode.grid));
  const record = this.lists[from].find((r) => r.id === newNode.id);
  this.lists = {
    ...this.lists,
    [from]: this.lists[from].filter((r) => r !== record),
    [to]: [...this.lists[to], record],
  };
};
```

- A grid with `acceptWidgets` and no `@onDropped`, or a dragged item without `@options.id`, refuses the drop (development warning).
- If `@onDropped` does not render the item in the target, it goes back to its source grid (development warning).
- Drag-in (`GridStack.setupDragIn`): `previousNode` is `undefined`; add a record built from `newNode` (`x`, `y`, `w`, `h`). gridstack's helper element is removed.
- Trash (`removable`): `@onRemoved` fires; remove the record and Ember removes the element. gridstack takes a drop on a removable trash when the item's centre is over it and the overlap covers at least half of the smaller of the two (item or trash). A long, thin bar much wider than your widgets can therefore never be hit; make the trash at least half as tall as your tallest widget, or no wider than about twice the widget.

### Data mode (`@layout`)

Pass `@layout` (or `@components`) to `<GridStack>` and gridstack builds the items from JSON, as in gridstack's React and Vue wrappers; Ember renders each widget's content into its `.grid-stack-item-content`.

```gjs
<GridStack
  @layout={{this.layout}}
  @components={{hash note=Note}}
  @options={{hash acceptWidgets=true}}
  as |widget grid|
>
  {{! rendered for widgets whose component has no @components entry }}
  {{widget.id}}
</GridStack>
```

#### Args

| Arg           | Type                              | Description                                                                                                                 |
| ------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `@layout`     | `LayoutWidget[]`                  | `{ id, x, y, w, h, component, props }` entries; changes are applied with `grid.load()` (see below)                          |
| `@components` | `Record<string, WidgetComponent>` | component per `component` name, invoked with `@props`, `@widget` and `@grid`; others use the yielded block                  |
| `@options`    | `GridStackOptions`                | as for `<GridStack>`; `children` is ignored when `@layout` is set                                                           |
| `@on*`        | handlers                          | the same 13 events as `<GridStack>`; `@onDropped(event, previousNode, newNode)` (`previousNode` is `undefined` for drag-in) |

#### `widget`

| Member                          | Description                                                                                         |
| ------------------------------- | --------------------------------------------------------------------------------------------------- |
| `widget.id`, `component`        | from the layout entry (ids are generated for drag-in specs without one)                             |
| `widget.props`, `widget.node`   | the entry's props and gridstack node (tracked)                                                      |
| `widget.element`                | the `.grid-stack-item` element; `contentElement` is its `.grid-stack-item-content`                  |
| `widget.grid`                   | the data-mode grid that owns the widget (tracked)                                                   |
| `widget.registerSerializer(fn)` | `fn()` returns props merged into this widget's `save()` output; returns an unregister function      |
| `widget.beforeRemove(fn)`       | `fn({ unstable_keep })` runs before a cross-grid drop; its return value is handed to the new widget |
| `widget.droppedFrom`            | `{ grid, state }` while a widget rebuilt by a cross-grid drop first renders, then `undefined`       |
| `widget.resizeToContent()`      | `GridStack.resizeToContent()` for this widget                                                       |

#### `grid`

`instance`, `addWidget(w)`, `removeWidget(idOrEl)`, `save()`, `load(layout)`, `compact()`, `enableMove()`, `enableResize()`, `setMode()`, `removeAll()`, as on the template-API `grid`.

#### Save and load

`grid.save()` returns the React/Vue schema `[{ id, x, y, w, h, component, props }]` (`w`/`h` of 1 are left out, no `content`), with each widget's serializer output merged into `props`. `beforeRemove` and `droppedFrom` are never saved. `grid.load(json)` takes the same list.

Replacing `@layout` calls `grid.load(layout)`, which diffs by `id`: an entry with an existing id is moved and resized in place and keeps its component instance and state, new ids are added, and ids that are missing are removed.

#### Moving widgets between grids

A widget dropped on another grid (`acceptWidgets`) is removed from the source grid and rebuilt in the target: its component is destroyed and a new instance is created with the same `id`, `component` and `props`. To carry state over, return it from `widget.beforeRemove(fn)`; the new instance reads it from `widget.droppedFrom.state` in its constructor, along with `widget.droppedFrom.grid`. `@onRemoved` fires on the source grid and `@onDropped` on the target.

```gjs
class Counter extends Component {
  @tracked count = this.args.widget.droppedFrom?.state ?? 0;

  constructor() {
    super(...arguments);
    this.args.widget.beforeRemove(() => this.count);
    this.args.widget.registerSerializer(() => ({ count: this.count }));
  }
}
```

**Unstable:** `beforeRemove` callbacks get `unstable_keep` while the source grid is still rendered. Returning `unstable_keep()` keeps the same component instance alive: the source grid keeps rendering it, the target owns it (`widget.grid`, `save()`), and when the source is destroyed the widget is rebuilt in the target with `droppedFrom.state` from a second `beforeRemove` call (`unstable_keep` is then `undefined`). This API may change.

#### Limits

- Nested grids (`subGridOpts`) are not supported in data mode yet and throw a development assertion; use `<GridStackItem>` for nesting.
- On a server render (FastBoot) the grid renders as an empty `<div class="grid-stack">` and fills in on the client.

### `{{gs-item-attributes}}`

Sets `gs-*` attributes from an options hash on any element (blank values remove the attribute):

```hbs
<div {{gs-item-attributes (hash w=4 minW=2)}}></div>
{{! renders <div gs-w="4" gs-min-w="2"> }}
```

### `grid-stack-registry` service

Finds the API a grid yields (`as |grid|`), in template and data mode:

- `find(target)`: `target` is any element inside a grid (or the `.grid-stack` itself) or a GridStack instance, e.g. `previousNode.grid` in `@onDropped`. Returns `undefined` when there is no rendered grid.
- `get(name)`: the grid rendered with `<GridStack @name="…">`; names are unique while rendered.

## Exports

| Import                                         | Exports                                                                                                                                                                                                                                                                                                                                                                         |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ember-gridstack`                              | `GridStack`, `GridStackItem`, `GridStackLayout`, `gsItemAttributes`, `applyItemAttributes`, `GridStackRegistry`, `GRID_STACK_EVENTS`; types `GridStackSignature`, `GridStackItemSignature`, `GsItemAttributesSignature`, `GridStackLayoutSignature`, `LayoutWidget`, `LayoutWidgetContext`, `WidgetComponent`, `WidgetComponentSignature`, `BeforeRemoveContext`, `DroppedFrom` |
| `ember-gridstack/components/grid-stack`        | default `GridStack`, `GRID_STACK_EVENTS`, `REINIT_OPTIONS`, `capitalize`                                                                                                                                                                                                                                                                                                        |
| `ember-gridstack/components/grid-stack-item`   | default `GridStackItem`                                                                                                                                                                                                                                                                                                                                                         |
| `ember-gridstack/components/grid-stack-layout` | default `GridStackLayout` (data mode; `<GridStack @layout>` renders it)                                                                                                                                                                                                                                                                                                         |
| `ember-gridstack/modifiers/gs-item-attributes` | default modifier, `applyItemAttributes(element, options)`                                                                                                                                                                                                                                                                                                                       |
| `ember-gridstack/services/grid-stack-registry` | default service class (`find`, `get`)                                                                                                                                                                                                                                                                                                                                           |

Each deep path also resolves with a `.js` suffix. Types ship in `declarations/` and are picked up through `exports`.

## Touch Support

For touch support do the following

### ember-grid-stack < 2.x

By default, the [bower dependencies for Gridstack](https://github.com/troolee/gridstack.js#requirements)
will be installed automatically.

[ci-badge]: https://github.com/yahoo/ember-gridstack/actions/workflows/ci.yml/badge.svg?branch=main
[ci-badge-url]: https://github.com/yahoo/ember-gridstack/actions/workflows/ci.yml
[npm-badge]: https://img.shields.io/npm/v/ember-gridstack.svg
[npm-badge-url]: https://www.npmjs.com/package/ember-gridstack
[ember-observer-badge]: https://emberobserver.com/badges/ember-gridstack.svg
[ember-observer-badge-url]: https://emberobserver.com/addons/ember-gridstack
