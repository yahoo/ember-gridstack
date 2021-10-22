import { modifier } from 'ember-modifier';
import hljs from 'highlight.js/lib/core';
import handlebars from 'highlight.js/lib/languages/handlebars';

hljs.registerLanguage('handlebars', handlebars);

export default modifier((elm) => hljs.highlightElement(elm));
