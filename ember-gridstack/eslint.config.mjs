/**
 * Debugging:
 *   https://eslint.org/docs/latest/use/configure/debug
 *  ----------------------------------------------------
 *
 *   Print a file's calculated configuration
 *
 *     npx eslint --print-config path/to/file.js
 *
 *   Inspecting the config
 *
 *     npx eslint --inspect-config
 *
 */
import emberParser from 'ember-eslint-parser';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import ember from 'eslint-plugin-ember/recommended';
import importX from 'eslint-plugin-import-x';
import n from 'eslint-plugin-n';
import globals from 'globals';

const esmParserOptions = {
  ecmaFeatures: { modules: true },
  ecmaVersion: 'latest',
};

export default [
  js.configs.recommended,
  prettier,
  ember.configs.base,
  ember.configs.gjs,
  /**
   * Ignores must be in their own object
   * https://eslint.org/docs/latest/use/configure/ignore
   */
  {
    ignores: [
      'dist/',
      'declarations/',
      'types/',
      'node_modules/',
      'coverage/',
      '!**/.*',
    ],
  },
  /**
   * https://eslint.org/docs/latest/use/configure/configuration-files#configuring-linter-options
   */
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      parser: emberParser,
    },
  },
  {
    files: ['**/*.{js,gjs}'],
    languageOptions: {
      parserOptions: esmParserOptions,
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ['src/**/*'],
    plugins: {
      'import-x': importX,
    },
    rules: {
      // require relative imports use full extensions
      'import-x/extensions': ['error', 'always', { ignorePackages: true }],
    },
  },
  {
    files: [
      'src/components/grid-stack.gjs',
      'src/components/grid-stack-layout.gjs',
    ],
    rules: {
      // gridstack event callbacks are scheduled with scheduleOnce; changing that is out of scope
      'ember/no-runloop': 'off',
    },
  },
  /**
   * CJS node files
   */
  {
    files: [
      '**/*.cjs',
      '.prettierrc.js',
      '.stylelintrc.js',
      '.template-lintrc.js',
      'addon-main.cjs',
    ],
    plugins: {
      n,
    },

    languageOptions: {
      sourceType: 'script',
      ecmaVersion: 'latest',
      globals: {
        ...globals.node,
      },
    },
  },
  /**
   * ESM node files
   */
  {
    files: ['**/*.mjs'],
    plugins: {
      n,
    },

    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      parserOptions: esmParserOptions,
      globals: {
        ...globals.node,
      },
    },
  },
];
