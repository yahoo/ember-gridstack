import { tracked } from '@glimmer/tracking';
import { find, settled } from '@ember/test-helpers';

export class State {
  @tracked items = [];
  @tracked options;
  @tracked onChange;
  @tracked onAdded;
  @tracked onRemoved;
  @tracked shouldRender = true;
  @tracked width = '1000px';
}

export class Item {
  @tracked options;

  constructor(id, options) {
    this.id = id;
    this.options = options;
  }
}

/** gs-x/gs-y may be absent for 0 */
export function gsPos(target, attr) {
  const el = typeof target === 'string' ? find(target) : target;
  return Number(el.getAttribute(attr) ?? 0);
}

export function gridFor(owner, target) {
  const el = typeof target === 'string' ? find(target) : target;
  return owner.lookup('service:grid-stack-registry').findGridComponent(el);
}

export function itemTexts(root = document) {
  return [...root.querySelectorAll('.grid-stack-item')].map((el) =>
    el.querySelector('.grid-stack-item-content').textContent.trim(),
  );
}

function fire(target, type, x, y) {
  target.dispatchEvent(
    new MouseEvent(type, {
      bubbles: true,
      cancelable: true,
      view: window,
      button: 0,
      buttons: type === 'mouseup' ? 0 : 1,
      clientX: x,
      clientY: y,
    }),
  );
}

/** gridstack's DD layer: mousedown on the element, mousemove/mouseup on document, 3px threshold */
export async function pointerDrag(itemEl, dx, dy, steps = 8) {
  // the default drag handle is the content div
  const target = itemEl.querySelector('.grid-stack-item-content') ?? itemEl;
  const rect = target.getBoundingClientRect();
  const x0 = rect.left + Math.min(10, rect.width / 2);
  const y0 = rect.top + Math.min(10, rect.height / 2);
  fire(target, 'mousedown', x0, y0);
  for (let i = 1; i <= steps; i++) {
    fire(document, 'mousemove', x0 + (dx * i) / steps, y0 + (dy * i) / steps);
  }
  fire(document, 'mouseup', x0 + dx, y0 + dy);
  await settled();
}

export async function resizeDrag(itemEl, dx, dy) {
  const handle = itemEl.querySelector('.ui-resizable-se');
  const rect = handle.getBoundingClientRect();
  const x0 = rect.left + rect.width / 2;
  const y0 = rect.top + rect.height / 2;
  fire(handle, 'mousedown', x0, y0);
  for (let i = 1; i <= 8; i++) {
    fire(document, 'mousemove', x0 + (dx * i) / 8, y0 + (dy * i) / 8);
  }
  fire(document, 'mouseup', x0 + dx, y0 + dy);
  await settled();
}
