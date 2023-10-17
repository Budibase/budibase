require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['licensemanagerusersubscriptions'] = {};
AWS.LicenseManagerUserSubscriptions = Service.defineService('licensemanagerusersubscriptions', ['2018-05-10']);
Object.defineProperty(apiLoader.services['licensemanagerusersubscriptions'], '2018-05-10', {
  get: function get() {
    var model = require('../apis/license-manager-user-subscriptions-2018-05-10.min.json');
    model.paginators = require('../apis/license-manager-user-subscriptions-2018-05-10.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.LicenseManagerUserSubscriptions;
