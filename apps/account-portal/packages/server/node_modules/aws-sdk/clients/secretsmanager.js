require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['secretsmanager'] = {};
AWS.SecretsManager = Service.defineService('secretsmanager', ['2017-10-17']);
Object.defineProperty(apiLoader.services['secretsmanager'], '2017-10-17', {
  get: function get() {
    var model = require('../apis/secretsmanager-2017-10-17.min.json');
    model.paginators = require('../apis/secretsmanager-2017-10-17.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.SecretsManager;
