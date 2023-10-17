require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['migrationhubstrategy'] = {};
AWS.MigrationHubStrategy = Service.defineService('migrationhubstrategy', ['2020-02-19']);
Object.defineProperty(apiLoader.services['migrationhubstrategy'], '2020-02-19', {
  get: function get() {
    var model = require('../apis/migrationhubstrategy-2020-02-19.min.json');
    model.paginators = require('../apis/migrationhubstrategy-2020-02-19.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.MigrationHubStrategy;
