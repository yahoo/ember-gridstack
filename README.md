# ember-gridstack [![Pipeline Status][status-image]][status-url] [![Latest NPM release][npm-badge]][npm-badge-url] [![Ember Observer Score][ember-observer-badge]][ember-observer-badge-url]

Ember components to build drag-and-drop multi-column grids powered by [gridstack.js](https://gridstackjs.com/)

## Compatibility

- Ember.js v4.4 or above
- Ember CLI v4.4 or above
- Node.js v14 or above

## Installation

```
ember install ember-gridstack
```

## Migrating to v5

View the full [v5.0.0 release notes](./CHANGELOG.md#500-2025-05-22) for updates and breaking changes.

## Basic Usage

```hbs
<GridStack @options={{hash animate=true}} @onChange={{this.change}}>
  <GridStackItem @options={{hash x=0 y=0 w=6 h=2}}>
    Widget #1
  </GridStackItem>
  <GridStackItem @options={{hash x=6 y=0 w=6 h=2}}>
    Widget #2
  </GridStackItem>
</GridStack>
```

## Components

### `<GridStack>`

Used to construct a grid-stack layout

#### Options

`<GridStack>` can take an `options` object attribute to configure the grid. All gridstack grid options are valid and take the form `gs-{option}`. However, when using `<GridStack>` the `gs-{option}` is omitted.

**Example:**

```hbs
<GridStack @options={{hash animate=true column=12 maxRow=10}}>
  ...
</GridStack>
```

The full list of options can be found here: https://github.com/gridstack/gridstack.js/tree/v4.2.7/doc#grid-options

#### Actions

All gridstack events can be handled as Ember actions. They take the form `on{Eventname}`.

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
>
```

The full list of events can found here: https://github.com/gridstack/gridstack.js/tree/v4.2.7/doc#events

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

The full list of options can be found here: https://github.com/gridstack/gridstack.js/tree/v4.2.7/doc#item-options

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
    this.parentContainer.element.addEventListener("resizestop", () => {
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

[status-image]: https://cd.screwdriver.cd/pipelines/7366/badge
[status-url]: https://cd.screwdriver.cd/pipelines/7366
[npm-badge]: https://img.shields.io/npm/v/ember-gridstack.svg
[npm-badge-url]: https://www.npmjs.com/package/ember-gridstack
[ember-observer-badge]: https://emberobserver.com/badges/ember-gridstack.svg
[ember-observer-badge-url]: https://emberobserver.com/addons/ember-gridstack
