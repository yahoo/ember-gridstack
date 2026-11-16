# ember-gridstack [![CI][ci-badge]][ci-badge-url] [![Latest NPM release][npm-badge]][npm-badge-url] [![Ember Observer Score][ember-observer-badge]][ember-observer-badge-url]

Ember components to build drag-and-drop multi-column grids powered by [gridstack.js](https://gridstackjs.com/)

## Compatibility

- Ember.js (`ember-source`) v4.12 or above
- Ember CLI v4.12 or above, with ember-auto-import v2 or Embroider
- gridstack.js v14
- Node.js v20.19 or above
- Published as a v2 (Embroider) addon
- Tested against Ember 4.12, 5.12, 6.12 (LTS), release and beta, in a Vite + Embroider app

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

## Migrating to v5

View the full [v5.0.0 release notes](./CHANGELOG.md#500-2025-05-22) for updates and breaking changes.

## Basic Usage

```hbs
<GridStack @options={{hash mode='float'}} @onChange={{this.change}}>
  <GridStackItem @options={{hash x=0 y=0 w=6 h=2}}>
    Widget #1
  </GridStackItem>
  <GridStackItem @options={{hash x=6 y=0 w=6 h=2}}>
    Widget #2
  </GridStackItem>
</GridStack>
```

### Template tag (`.gjs` / `.gts`)

```gjs
import { hash } from '@ember/helper';
import GridStack from 'ember-gridstack/components/grid-stack';
import GridStackItem from 'ember-gridstack/components/grid-stack-item';

<template>
  <GridStack @options={{hash mode='float'}} @onChange={{@onChange}}>
    <GridStackItem @options={{hash x=0 y=0 w=6 h=2}}>
      Widget #1
    </GridStackItem>
  </GridStack>
</template>
```

The modifier and service are available as `ember-gridstack/modifiers/gs-item-attributes` and `ember-gridstack/services/grid-stack-registry`.

A live demo with every component, the modifier and the service is at https://yahoo.github.io/ember-gridstack/.

## Components

### `<GridStack>`

Used to construct a grid-stack layout

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

#### Actions

All 13 gridstack events can be handled as Ember actions. They take the form `on{Eventname}`, run after render, and are read when the event fires, so changing an `@on*` argument needs no re-init.

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

#### Block Form

The `<GridStack>` component uses the block form to yield `<GridStackItem>` components. In addition, `<GridStack>` yields a reference to itself in the case inner components need the reference or would like to listen to events triggered on the grid element.

**Example:**

```hbs
<GridStack as |grid|>
  <GridStackItem @options={{hash x=0 y=0 w=6 h=2}}>
    Widget #1
  </GridStackItem>
</GridStack>
```

### `<GridStackItem>`

Used to construct a grid item inside a `<GridStack>` component

#### Options

`<GridStackItem>` can take an `options` object attribute to configure the grid item. All gridstack item options are valid and take the form `gs-{option}`. However, when using `<GridStackItem>` the `gs` is omitted.

**Example:**

```hbs
<GridStackItem @options={{hash w=4 h=4 x=0 y=0 noMove=true}}>
  ...
</GridStackItem>
```

The full list of options can be found here: https://github.com/gridstack/gridstack.js/tree/master/doc#item-options

#### Block Form

The `<GridStackItem>` component uses the block form to yield the content of the item. In addition, `<GridStackItem>` yields a reference to itself in the case inner components need the reference or would like to listen to events triggered on the grid.

**Example:**

```hbs
<GridStackItem @options={{hash x=0 y=0 w=6 h=2}} as |item|>
  <CustomComponent @parentContainer={{item}} />
</GridStackItem>
```

```js
//custom-component.js
export default class CustomComponent extends Component {
  didInsertElement() {
    super.didInsertElement(...arguments);
    this.parentContainer.element.addEventListener('resizestop', () => {
      //handle resize
    });
  }
}
```

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
