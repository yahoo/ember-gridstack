# test-app tests

## Running

From the repo root:

- `pnpm test:ember`: builds test-app and runs every test in headless Chrome.
- `pnpm test:try ember-lts-4.12`: runs the suite against one scenario from
  `test-app/.try.mjs` (`ember-lts-4.12`, `ember-lts-5.12`, `ember-lts-6.12`,
  `ember-release`, `ember-beta`). It resets `test-app/`, so commit first.

To run a subset, build once, then pass a QUnit filter (from `test-app/`):

```sh
NODE_ENV=development pnpm exec vite build --mode development
pnpm exec testem ci --port 0 --test_page "tests/index.html?hidepassed&filter=reorder"
```

## Writing a grid test

```js
import { module, test } from "qunit";
import { setupGridTest } from "../../helpers/setup-grid-test";

module("Integration | Component | my feature", function (hooks) {
  setupGridTest(hooks);

  test("dragging moves the item", async function (assert) {
    await this.grid.render({ items: [{ id: "a", x: 0, y: 0, w: 2, h: 1 }] });
    await this.grid.dragTo("a", { x: 4, y: 0 });
    assert.layout({ a: { x: 4 } });
    assert.events(["dragstart", "drag", "dragstop", "change"]);
    assert.inSync();
  });
});
```

`setupGridTest(hooks)` calls `setupRenderingTest` and adds `this.grid`,
`this.events` and the teardown check.

### `this.grid`

| Member                                        | Does                                                                                         |
| --------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `render({ options, items, width, template })` | renders `<GridStack>` with one `<GridStackItem data-id>` per item, then clears `this.events` |
| `items`, `gridOptions`                        | tracked state of the default template                                                        |
| `add(item)`, `remove(id)`, `setItems(items)`  | change the rendered items                                                                    |
| `update(id, options)`                         | replace an item's `@options`                                                                 |
| `setOptions(patch)`                           | merge into the grid's `@options`                                                             |
| `move(id, { x, y })`                          | move through gridstack's own `update()`, behind Ember's back                                 |
| `drag(id, dx, dy)` / `dragTo(id, { x, y })`   | real pointer drag by pixels / to a cell                                                      |
| `resize(id, dw, dh)`                          | real resize by cells with the bottom-right handle                                            |
| `destroy()`                                   | unrender the grid (`d.visible` in custom templates)                                          |
| `instance`, `element`, `el(id)`, `node(id)`   | GridStack instance, `.grid-stack`, item element, its gridstack node                          |
| `layout()`, `domOrder()`                      | `{ id: { x, y, w, h } }` and item ids in DOM order                                           |

Items are `{ id, ...gridstackOptions }`; ids become strings. Every action
awaits `settled()`.

`template: (d) => <template>…</template>` renders your own markup instead.
`d` is the driver, so `d.items`, `d.gridOptions`, `d.visible` and
`d.events.handlers.onChange` (one per `GRID_STACK_EVENTS`) are available.

### `this.events`

An array of `{ name, ids, args }`, one per `@on*` call from the default
template. `ids` are the `data-id`s of the element or nodes gridstack passed.
`of(name)`, `names()`, `clear()`.

### Assertions

- `assert.layout({ a: { x: 0, y: 1 } })` compares only the keys you give.
- `assert.events(['dragstart', 'drag', 'dragstop'])` compares event names in
  order; consecutive repeats count once.
- `assert.inSync()` checks that the DOM items, `instance.engine.nodes` and
  `this.grid.items` (default template) have the same ids, without duplicates,
  and that every node's element is attached and points back to it.

## Teardown check

After each test the harness fails it if a `.grid-stack` is still rendered in
`#ember-testing`, or if any GridStack instance created during the test was
not destroyed (gridstack's `destroy()` deletes `engine` and `el`). Instances
are seen through an `HTMLElement.prototype.gridstack` setter that is
installed for the test only. The check adds no assertion when it passes, so
`assert.expect()` counts are unchanged.

## Drag and resize

gridstack's DD layer listens for `mousedown` on the drag handle (default
`.grid-stack-item-content`) and `mousemove`/`mouseup` on `document`, and only
starts after 3px of movement. `helpers/grid.js` (`pointerDrag`, `resizeDrag`)
sends those events in 8 steps; resize grabs the `.ui-resizable-se` handle.
`triggerEvent('.x', 'dragstart')` does not drive gridstack.

## Conventions

- Use `setupGridTest` for anything that renders a grid.
- Prefer `assert.layout` over reading `gs-*` attributes, unless the test is
  about the attributes.
- Tables: `test.each` for new ones; existing tables keep `forEach` so test
  names stay the same.
- Only the syntax and APIs these tests already use, so Ember 4.12 still runs.
