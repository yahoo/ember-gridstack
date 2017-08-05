/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-gridstack',

  included: function(app) {
    this._super.included(app);

    // Lodash
    app.import({
      development: app.bowerDirectory + '/lodash/lodash.js',
      production:  app.bowerDirectory + '/lodash/dist/lodash.min.js'
    });

    // JQuery UI
    app.import({
      development: app.bowerDirectory + '/jquery-ui/jquery-ui.js',
      production:  app.bowerDirectory + '/jquery-ui/jquery-ui.min.js'
    });
    
    ['widget', 'plugin'].forEach(function(module) {
      app.import({
        development: app.bowerDirectory + '/jquery-ui/ui/' + module + '.js',
        production:  app.bowerDirectory + '/jquery-ui/ui/minified/' + module + '.min.js'
      });
    });

    ['mouse', 'draggable', 'resizable'].forEach(function(module) {
      app.import({
        development: app.bowerDirectory + '/jquery-ui/ui/widgets/' + module + '.js',
        production:  app.bowerDirectory + '/jquery-ui/ui/widgets/minified/' + module + '.min.js'
      });
    });
    
    app.import({
      development: app.bowerDirectory + '/jquery.ui.touch/jquery.ui.touch.js',
      production:  app.bowerDirectory + '/jquery.ui.touch/jquery.ui.touch.min.js'
    });


    // Gridstack
    app.import({
      development: app.bowerDirectory + '/gridstack/dist/gridstack.js',
      production:  app.bowerDirectory + '/gridstack/dist/gridstack.min.js'
    });
    app.import(app.bowerDirectory + '/gridstack/dist/gridstack.css');

  }
};
