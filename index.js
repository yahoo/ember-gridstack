/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-gridstack',

  included: function(app) {
    this._super.included(app);

    // lodash
    app.import({
      development: 'node_modules/lodash/lodash.js',
      production:  'node_modules/lodash/lodash.min.js'
    });

    // jquery-ui dependencies needed by gridstack.js
    // https://github.com/gridstack/gridstack.js/blob/v0.2.6/src/gridstack.js#L10
    [ 'version', 'data', 'disable-selection', 'focusable', 'escape-selector', 'form',
      'ie', 'keycode', 'labels', 'jquery-1-7', 'plugin', 'safe-active-element',
      'safe-blur', 'scroll-parent', 'tabbable', 'unique-id', 'widget'
    ].forEach(function(module) {
      app.import({
        development: 'node_modules/jquery-ui/ui/' + module + '.js',
        production:  'node_modules/jquery-ui/ui/minified/' + module + '.min.js'
      });
    });

    [ 'mouse', 'draggable', 'droppable', 'resizable' ].forEach(function(module) {
      app.import({
        development: 'node_modules/jquery-ui/ui/widgets/' + module + '.js',
        production:  'node_modules/jquery-ui/ui/widgets/minified/' + module + '.min.js'
      });
    });

    let config = this.getOptions();
    if (config.exclude.indexOf('jquery.ui.touch-punch') < 0) {
      app.import({
        development: app.bowerDirectory + '/jquery.ui.touch-punch/dist/jquery.ui.touch-punch.js',
        production: app.bowerDirectory + '/jquery.ui.touch-punch/dist/jquery.ui.touch-punch.min.js'
      });
    }

    // Gridstack
    [ 'gridstack', 'gridstack.jQueryUI' ].forEach(function(module) {
      app.import({
        development: 'node_modules/gridstack/dist/'+ module +'.js',
        production:  'node_modules/gridstack/dist/'+ module +'.min.js'
      });
    })
    app.import('node_modules/gridstack/dist/gridstack.css');

  },

  getOptions() {
    let projectConfig = (this.project.config(process.env.EMBER_ENV) || {})['ember-gridstack'] || {};

    let config = Object.assign({}, {
      exclude: [],
    }, projectConfig);
    config.exclude = config.exclude || [];

    return config;
  }
};
