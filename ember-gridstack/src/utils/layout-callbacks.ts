/**
 * Static GridStack callbacks for data-driven (`@layout`) grids, ported from
 * gridstack's `dist/react/registry.js`. Dispatch goes through DOM back-refs
 * (`_gridComp` on the grid, `_gridItemRef` on items). Callbacks installed by
 * another wrapper are chained: anything that isn't ours is passed to them.
 */
import { assert } from '@ember/debug';
import { GridStack, Utils } from 'gridstack';

let syntheticIdSeq = 0;
let installs = 0;
let previous = null;

const isOurs = (comp) => Boolean(comp?.isEmberLayoutGrid);

function nearestGridComp(el) {
  for (let node = el; node; node = node.parentElement) {
    if (node._gridComp) return node._gridComp;
  }
  return undefined;
}

export function layoutAddRemove(parent, w, add, isGrid) {
  if (add) {
    if (isGrid) {
      assert(
        'ember-gridstack: nested grids (subGridOpts) are not supported in data mode yet; use the template API <GridStackItem> for nesting',
        !isOurs(nearestGridComp(parent)),
      );
      return previous?.addRemoveCB?.(parent, w, add, isGrid);
    }
    const gridComp = parent._gridComp;
    if (!isOurs(gridComp)) {
      return previous?.addRemoveCB?.(parent, w, add, isGrid);
    }
    const el = Utils.createDiv(['grid-stack-item', ...splitClass(w.class)]);
    const content = Utils.createDiv(['grid-stack-item-content'], el);
    // drag-in specs (setupDragIn) are reused, so they can't carry an id
    if (!w.id) w.id = `gs-ember-${++syntheticIdSeq}`;
    const id = w.id;
    el._gridItemRef = { id, gridComp };
    if (w.content) content.textContent = w.content;
    if (Utils.lazyLoad(w)) {
      el._lazyObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          el._lazyObserver?.disconnect();
          delete el._lazyObserver;
          const comp = el._gridItemRef?.gridComp;
          if (isOurs(comp)) comp.registerWidget(id, w, el);
        }
      });
      // observe once gridstack has positioned the element
      setTimeout(() => el._lazyObserver?.observe(el));
    } else {
      gridComp.registerWidget(id, w, el);
    }
    return el;
  }

  const el = w.el;
  if (!isOurs(el?._gridItemRef?.gridComp)) {
    return previous?.addRemoveCB?.(parent, w, add, isGrid);
  }
  if (el._lazyObserver) {
    el._lazyObserver.disconnect();
    delete el._lazyObserver;
  }
  const { id, gridComp } = el._gridItemRef;
  gridComp.unregisterWidget(id);
  delete el._gridItemRef;
  el.remove();
  return undefined;
}

/** Passed per call by data-mode grids' `save()`, never installed statically. */
export function layoutSave(node, w) {
  const ref = node.el?._gridItemRef;
  if (!isOurs(ref?.gridComp)) return;
  if (node.component != null) w.component = node.component;
  if (node.props != null) w.props = { ...node.props };
  ref.gridComp.mergeWidgetPropsForSave(ref.id, w);
}

export function layoutUpdate(node) {
  const ref = node.el?._gridItemRef;
  if (!isOurs(ref?.gridComp)) return previous?.updateCB?.(node);
  ref.gridComp.requestUpdate(ref.id, node);
}

/** Installs the callbacks; returns an uninstall fn that restores the previous ones. */
export function installLayoutCallbacks() {
  if (installs++ === 0) {
    previous = {
      addRemoveCB: GridStack.addRemoveCB,
      updateCB: GridStack.updateCB,
    };
    GridStack.addRemoveCB = layoutAddRemove;
    GridStack.updateCB = layoutUpdate;
  }
  let done = false;
  return () => {
    if (done) return;
    done = true;
    if (--installs === 0) {
      // only restore if nobody replaced ours in the meantime
      if (GridStack.addRemoveCB === layoutAddRemove)
        GridStack.addRemoveCB = previous.addRemoveCB;
      if (GridStack.updateCB === layoutUpdate)
        GridStack.updateCB = previous.updateCB;
      previous = null;
    }
  };
}

function splitClass(cls) {
  return cls ? cls.split(' ').filter(Boolean) : [];
}
