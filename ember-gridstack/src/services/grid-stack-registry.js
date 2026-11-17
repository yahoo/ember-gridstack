import Service from '@ember/service';
import { assert } from '@ember/debug';
import { gridForElement } from '../utils/grid-elements.js';

/**
 * Finds the yielded grid API of a rendered `<GridStack>` (template or data mode)
 * by element, GridStack instance or `@name`.
 */
export default class GridstackService extends Service {
  _grids = {};
  _names = new Map();

  /**
   * @param {Element|GridStack|undefined} target - any element inside a grid, or a GridStack instance
   * @returns the grid's yielded API, or `undefined`
   */
  find(target) {
    const el = target instanceof Element ? target : target?.el;
    return el instanceof Element ? gridForElement(el) : undefined;
  }

  /**
   * @param {string} name - the grid's `@name`
   * @returns the grid's yielded API, or `undefined`
   */
  get(name) {
    return this._names.get(name);
  }

  registerName(name, grid) {
    assert(
      `a grid named "${name}" is already registered`,
      !this._names.has(name),
    );
    this._names.set(name, grid);
  }

  unregisterName(name, grid) {
    if (this._names.get(name) === grid) this._names.delete(name);
  }

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
