import Service from '@ember/service';
import { assert } from '@ember/debug';
import { gridForElement } from '../utils/grid-elements.js';

/**
 * @deprecated Grids are found through their element; use the yielded
 * `grid.Item` or a plain `<GridStackItem>` inside a `<GridStack>`.
 */
export default class GridstackService extends Service {
  _grids = {};

  /**
   * Registers a GridStack grid
   * @param {string} id - the string id of the GridStack element
   * @param {GridStack} grid - A Gridstack instance
   * @returns {void}
   */
  registerGrid(id, grid) {
    assert('grid should not be already registered', !(id in this._grids));
    this._grids[id] = grid;
  }

  /**
   * Finds the closest GridStack
   * @param {string} id - the string id of the GridStack element
   * @returns {GridStack|undefined}
   */
  findGridComponent(element) {
    const gridStack = element.closest('.grid-stack');
    if (!gridStack) {
      return undefined;
    }
    const found = gridForElement(element);
    if (found) {
      return found;
    }
    const { id } = gridStack;
    assert('The grid should have an id', id);
    const grid = this._grids[id];
    assert(`The grid for ${id} should be registered`, grid);
    return grid;
  }

  /**
   * Removes the registry for a grid
   * @param {string} id - the string id of the GridStack element
   * @returns {void}
   */
  unregisterGridComponent(id) {
    delete this._grids[id];
  }
}
