# Changelog

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
