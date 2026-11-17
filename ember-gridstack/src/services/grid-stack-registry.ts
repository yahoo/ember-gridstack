import Service from '@ember/service';
import { assert } from '@ember/debug';
import { gridForElement } from '../utils/grid-elements.js';

/**
 * Finds the yielded grid API of a rendered `<GridStack>` (template or data mode)
 * by element, GridStack instance or `@name`.
 */
export default class GridstackService extends Service {
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
}
