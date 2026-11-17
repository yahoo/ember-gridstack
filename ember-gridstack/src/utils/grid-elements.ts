import { getOwner } from '@ember/owner';
import type GridStackComponent from '../components/grid-stack.gts';
import type GridStackItem from '../components/grid-stack-item.gts';
import type GridStackLayoutComponent from '../components/grid-stack-layout.gts';
import type GridStackRegistry from '../services/grid-stack-registry.ts';

export type GridApi = GridStackComponent | GridStackLayoutComponent;

const grids = new WeakMap<Element, GridApi>();

export const registry = (component: object): GridStackRegistry =>
  getOwner(component)!.lookup(
    'service:grid-stack-registry',
  ) as GridStackRegistry;

export const registerGridElement = (el: Element, component: GridApi) =>
  grids.set(el, component);

export const unregisterGridElement = (el: Element) => grids.delete(el);

const items = new WeakMap<Element, GridStackItem>();

export const registerItemElement = (el: Element, item: GridStackItem) =>
  items.set(el, item);

export const unregisterItemElement = (el: Element) => items.delete(el);

export const itemForElement = (el: Element | undefined) =>
  el ? items.get(el) : undefined;

export const gridForElement = (el: Element | null | undefined) => {
  const gridEl = el?.closest?.('.grid-stack');
  return gridEl ? grids.get(gridEl) : undefined;
};
