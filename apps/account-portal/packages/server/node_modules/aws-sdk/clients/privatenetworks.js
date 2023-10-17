require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['privatenetworks'] = {};
AWS.PrivateNetworks = Service.defineService('privatenetworks', ['2021-12-03']);
Object.defineProperty(apiLoader.services['privatenetworks'], '2021-12-03', {
  get: function get() {
    var model = require('../apis/privatenetworks-2021-12-03.min.json');
    model.paginators = require('../apis/privatenetworks-2021-12-03.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.PrivateNetworks;
