require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['licensemanagerlinuxsubscriptions'] = {};
AWS.LicenseManagerLinuxSubscriptions = Service.defineService('licensemanagerlinuxsubscriptions', ['2018-05-10']);
Object.defineProperty(apiLoader.services['licensemanagerlinuxsubscriptions'], '2018-05-10', {
  get: function get() {
    var model = require('../apis/license-manager-linux-subscriptions-2018-05-10.min.json');
    model.paginators = require('../apis/license-manager-linux-subscriptions-2018-05-10.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.LicenseManagerLinuxSubscriptions;
