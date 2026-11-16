# Spike: data mode ("wrapper parity")

Can ember-gridstack offer the same data-driven API as gridstack's official
React and Vue wrappers (gridstack 14.1.0, `dist/react`, `dist/vue`)? In those
wrappers gridstack creates and owns the item elements from a JSON layout and
the framework renders each widget's content into them.

This spike adds that as a second mode of `<GridStack>`. The template API
(`<GridStack><GridStackItem/></GridStack>`) does not change.

```hbs
<GridStack
  @layout={{this.layout}}
  @components={{this.components}}
  as |widget grid|
>
  <MyWidget @props={{widget.props}} />
</GridStack>
```

Sources: `ember-gridstack/src/components/grid-stack-layout.gjs`,
`ember-gridstack/src/utils/layout-callbacks.js` (a port of
`gridstack/dist/react/registry.js`), the mode switch in `grid-stack.gjs`.
Tests: `test-app/tests/integration/components/grid-stack-layout-test.gjs`,
`grid-stack-layout-dnd-test.gjs`, `grid-stack-template-api-limits-test.gjs`.
Demo: the "Data mode (@layout, spike)" example in the test-app.

## What works and what doesn't

All of these are covered by passing tests:

| Scenario                                                  | Data mode                                                                                                    |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Render from `@layout` (or `@options.children`)            | works                                                                                                        |
| `grid.addWidget(json)` / `grid.removeWidget(id)`          | works                                                                                                        |
| `save()` → `load()` round trip                            | works. `save()` emits `{id,x,y,w,h,component,props}`                                                         |
| React and Vue README JSON, loaded unmodified              | works. `save()` returns exactly the input                                                                    |
| `widget.registerSerializer(fn)`                           | its result is merged into `save().props`, and a re-created widget gets it back via `load()`                  |
| Drag inside a grid                                        | DOM order follows visual order (`_sortDom` stays on). Component state kept                                   |
| Drag to another grid (`acceptWidgets`)                    | works, but the component is **re-created** (see below)                                                       |
| `GridStack.setupDragIn` with `[{component, props}]` specs | works. Gets a synthetic id `gs-ember-N`                                                                      |
| `removable: '#trash'`                                     | works. Component `willDestroy` runs, the record is dropped, nothing left in the content element              |
| `lazyLoad: true`                                          | content renders only after the IntersectionObserver fires (tested with a fake observer that fires on demand) |
| `sizeToContent` + `widget.resizeToContent()`              | `node.h` grows after the content grows                                                                       |

### Core finding: cross-grid moves re-create the component

When a widget is dropped from grid A into grid B, gridstack moves the same
`.grid-stack-item` element. On B's `added` event, B takes over the widget
record: it is removed from A's `widgets`, added to B's, and
`_gridItemRef.gridComp` is set to B. The **same record object** is reused,
and so is the same `contentElement`.

Glimmer still tears down A's `{{#each}}` row and renders a new row in B. The
widget component is destroyed and constructed again in the new grid. The
test checks this: `created` goes 2 → 3, `destroyed` 0 → 1, and the content is
rendered exactly once.

- What is lost: the component's own `@tracked` fields. The counter goes back to 0.
- What survives: anything on the record, in particular `widget.state` (a
  plain object on the record; the counter kept in it is still 2), `widget.props`
  and serializer output saved before the move.

So apps must keep state that has to survive a cross-grid move in
`widget.state`, in `props` (plus a serializer), or in a service. The React wrapper transfers ownership the same way (`dist/react/gridstack.js` `addedHandler`); whether its portal remounts was not verified here.

## API

### `<GridStack>` args in data mode

Data mode is on when `@layout` or `@components` is passed and not `undefined`
(an empty array counts).

| Arg           | Description                                                                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `@layout`     | initial `GridStackWidget[]` with `component` / `props`. Read once at init, like React's `options.children`. Change the layout later with `grid.load()` |
| `@options`    | gridstack options. `children` is used if `@layout` is missing. Later changes go to `updateOptions()` (except `children`)                               |
| `@components` | optional `{ name: Component }`. A widget whose `component` is in the map renders `<C @props @grid @widget />`                                          |
| `@on*`        | the same 13 events as the template API (`GRID_STACK_EVENTS`), delivered after render                                                                   |

`...attributes` go to the `.grid-stack` element. No id is generated.

### Yield `|widget grid|`

The yielded block is the primary form. It renders inside each widget's
`.grid-stack-item-content` for every widget that has no `@components` entry.

`widget`:

| Member                      | Description                                                                                        |
| --------------------------- | -------------------------------------------------------------------------------------------------- |
| `id`, `component`, `props`  | from the JSON. `props` is tracked and refreshed from `updateCB`                                    |
| `node`                      | gridstack node (tracked)                                                                           |
| `element`, `contentElement` | `.grid-stack-item` and `.grid-stack-item-content`                                                  |
| `state`                     | plain object that survives cross-grid moves                                                        |
| `registerSerializer(fn)`    | `fn()` returns extra props for `save()`. Returns an unregister function; call it from a destructor |
| `resizeToContent()`         | `gridStack.resizeToContent(element)`                                                               |

`grid` (also passed as `@grid`): `addWidget(json)`, `removeWidget(idOrEl,
removeDOM = true)`, `save(...)` (gridstack's own defaults), `load(json,
addRemove)`, `compact`, `enableMove`, `enableResize`, `setMode(mode)`,
`removeAll(removeDOM = true)`, `instance`, `gridStack`, `widgets`. Removal
defaults to `removeDOM = true`, because gridstack owns the elements in this
mode.

### Save/load JSON

```json
[
  {
    "id": "a",
    "x": 0,
    "y": 0,
    "w": 2,
    "h": 2,
    "component": "Text",
    "props": { "text": "Hello" }
  }
]
```

As in gridstack, `w`/`h` equal to 1 are left out. `content` is not written,
because a `saveCB` is installed (`gridstack.js:557`).

## Coexistence with the template API

- `<GridStack>` without `@layout`/`@components` behaves exactly as before.
  All 87 baseline tests still pass.
- What is yielded differs: the template API yields `grid` (with `grid.Item`),
  data mode yields `widget, grid`. Don't nest `<GridStackItem>` in data mode.
- gridstack's static `addRemoveCB`/`saveCB`/`updateCB` are installed while
  at least one data-mode grid exists (ref-counted) and are restored when the
  last one is destroyed. They only handle elements whose `_gridComp` /
  `_gridItemRef.gridComp` is an Ember data-mode grid, and pass everything
  else to the callbacks installed before them (e.g. the React wrapper's).
- Side effect while a data-mode grid is on the page: `GridStack.saveCB` is
  set, so `save()` on a template-API grid no longer includes `content`
  (gridstack skips content when a `saveCB` is present). Template-API grids
  use `save(false)` in practice, so this is minor. Still, document it or
  pass `saveCB = undefined`.

## Side by side

|                  | Ember (data mode)                            | React                                                                       | Vue                           |
| ---------------- | -------------------------------------------- | --------------------------------------------------------------------------- | ----------------------------- |
| Layout input     | `@layout` or `@options.children`             | `options.children`                                                          | `:options.children`           |
| Component map    | `@components={{hash Text=Text}}` (optional)  | `components={{ Text }}`                                                     | `:components="{ Text }"`      |
| Inline rendering | yielded block `as \|widget grid\|` (primary) | none (map only)                                                             | none (map only)               |
| Widget props     | `@props`                                     | spread props                                                                | props                         |
| Grid access      | yielded `grid` / `@grid`                     | `useGridStackContext()`                                                     | `useGridStack()`, `getGrid()` |
| Extra save state | `widget.registerSerializer(fn)`              | `useGridStackWidget().registerSerializer` style (`mergeWidgetPropsForSave`) | same pattern                  |
| Events           | `@onAdded` … (13)                            | callbacks on the grid                                                       | emits (10)                    |

The React/Vue columns come from `dist/react/README.md`, `dist/vue/README.md`
and `dist/react/registry.js`; no network sources were used.

## Template API limits

From `grid-stack-template-api-limits-test.gjs`, with `{{#each}}<GridStackItem>`:

**Cross-grid drag (`acceptWidgets: true`)**

- gridstack moves the element into the right grid, and both engines are
  updated (left `[]`, right `[a, b]`).
- Glimmer keeps the component alive and its state (counter still 1),
  because its DOM was moved behind its back.
- The app's data is now wrong: `a` is still in the left list. Ember does not
  know the item moved.
- When the app then removes `a` from the left list, gridstack drops `a`
  from the right grid's engine, but the element **stays in the right grid's
  DOM as an orphan** that nobody tracks. No error is raised. To move it
  properly, the app would have to sync both lists from
  `@onAdded`/`@onRemoved`/`@onDropped` and accept a remount.

**Trash (`removable: '#trash'`)**

- gridstack removes the node and the element that Glimmer rendered (`a` is gone
  from the DOM).
- The app's data still lists `a`, so it must listen to `@onRemoved`.
- Removing `a` from the list afterwards raises no error.

**Drag-in (`setupDragIn`)**: not tried with the template API. The dropped
element has no Ember owner, so the app would have to turn `@onDropped` into
a new list entry and remove gridstack's element itself.

## Migration

### (a) Upgrading to 6.0 (from README "Migrating to 6.0")

- v2 (Embroider) addon. Needs `ember-source` >= 4.12 and ember-auto-import >= 2 or Embroider.
- Peer dependencies: `@glimmer/component` `^1.1.2 || ^2.0.0`, `@glimmer/tracking` `^1.1.2`, `ember-source >= 4.12.0`.
- gridstack 12 → 14. `float` becomes `mode`. `float: true` is migrated
  automatically, and `save()` writes `mode`.
- `update()` (so `<GridStackItem @options>` changes too) may refuse moves
  onto locked items or past `maxRow`.
- `@options` changes are applied in place with `updateOptions()`. Only the
  options listed in the README re-create the grid.
- New `@onResizecontent`.
- `grid-stack-registry` is deprecated in favour of `grid.Item`.
- `@ember/render-modifiers` is no longer a dependency. Exports are explicit.

### (b) From `{{#each}}<GridStackItem>` to data mode

Before:

```hbs
<GridStack
  @options={{hash mode='float'}}
  @onChange={{this.syncPositions}}
  as |grid|
>
  {{#each this.widgets key='id' as |w|}}
    <grid.Item class='card' @options={{hash id=w.id x=w.x y=w.y w=w.w h=w.h}}>
      <Chart @data={{w.data}} />
    </grid.Item>
  {{/each}}
</GridStack>
```

After:

```hbs
<GridStack
  @options={{hash mode='float'}}
  @layout={{this.layout}}
  as |widget grid|
>
  {{#if (eq widget.component 'chart')}}
    <Chart @data={{widget.props.data}} />
  {{/if}}
</GridStack>
```

Or with a map, `@components={{hash chart=Chart}}`, and `Chart` reads `@props`.

React and Vue equivalents:

```tsx
<GridStack
  options={{ mode: 'float', children: layout }}
  components={{ chart: Chart }}
/>
```

```vue
<GridStack
  :options="{ mode: 'float', children: layout }"
  :components="{ chart: Chart }"
/>
```

Steps:

1. Turn the list into layout JSON: `{ id, x, y, w, h, component, props }`.
2. Render with the yielded block (pick by `widget.component`) or `@components`.
3. Delete the `@onChange` code that copies positions back into your list.
   Use `grid.save()` when persisting, or read the `@onChange` nodes.
4. Put widget-local state that must be saved into `registerSerializer`, and
   state that must survive a cross-grid move into `widget.state`.
5. Use the yielded `grid` methods instead of the registry service.

Behaviour changes:

- DOM (and tab) order follows the visual order, because gridstack's
  `_sortDom` is on in data mode.
- `...attributes` on items no longer exist. Use the JSON `class`/`id`, or
  markup inside the content.
- Adding and removing goes through `grid.addWidget`/`removeWidget`/`load`, not
  through a tracked list.

New features this enables: `acceptWidgets` between grids, `setupDragIn`
toolboxes, `removable` trash, `lazyLoad`, `sizeToContent`.

## Risks

- **in-element edge cases.** If gridstack removes an item element before
  Glimmer tears down (trash, `removeWidget(…, true)`), Glimmer clears nodes
  inside a detached element. That works (test 5), but it relies on the
  record being dropped in the same callback. A cross-grid move always
  remounts.
- **Render timing.** gridstack calls `addRemoveCB` synchronously, also during
  the first render. Records are therefore published to the tracked
  `widgets` array in `afterRender`, so content appears one render pass later
  than the item element.
- **Shared static callbacks.** If React or Vue wrappers are on the same page:
  ours chain to previously installed callbacks and only restore them if they
  are still ours. But if another wrapper installs after us and does not
  chain, our grids stop getting callbacks. The `saveCB` side effect on
  template-API grids is noted above.
- **FastBoot/SSR.** There is no DOM, so `GridStack.init` (in a modifier) and
  `in-element` never run. The grid renders empty on the server and fills in
  on the client. Not implemented or tested.
- **Many widgets.** Each add or remove replaces the tracked array (batched
  per run loop), and `{{#each key="id"}}` keeps existing rows. Not measured
  beyond a few widgets.
- **Spike shortcuts.** Types are loose, `@layout` is not reactive (by design,
  like React), there is no nested sub-grid test, and the tests reach the
  component through `element._gridComp`.

## Recommendation

Ship data mode in 6.x as an additive feature. It does not need to block 6.0.
Test 3 shows no data loss: what is lost on a cross-grid move is
component-local tracked state, and `widget.state`/`props` cover it. Before release: make `@layout` updates explicit
(document `load()`), firm up the types, decide on the template-API `saveCB`
side effect, and add nested sub-grid and SSR guards.
