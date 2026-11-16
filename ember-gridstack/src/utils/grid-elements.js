const grids = new WeakMap();

export const registerGridElement = (el, component) => grids.set(el, component);

export const unregisterGridElement = (el) => grids.delete(el);

export const gridForElement = (el) => {
  const gridEl = el?.closest?.('.grid-stack');
  return gridEl ? grids.get(gridEl) : undefined;
};
