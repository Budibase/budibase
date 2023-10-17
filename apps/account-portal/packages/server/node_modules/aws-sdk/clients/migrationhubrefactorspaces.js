require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['migrationhubrefactorspaces'] = {};
AWS.MigrationHubRefactorSpaces = Service.defineService('migrationhubrefactorspaces', ['2021-10-26']);
Object.defineProperty(apiLoader.services['migrationhubrefactorspaces'], '2021-10-26', {
  get: function get() {
    var model = require('../apis/migration-hub-refactor-spaces-2021-10-26.min.json');
    model.paginators = require('../apis/migration-hub-refactor-spaces-2021-10-26.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.MigrationHubRefactorSpaces;
