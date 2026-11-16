import getChannelURL from 'ember-source-channel-url';

export default {
  scenarios: [
    {
      name: 'ember-lts-4.12',
      npm: {
        devDependencies: {
          'ember-source': '~4.12.0',
          '@glimmer/component': '^1.1.2',
        },
      },
    },
    {
      name: 'ember-lts-5.12',
      npm: {
        devDependencies: {
          'ember-source': '~5.12.0',
          '@glimmer/component': '^1.1.2',
        },
      },
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
  ],
};
