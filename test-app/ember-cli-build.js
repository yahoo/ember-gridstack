'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

// @denali-design/ember reads registry.availablePlugins (removed in ember-cli 6) to detect ember-cli-sass.
const Registry = require('ember-cli-preprocess-registry');
if (!('availablePlugins' in Registry.prototype)) {
  Object.defineProperty(Registry.prototype, 'availablePlugins', {
    get: () => ({ 'ember-cli-sass': true }),
  });
}

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    autoImport: {
      watchDependencies: ['ember-gridstack'],
    },
  });

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(app, {
    skipBabel: [{ package: 'qunit' }],
  });
};
