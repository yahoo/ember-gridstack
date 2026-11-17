/**
 * Copyright 2021, Yahoo Inc.
 * Copyrights licensed under the BSD License. See the accompanying LICENSE file for terms.
 */
import { modifier } from 'ember-modifier';
import type { GridStackWidget } from 'gridstack';

export interface GsItemAttributesSignature {
  Element: HTMLElement;
  Args: { Positional: [options?: GridStackWidget] };
}

const GS_PREFIX = 'gs-';

// Same result as `isBlank` from `@ember/utils` (deprecated in ember-source 7)
const isBlank = (value: unknown) =>
  value == null ||
  (typeof value === 'string' && value.trim() === '') ||
  (Array.isArray(value) && value.length === 0);

const dasherize = (str: string) =>
  str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

export function applyItemAttributes(
  element: HTMLElement,
  options: GridStackWidget = {},
  { onlyRemovals = false }: { onlyRemovals?: boolean } = {},
): void {
  Object.entries(options ?? {}).forEach(([key, value]: [string, unknown]) => {
    const attribute = `${GS_PREFIX}${dasherize(key)}`;
    if (isBlank(value)) {
      element.removeAttribute(attribute);
    } else if (!onlyRemovals) {
      element.setAttribute(attribute, String(value));
    }
  });
}

export default modifier<GsItemAttributesSignature>(function itemAttributes(
  element,
  [options]: [options?: GridStackWidget] = [],
) {
  applyItemAttributes(element, options);
});
