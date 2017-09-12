/*jshint node:true*/
module.exports = {
  normalizeEntityName: function() {}, // Required for `ember install` to run without error

  afterInstall: function() {
    let config = (this.project.config(process.env.EMBER_ENV) || {})['ember-gridstack'] || {};
    let packages = [
      {
        name: 'jquery-ui',
        target: '~1.12.1'
      },
      {
        name: 'lodash',
        target: '^4.13.1'
      },
      {
        name: 'gridstack',
        target: '~0.2.6'
      },
    ];

    if (!(config.exclude && config.exclude.indexOf('jquery.ui.touch-punch') >= 0)) {
      packages.push({
        name: 'jquery.ui.touch-punch',
        target: '^0.3.0'
      });
    }
    return this.addBowerPackagesToProject(packages);
  }
};
