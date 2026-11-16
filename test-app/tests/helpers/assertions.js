import * as QUnit from 'qunit';

function gridOf(assert) {
  const grid = assert.test.testEnvironment.grid;
  if (!grid) throw new Error('grid assertions need setupGridTest(hooks)');
  return grid;
}

const sorted = (ids) => [...ids].map(String).sort();

/** Adds `assert.layout`, `assert.events` and `assert.inSync`; needs setupGridTest(hooks). */
export function registerGridAssertions(assert) {
  /** Compares only the keys given, e.g. `{ a: { x: 0 }, b: { y: 1, w: 2 } }`. */
  assert.layout = function (expected, message = 'layout matches') {
    const layout = gridOf(this).layout();
    const actual = {};
    for (const [id, keys] of Object.entries(expected)) {
      actual[id] = layout[id] && {};
      for (const key of Object.keys(keys)) {
        if (layout[id]) actual[id][key] = layout[id][key];
      }
    }
    this.pushResult({
      result: QUnit.equiv(actual, expected),
      actual,
      expected,
      message,
    });
  };

  /** Event names in order; consecutive repeats (e.g. many `drag`) count once. */
  assert.events = function (expected, message = 'events fired') {
    const actual = this.test.testEnvironment.events
      .names()
      .filter((name, i, all) => name !== all[i - 1]);
    this.pushResult({
      result: QUnit.equiv(actual, expected),
      actual,
      expected,
      message,
    });
  };

  /** DOM items, gridstack nodes and (default template) `grid.items` agree. */
  assert.inSync = function (message = 'DOM, gridstack and items in sync') {
    const grid = gridOf(this);
    const domIds = grid.domOrder();
    const nodes = grid.instance.engine.nodes;
    const problems = [];
    if (new Set(domIds).size !== domIds.length) {
      problems.push(`duplicate DOM items: ${domIds}`);
    }
    const nodeIds = sorted(nodes.map((n) => n.el?.dataset.id));
    if (!QUnit.equiv(sorted(domIds), nodeIds)) {
      problems.push(`DOM ${sorted(domIds)} != nodes ${nodeIds}`);
    }
    if (grid.usesDefaultTemplate) {
      const itemIds = sorted(grid.items.map((i) => i.id));
      if (!QUnit.equiv(itemIds, sorted(domIds))) {
        problems.push(`items ${itemIds} != DOM ${sorted(domIds)}`);
      }
    }
    nodes.forEach((n) => {
      if (!n.el?.isConnected)
        problems.push(`node ${n.el?.dataset.id} detached`);
      else if (n.el.gridstackNode !== n) {
        problems.push(`node ${n.el.dataset.id} != el.gridstackNode`);
      }
    });
    this.pushResult({
      result: problems.length === 0,
      actual: problems,
      expected: [],
      message,
    });
  };
}
