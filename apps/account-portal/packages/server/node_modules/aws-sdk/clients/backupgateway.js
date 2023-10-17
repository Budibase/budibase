require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['backupgateway'] = {};
AWS.BackupGateway = Service.defineService('backupgateway', ['2021-01-01']);
Object.defineProperty(apiLoader.services['backupgateway'], '2021-01-01', {
  get: function get() {
    var model = require('../apis/backup-gateway-2021-01-01.min.json');
    model.paginators = require('../apis/backup-gateway-2021-01-01.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.BackupGateway;
