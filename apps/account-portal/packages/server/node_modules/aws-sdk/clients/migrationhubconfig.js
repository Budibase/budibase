require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['migrationhubconfig'] = {};
AWS.MigrationHubConfig = Service.defineService('migrationhubconfig', ['2019-06-30']);
Object.defineProperty(apiLoader.services['migrationhubconfig'], '2019-06-30', {
  get: function get() {
    var model = require('../apis/migrationhub-config-2019-06-30.min.json');
    model.paginators = require('../apis/migrationhub-config-2019-06-30.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.MigrationHubConfig;
