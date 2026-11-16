import { modifier } from 'ember-modifier';
import hljs from 'highlight.js/lib/core';
import handlebars from 'highlight.js/lib/languages/handlebars';
import javascript from 'highlight.js/lib/languages/javascript';
import bash from 'highlight.js/lib/languages/bash';

hljs.registerLanguage('handlebars', handlebars);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('bash', bash);

export default modifier((elm) => {
  delete elm.dataset.highlighted;
  hljs.highlightElement(elm);
});
