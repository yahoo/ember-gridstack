# ember-gridstack

[![Travis][build-badge]][build]

Ember components to build drag-and-drop multi-column grids powered by [gridstack.js](https://troolee.github.io/gridstack.js/)

## Compatibility

- Ember.js v3.12 or above
- Ember CLI v2.13 or above
- Node.js v10 or above

Installation

```
ember install ember-gridstack
```

## Basic Usage

```hbs
{{#grid-stack
  options=(hash animate=true)
  onChange=(action 'change')
}}
  {{#grid-stack-item
     options=(hash x=0 y=0 width=6 height=2)
  }}
    Widget #1
  {{/grid-stack-item}}
  {{#grid-stack-item
     options=(hash x=6 y=0 width=6 height=2)
  }}
    Widget #2
  {{/grid-stack-item}}
{{/grid-stack}}
```

## Components

### `{{grid-stack}}`

Used to construct a grid-stack layout

#### Options

`{{grid-stack}}` can take an `options` object attribute to configure the grid. All gridstack grid options are valid and take the form `data-gs-{option}`. However, when using `{{grid-stack}}` the `data-gs` is omitted.

**Example:**

```hbs
{{#grid-stack
  options=(hash
    animate=true
    column=12
    maxRow=10
  )
}}
  ...
{{/grid-stack}}
```

The full list of options can be found here: https://github.com/troolee/gridstack.js/tree/master/doc#grid-attributes

#### Actions

All gridstack events can be handled as Ember actions. They take the form `on{Eventname}`.

**Example:**

```hbs
{{#grid-stack
  onDragstart=(action 'dragStart')
  onDragstop=(action 'dragStop')
  onResizestart=(action 'resizeStart')
  onResizestop=(action 'resizeStop')
  onAdded=(action 'added')
  onChange=(action 'change')
  onEnable=(action 'enable')
  onRemoved=(action 'remove')
}}
```

The full list of events can found here: https://github.com/troolee/gridstack.js/tree/master/doc#events

#### Block Form

The `{{grid-stack}}` component uses the block form to yield `{{grid-stack-item}}` components. In addition, `{{grid-stack}}` yields a reference to itself in the case inner components need the reference or would like to listen to events triggered on the grid element.

**Example:**

```hbs
{{#grid-stack as |grid|}}
  {{#grid-stack-item
     options=(hash x=0 y=0 width=6 height=2)
  }}
    Widget #1
  {{/grid-stack-item}}
{{/grid-stack}}
```

### `{{grid-stack-item}}`

Used to construct a grid item inside a `{{grid-stack}}` component

#### Options

`{{grid-stack-item}}` can take an `options` object attribute to configure the grid item. All gridstack item options are valid and take the form `data-gs-{option}`. However, when using `{{grid-stack-item}}` the `data-gs` is omitted.

**Example:**

```hbs
{{#grid-stack-item
  options=(hash
    width=4
    height=4
    x=0
    y=0
    noMove=true
  )
}}
  ...
{{/grid-stack}}
```

The full list of options can be found here: https://github.com/troolee/gridstack.js/tree/master/doc#item-attributes

#### Block Form

The `{{grid-stack-item}}` component uses the block form to yield the content of the item. In addition, `{{grid-stack-item}}` yields a reference to itself in the case inner components need the reference or would like to listen to events triggered on the grid.

**Example:**

```hbs
{{#grid-stack-item
   options=(hash x=0 y=0 width=6 height=2)
   as |item|
}}
  {{custom-component
    parentContainer=item
  }}
{{/grid-stack-item}}
```

```js
//custom-component.js
export default Ember.Component.extend({
  didInsertElement() {
    this._super(...arguments);
    this.parentContainer.element.addEventListener('resizestop', () => {
      //handle resize
    });
  }
});
```

## Touch Support

For touch support do the following

### ember-grid-stack < 2.x

By default, the [bower dependencies for Gridstack](https://github.com/troolee/gridstack.js#requirements)
will be installed automatically.

[build-badge]: https://travis-ci.org/yahoo/ember-gridstack.svg?branch=master
[build]: https://travis-ci.org/yahoo/ember-gridstack
