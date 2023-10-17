require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['customerprofiles'] = {};
AWS.CustomerProfiles = Service.defineService('customerprofiles', ['2020-08-15']);
Object.defineProperty(apiLoader.services['customerprofiles'], '2020-08-15', {
  get: function get() {
    var model = require('../apis/customer-profiles-2020-08-15.min.json');
    model.paginators = require('../apis/customer-profiles-2020-08-15.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.CustomerProfiles;
