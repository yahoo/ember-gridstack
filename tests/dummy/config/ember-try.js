'use strict';

const getChannelURL = require('ember-source-channel-url');
const { embroiderSafe, embroiderOptimized } = require('@embroider/test-setup');

module.exports = async function () {
  return {
    useYarn: true,
    scenarios: [
      {
        name: 'ember-lts-4.4',
        npm: {
          devDependencies: {
            'ember-source': '~4.4.0',
            'ember-qunit': '6.0.0',
            '@ember/test-helpers': '2.7.0',
          },
        },
      },
      {
        name: 'ember-lts-4.8',
        npm: {
          devDependencies: {
            'ember-source': '~4.8.0',
          },
        },
      },
      {
        name: 'ember-release',
        // ember-cli 4.12 can't build Ember 7.x; remove once the Ember upgrade lands.
        allowedToFail: true,
        npm: {
          dependencies: {
            'ember-auto-import': '^2.0.0',
          },
          devDependencies: {
            'ember-source': await getChannelURL('release'),
            webpack: '^5.0.0',
          },
        },
      },
      {
        name: 'ember-beta',
        // ember-cli 4.12 can't build Ember 7.x; remove once the Ember upgrade lands.
        allowedToFail: true,
        npm: {
          dependencies: {
            'ember-auto-import': '^2.0.0',
          },
          devDependencies: {
            'ember-source': await getChannelURL('beta'),
            webpack: '^5.0.0',
          },
        },
      },
      {
        name: 'ember-canary',
        // ember-cli 4.12 can't build Ember 7.x; remove once the Ember upgrade lands.
        allowedToFail: true,
        npm: {
          dependencies: {
            'ember-auto-import': '^2.0.0',
          },
          devDependencies: {
            'ember-source': await getChannelURL('canary'),
            webpack: '^5.0.0',
          },
        },
      },
      embroiderSafe(),
      embroiderOptimized(),
    ],
  };
};
