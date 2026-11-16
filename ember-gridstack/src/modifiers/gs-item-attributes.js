/**
 * Copyright 2021, Yahoo Inc.
 * Copyrights licensed under the BSD License. See the accompanying LICENSE file for terms.
 */
import { modifier } from 'ember-modifier';

const GS_PREFIX = 'gs-';

// Same result as `isBlank` from `@ember/utils` (deprecated in ember-source 7)
const isBlank = (value) =>
  value == null ||
  (typeof value === 'string' && value.trim() === '') ||
  (Array.isArray(value) && value.length === 0);

const dasherize = (str) =>
  str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

export function applyItemAttributes(
  element,
  options = {},
  { onlyRemovals = false } = {},
) {
  Object.entries(options ?? {}).forEach(([key, value]) => {
    const attribute = `${GS_PREFIX}${dasherize(key)}`;
    if (isBlank(value)) {
      element.removeAttribute(attribute);
    } else if (!onlyRemovals) {
      element.setAttribute(attribute, value);
    }
  });
}

export default modifier(function itemAttributes(element, [options] = []) {
  applyItemAttributes(element, options);
});
