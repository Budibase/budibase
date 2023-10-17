require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['backupstorage'] = {};
AWS.BackupStorage = Service.defineService('backupstorage', ['2018-04-10']);
Object.defineProperty(apiLoader.services['backupstorage'], '2018-04-10', {
  get: function get() {
    var model = require('../apis/backupstorage-2018-04-10.min.json');
    model.paginators = require('../apis/backupstorage-2018-04-10.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.BackupStorage;
