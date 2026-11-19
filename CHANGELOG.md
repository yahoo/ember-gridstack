# Changelog

## Release (2026-11-19)

- ember-gridstack 6.0.0-alpha.0 (major)

#### :boom: Breaking Change

- `ember-gridstack`
  - [#157](https://github.com/yahoo/ember-gridstack/pull/157) ember-gridstack 6.0: typed v2 addon, gridstack 14, data mode ([@kevinhinterlong](https://github.com/kevinhinterlong))

#### :house: Internal

- [#159](https://github.com/yahoo/ember-gridstack/pull/159) Pin every action in Plan Release by inlining release-plan's actions ([@kevinhinterlong](https://github.com/kevinhinterlong))
- [#155](https://github.com/yahoo/ember-gridstack/pull/155) ci: run builds on Node 22 and fix ember-try scenarios ([@jkusa](https://github.com/jkusa))

#### Committers: 2

- Jon Kilroy ([@jkusa](https://github.com/jkusa))
- Kevin Hinterlong ([@kevinhinterlong](https://github.com/kevinhinterlong))

## 6.0 upgrade notes

Everything that changed from 5.x, for the steps see [Migrating to 6.0](./README.md#migrating-to-60).

- ember-gridstack is now a v2 (Embroider) addon. Your app needs `ember-source` >= 4.12 and ember-auto-import >= 2 (or Embroider).
- gridstack is a regular dependency that your app's bundler resolves; it is no longer copied into the vendor tree.
- `gridstack/dist/gridstack.css` is imported by the addon automatically, so remove any manual import of it.
- gridstack.js goes from 12 to 14. See the [gridstack.js changelog](https://github.com/gridstack/gridstack.js/blob/master/doc/CHANGES.md).
- `float` is replaced by `mode` (`'top'`, `'float'`, `'list'` or `'compact'`). Legacy `float: true` is migrated to `mode: 'float'` automatically, but use `mode` in new code. `save()` now writes `mode`, not `float`.
- `update()` (and so changing a `<GridStackItem>`'s `@options`) may refuse a move onto a locked item or past `maxRow`. The item then stays where it was.
- Changed `@options` are applied in place with `updateOptions()` instead of re-creating the grid. Only the options listed under [Options](./README.md#options) re-create it.
- DOM order is owned by Ember: the addon turns off gridstack's re-sorting of `.grid-stack-item` elements, so `{{#each}}` keeps working after items move. Tab order follows your template, not the visual layout.
- New `@onResizecontent` action.
- Contextual components: `<GridStack as |grid|>` yields `grid.Item`, a `<GridStackItem>` bound to that grid. Plain `<GridStackItem>` still works and joins the closest `<GridStack>`.
- No generated element ids: grids are found through their element, so you can set your own `id` on `<GridStack>` and `<GridStackItem>`.
- `item.element` is `undefined` until the item is inserted.
- Event delivery is no longer coalesced: every gridstack event reaches its `@on*` action, in order, with its own arguments, even several in one run loop.
- The `grid-stack-registry` service finds grids by element, GridStack instance or `@name` (`find`, `get`). `registerGrid`, `findGridComponent` and `unregisterGridComponent` are removed; use `registry.find(element)` or `registry.get(name)`.
- A grid no longer finds its `<GridStackItem>`s through the registry by element id; items resolve their grid from the DOM.
- A cross-grid drop whose `id` already exists in the target grid is refused, with a dev warning (`ember-gridstack.drop-id-collision`).
- An item dropped on another grid (`acceptWidgets`) is now removed from the source and created fresh in the target by your `@onDropped`; a grid with `acceptWidgets` and no `@onDropped` refuses drops. See [Cross-grid drops](./README.md#cross-grid-drops-template-mode).
- `@ember/render-modifiers` is no longer a dependency. Add it to your app yourself if you used it through this addon.
- `package.json` has an `exports` map. The public import paths are the package root and `components/*`, `modifiers/*` and `services/*` (with or without `.js`). Other paths such as `utils/*` still resolve, but they are private and can change in any release.
- New root named exports: `import { GridStack, GridStackItem, gsItemAttributes, GridStackRegistry, GRID_STACK_EVENTS } from 'ember-gridstack'`.
- TypeScript / Glint types ship in `declarations/`: `GridStackSignature`, `GridStackItemSignature`, `GsItemAttributesSignature`. They change nothing for JavaScript users.
- The yielded grid and item have new members, see [Yields](./README.md#yields).
- Data mode: `@layout` is compared by content; an equal layout (even a new array) no longer calls `load()`. Call `grid.load(layout)` to reset positions after user drags.
- Data mode: changing a re-init option (`handle`, `draggable`, margins, ...) rebuilds the grid keeping the layout; widgets are re-created once and keep state only through serializers.

## [5.0.0](https://github.com/yahoo/ember-gridstack/compare/v4.0.1...v5.0.0) (2025-05-22)

### Features

- BREAKING: update to gridstack v12.1.2 see https://github.com/gridstack/gridstack.js?tab=readme-ov-file#migrating-to-v8 for migration guides

## [4.0.0](https://github.com/yahoo/ember-gridstack/compare/v3.2.0...v4.0.0) (2023-03-08)

### Features

- update to ember 4.8.0

- BREAKING: update to ember-auto-import v2

## [3.2.0](https://github.com/yahoo/ember-gridstack/compare/v3.1.1...v3.2.0) (2023-02-06)

### Features

- update to gridstack v7

## [3.1.1](https://github.com/yahoo/ember-gridstack/compare/v3.1.0...v3.1.1) (2022-05-25)

### Bug Fixes

- don't trigger events due to teardown ([#98](https://github.com/yahoo/ember-gridstack/issues/98)) ([7743acf](https://github.com/yahoo/ember-gridstack/commit/7743acf900e433f2f74507e527aa41b46b8692c7))

# [3.1.0](https://github.com/yahoo/ember-gridstack/compare/v3.0.2...v3.1.0) (2021-12-22)

### Bug Fixes

- **grid-stack:** allow custom class attribute ([f00309e](https://github.com/yahoo/ember-gridstack/commit/f00309ef9e016fe0e90e024b78c48b2dc1dd6e79))

### Features

- update ember-modifier render-modifiers deps ([7a1c6b4](https://github.com/yahoo/ember-gridstack/commit/7a1c6b40120b8c99af1aa1769b985232b83af3e6))

## [3.0.2](https://github.com/yahoo/ember-gridstack/compare/v3.0.1...v3.0.2) (2021-10-21)

### Bug Fixes

- embroider-safe and embroider-optimized builds ([#88](https://github.com/yahoo/ember-gridstack/issues/88)) ([26e77a8](https://github.com/yahoo/ember-gridstack/commit/26e77a867a146eeaf949b4c89697593d3872865c))

## [3.0.1](https://github.com/yahoo/ember-gridstack/compare/v3.0.0...v3.0.1) (2021-10-19)

### Bug Fixes

- bump path-parse from 1.0.6 to 1.0.7 ([#83](https://github.com/yahoo/ember-gridstack/issues/83)) ([47503ed](https://github.com/yahoo/ember-gridstack/commit/47503edc97fc8ab280a619fc6370cfa0ee1d0956))
- bump tmpl from 1.0.4 to 1.0.5 ([#84](https://github.com/yahoo/ember-gridstack/issues/84)) ([382c7f9](https://github.com/yahoo/ember-gridstack/commit/382c7f91ec5a49abee9be52bb230b271bdf17e7d))
- bump ws from 7.4.5 to 7.4.6 ([#80](https://github.com/yahoo/ember-gridstack/issues/80)) ([4b36d95](https://github.com/yahoo/ember-gridstack/commit/4b36d95637f84c282af730d651588a1f41c1ba55))

## [3.0.0](https://github.com/yahoo/ember-gridstack/compare/v2.1.0...v3.0.0) (2021-10-19)

✨ Huge shoutout to [@adumesny](https://github.com/adumesny) for his work on gridstack ✨

- BREAKING: Update to glimmer components and latest gridstack ([#82])

  > Some changes include
  >
  > - width -> w, height -> h
  > - Manually specifying attributes via `data-gs-` -> updated to `gs-`
  >
  > For more detailed changes head over to [gridstack](https://github.com/gridstack/gridstack.js/#migrating-to-v2) and read their migration guides for v2, v3, and v4

  If you want to keep roughly the same display as before use these options

  ```hbs
  <GridStack
    @options={{hash
      disableOneColumnMode=true
      animate=false
      marginTop=0
      marginBottom=20
      cellHeight="80px"
    }}
  >
  ```

  If your `GridStackItem`s are no longer handling resizes, you may need to manually pass the event like this

  ```
  <GridStack @onResizestop={{this.doItemResize}}>
  ```

  ```
  export default class MyComponent extends Component<Args> {
    @action
    doItemResize(event: Event, gridStackItem: HTMLElement) {
      gridStackItem.dispatchEvent(new Event(event.type));
    }
  }
  ```

- FEATURE: Some new options for GridStack events and GridStackItem options
  > Some changes include
  >
  > - animation
  > - native html5 implementation
  > - better drag in/out and collision handling
- DOCS: Updated readme examples to use updated hbs syntax

[#82]: https://github.com/yahoo/ember-gridstack/pull/82
