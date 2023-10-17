require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['managedblockchain'] = {};
AWS.ManagedBlockchain = Service.defineService('managedblockchain', ['2018-09-24']);
Object.defineProperty(apiLoader.services['managedblockchain'], '2018-09-24', {
  get: function get() {
    var model = require('../apis/managedblockchain-2018-09-24.min.json');
    model.paginators = require('../apis/managedblockchain-2018-09-24.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.ManagedBlockchain;
