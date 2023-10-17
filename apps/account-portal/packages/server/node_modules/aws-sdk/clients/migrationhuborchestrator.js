require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['migrationhuborchestrator'] = {};
AWS.MigrationHubOrchestrator = Service.defineService('migrationhuborchestrator', ['2021-08-28']);
Object.defineProperty(apiLoader.services['migrationhuborchestrator'], '2021-08-28', {
  get: function get() {
    var model = require('../apis/migrationhuborchestrator-2021-08-28.min.json');
    model.paginators = require('../apis/migrationhuborchestrator-2021-08-28.paginators.json').pagination;
    model.waiters = require('../apis/migrationhuborchestrator-2021-08-28.waiters2.json').waiters;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.MigrationHubOrchestrator;
