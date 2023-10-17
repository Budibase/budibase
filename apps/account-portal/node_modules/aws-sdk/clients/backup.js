require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['backup'] = {};
AWS.Backup = Service.defineService('backup', ['2018-11-15']);
Object.defineProperty(apiLoader.services['backup'], '2018-11-15', {
  get: function get() {
    var model = require('../apis/backup-2018-11-15.min.json');
    model.paginators = require('../apis/backup-2018-11-15.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Backup;
