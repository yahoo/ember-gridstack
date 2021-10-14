# Changelog

## 3.0.0

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
