require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['licensemanager'] = {};
AWS.LicenseManager = Service.defineService('licensemanager', ['2018-08-01']);
Object.defineProperty(apiLoader.services['licensemanager'], '2018-08-01', {
  get: function get() {
    var model = require('../apis/license-manager-2018-08-01.min.json');
    model.paginators = require('../apis/license-manager-2018-08-01.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.LicenseManager;
