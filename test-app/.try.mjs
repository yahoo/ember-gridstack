import { readFileSync } from 'node:fs';
import getChannelURL from 'ember-source-channel-url';

const embroiderDevDeps = {
  '@embroider/core': '^3.4.0',
  '@embroider/webpack': '^3.2.1',
  '@embroider/compat': '^3.3.0',
  webpack: '^5.0.0',
};

// @embroider/try has no `env`, so the @embroider/test-setup mode is baked into ember-cli-build.js
const emberCliBuild = readFileSync(
  new URL('./ember-cli-build.js', import.meta.url),
  'utf8',
);
const withEmbroider = (mode) =>
  emberCliBuild.replace(
    "'use strict';\n",
    `'use strict';\n\nprocess.env.EMBROIDER_TEST_SETUP_OPTIONS = '${mode}';\n`,
  );

export default {
  scenarios: [
    {
      name: 'ember-lts-4.12',
      npm: { devDependencies: { 'ember-source': '~4.12.0' } },
    },
    {
      name: 'ember-lts-5.12',
      npm: { devDependencies: { 'ember-source': '~5.12.0' } },
    },
    {
      name: 'ember-lts-6.12',
      npm: { devDependencies: { 'ember-source': '~6.12.0' } },
    },
    {
      name: 'ember-release',
      npm: {
        devDependencies: { 'ember-source': await getChannelURL('release') },
      },
    },
    {
      name: 'ember-beta',
      npm: {
        devDependencies: { 'ember-source': await getChannelURL('beta') },
      },
    },
    {
      name: 'embroider-safe',
      npm: { devDependencies: embroiderDevDeps },
      files: { 'ember-cli-build.js': withEmbroider('safe') },
    },
    {
      name: 'embroider-optimized',
      npm: { devDependencies: embroiderDevDeps },
      files: { 'ember-cli-build.js': withEmbroider('optimized') },
    },
  ],
};
