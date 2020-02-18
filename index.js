/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-gridstack',

  included: function(app) {
    this._super.included(app);

    // Gridstack
    [ 'gridstack', 'jquery-ui', 'gridstack.jQueryUI' ].forEach(function(module) {
      app.import({
        development: 'node_modules/gridstack/dist/'+ module +'.js',
        production:  'node_modules/gridstack/dist/'+ module +'.min.js'
      });
    })
    
    app.import('node_modules/gridstack/dist/gridstack.css');
    app.import('node_modules/gridstack/dist/gridstack-extra.css');
  }
};
