import { DDDraggable } from 'gridstack';

let patched = false;

/**
 * gridstack enters a trash once half of the dragged item's area is over it,
 * so a trash bar shorter (or narrower) than half the item can never be hit.
 * Measure a trash against the most of it the item could cover instead.
 */
export function patchTrashOverlap() {
  if (patched) return;
  patched = true;
  const overlap = DDDraggable.prototype._overlap;
  if (typeof overlap !== 'function') return;
  DDDraggable.prototype._overlap = function (drop, rect) {
    const o = overlap.call(this, drop, rect);
    if (!o || drop.el.gridstack) return o;
    const b = drop.eventEl.getBoundingClientRect();
    const w = Math.min(rect.right, b.right) - Math.max(rect.left, b.left);
    const h = Math.min(rect.bottom, b.bottom) - Math.max(rect.top, b.top);
    const most =
      Math.min(rect.width, b.width) * Math.min(rect.height, b.height);
    return Math.max(o, (w * h) / most);
  };
}
