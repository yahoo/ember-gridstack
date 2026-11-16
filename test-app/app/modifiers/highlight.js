import { modifier } from 'ember-modifier';
import hljs from 'highlight.js/lib/core';
import handlebars from 'highlight.js/lib/languages/handlebars';
import javascript from 'highlight.js/lib/languages/javascript';
import bash from 'highlight.js/lib/languages/bash';
import xml from 'highlight.js/lib/languages/xml';

hljs.registerLanguage('xml', xml);
hljs.registerLanguage('handlebars', handlebars);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('bash', bash);

const html = (code, language) => hljs.highlight(code, { language }).value;

export default modifier((elm, _p, { lang } = {}) => {
  if (lang === 'gjs') {
    elm.dataset.src ??= elm.textContent;
    const src = elm.dataset.src;
    const i = src.search(/^<template>/m);
    elm.innerHTML =
      i === -1
        ? html(src, 'javascript')
        : html(src.slice(0, i), 'javascript') +
          html(src.slice(i), 'handlebars');
    elm.classList.add('hljs');
    return;
  }
  if (lang) elm.classList.add(`language-${lang}`);
  delete elm.dataset.highlighted;
  hljs.highlightElement(elm);
});
