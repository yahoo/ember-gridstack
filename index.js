/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-gridstack',

  included: function(app) {
    this._super.included.apply(this, arguments);

    app.import('node_modules/gridstack/dist/gridstack.all.js');

    app.import('node_modules/gridstack/dist/gridstack.css');
    app.import('node_modules/gridstack/dist/gridstack-extra.css');
  }
};
