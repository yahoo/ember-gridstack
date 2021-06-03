'use strict';

module.exports = {
  name: require('./package').name,

  included: function (app) {
    this._super.included.apply(this, arguments);

    app.import('node_modules/gridstack/dist/jquery-ui.js');
    app.import('node_modules/gridstack/dist/gridstack.js');
    app.import('node_modules/gridstack/dist/gridstack.jQueryUI.js');

    app.import('node_modules/gridstack/dist/gridstack.css');
    app.import('node_modules/gridstack/dist/gridstack-extra.css');
  },
};
