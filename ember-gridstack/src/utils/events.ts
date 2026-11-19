import type { GridStackEvent } from 'gridstack';

export const GRID_STACK_EVENTS: GridStackEvent[] = [
  'added',
  'change',
  'disable',
  'dragstart',
  'drag',
  'dragstop',
  'dropped',
  'enable',
  'removed',
  'resizestart',
  'resize',
  'resizestop',
  'resizecontent',
];

export const capitalize = <S extends string>(string: S): Capitalize<S> =>
  (string.charAt(0).toUpperCase() + string.slice(1)) as Capitalize<S>;
