require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['managedblockchainquery'] = {};
AWS.ManagedBlockchainQuery = Service.defineService('managedblockchainquery', ['2023-05-04']);
Object.defineProperty(apiLoader.services['managedblockchainquery'], '2023-05-04', {
  get: function get() {
    var model = require('../apis/managedblockchain-query-2023-05-04.min.json');
    model.paginators = require('../apis/managedblockchain-query-2023-05-04.paginators.json').pagination;
    model.waiters = require('../apis/managedblockchain-query-2023-05-04.waiters2.json').waiters;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.ManagedBlockchainQuery;
