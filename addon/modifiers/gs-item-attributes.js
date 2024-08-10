/**
 * Copyright 2021, Yahoo Inc.
 * Copyrights licensed under the BSD License. See the accompanying LICENSE file for terms.
 */
import { modifier } from 'ember-modifier';
import { isBlank } from '@ember/utils';

const GS_PREFIX = 'gs-';

const dasherize = (str) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

export default modifier(function itemAttributes(element, opt) {
  const [options = {}] = opt || [];
  Object.entries(options).forEach(([key, value]) => {
    const attribute = `${GS_PREFIX}${dasherize(key)}`;
    if (isBlank(value)) {
      element.removeAttribute(attribute);
    } else {
      element.setAttribute(attribute, value);
    }
  });
});
