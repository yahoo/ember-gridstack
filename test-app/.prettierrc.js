'use strict';

module.exports = {
  plugins: ['prettier-plugin-ember-template-tag'],
  overrides: [
    {
      files: '*.{js,gjs,ts,gts,mjs,mts,cjs,cts}',
      options: {
        singleQuote: true,
        templateSingleQuote: false,
      },
    },
    {
      // Shown as source snippets in the demo; keep them narrow.
      files: 'app/components/examples/*.gjs',
      options: { printWidth: 70 },
    },
  ],
};
