require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['resourcegroups'] = {};
AWS.ResourceGroups = Service.defineService('resourcegroups', ['2017-11-27']);
Object.defineProperty(apiLoader.services['resourcegroups'], '2017-11-27', {
  get: function get() {
    var model = require('../apis/resource-groups-2017-11-27.min.json');
    model.paginators = require('../apis/resource-groups-2017-11-27.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.ResourceGroups;
