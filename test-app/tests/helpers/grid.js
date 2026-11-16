import { settled } from '@ember/test-helpers';

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
  // the move that crosses the threshold only starts the drag
  fire(document, 'mousemove', x0 + Math.sign(dx) * 4, y0 + Math.sign(dy) * 4);
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
