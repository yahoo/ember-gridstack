import type { LayoutWidget } from '../components/grid-stack-layout.gts';

/**
 * Options gridstack's `updateOptions()` cannot apply; changing any of these, or
 * removing any option, destroys and re-creates the GridStack instance.
 */
export const REINIT_OPTIONS: string[] = [
  'alwaysShowResizeHandle',
  'draggable',
  'handle',
  'handleClass',
  'itemClass',
  'layout',
  'placeholderClass',
  'placeholderText',
  'resizable',
  'removable',
  'children',
  'disableOneColumnMode',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'marginUnit',
];

export const sameOption = (a: unknown, b: unknown) =>
  a === b ||
  (typeof a === 'object' &&
    typeof b === 'object' &&
    a !== null &&
    b !== null &&
    JSON.stringify(a) === JSON.stringify(b));

const isPlain = (v: unknown): v is Record<string, unknown> => {
  if (typeof v !== 'object' || v === null) return false;
  const proto = Object.getPrototypeOf(v) as unknown;
  return proto === Object.prototype || proto === null;
};

function sameValue(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((v, i) => sameValue(v, b[i]));
  }
  if (isPlain(a) && isPlain(b)) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of keys) if (!sameValue(a[k], b[k])) return false;
    return true;
  }
  return false;
}

export function sameLayout(a?: LayoutWidget[], b?: LayoutWidget[]): boolean {
  if (a === b) return true;
  if (!a || !b || a.length !== b.length) return false;
  return a.every((w, i) => sameValue(w, b[i]));
}
