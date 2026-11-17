import { getOwner } from '@ember/owner';

const grids = new WeakMap();

export const registry = (component) =>
  getOwner(component).lookup('service:grid-stack-registry');

export const registerGridElement = (el, component) => grids.set(el, component);

export const unregisterGridElement = (el) => grids.delete(el);

const items = new WeakMap();

export const registerItemElement = (el, item) => items.set(el, item);

export const unregisterItemElement = (el) => items.delete(el);

export const itemForElement = (el) => (el ? items.get(el) : undefined);

export const gridForElement = (el) => {
  const gridEl = el?.closest?.('.grid-stack');
  return gridEl ? grids.get(gridEl) : undefined;
};
