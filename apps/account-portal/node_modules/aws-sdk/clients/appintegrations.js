require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['appintegrations'] = {};
AWS.AppIntegrations = Service.defineService('appintegrations', ['2020-07-29']);
Object.defineProperty(apiLoader.services['appintegrations'], '2020-07-29', {
  get: function get() {
    var model = require('../apis/appintegrations-2020-07-29.min.json');
    model.paginators = require('../apis/appintegrations-2020-07-29.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.AppIntegrations;
