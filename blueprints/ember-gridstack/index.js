/*jshint node:true*/
module.exports = {
  normalizeEntityName: function() {}, // Required for `ember install` to run without error

  afterInstall: function() {
    return this.addBowerPackagesToProject([
      {
        name: 'jquery-ui',
        target: '~1.11.4'
      },
      {
        name: 'lodash',
        target: '~4.13.1'
      },
      {
        name: 'gridstack',
        target: '~0.2.5'
      }
    ]);
  }
};
