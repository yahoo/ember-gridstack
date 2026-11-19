import Service from '@ember/service';
import { assert } from '@ember/debug';
import type { GridStack } from 'gridstack';
import { gridForElement } from '../utils/grid-elements.ts';
import type { GridApi } from '../utils/grid-elements.ts';

/**
 * Finds the yielded grid API of a rendered `<GridStack>` (template or data mode)
 * by element, GridStack instance or `@name`.
 */
export default class GridstackService extends Service {
  private _names = new Map<string, GridApi>();

  /** The yielded grid API for an element inside a grid, or a GridStack instance. */
  find(target: Element | GridStack | null | undefined): GridApi | undefined {
    const el = target instanceof Element ? target : target?.el;
    return el instanceof Element ? gridForElement(el) : undefined;
  }

  /** The yielded grid API of the `<GridStack @name>` with this name. */
  get(name: string): GridApi | undefined {
    return this._names.get(name);
  }

  registerName(name: string, grid: GridApi): void {
    assert(
      `a grid named "${name}" is already registered`,
      !this._names.has(name),
    );
    this._names.set(name, grid);
  }

  unregisterName(name: string, grid: GridApi): void {
    if (this._names.get(name) === grid) this._names.delete(name);
  }
}
