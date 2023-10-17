require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['appfabric'] = {};
AWS.AppFabric = Service.defineService('appfabric', ['2023-05-19']);
Object.defineProperty(apiLoader.services['appfabric'], '2023-05-19', {
  get: function get() {
    var model = require('../apis/appfabric-2023-05-19.min.json');
    model.paginators = require('../apis/appfabric-2023-05-19.paginators.json').pagination;
    model.waiters = require('../apis/appfabric-2023-05-19.waiters2.json').waiters;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.AppFabric;
