require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['networkmanager'] = {};
AWS.NetworkManager = Service.defineService('networkmanager', ['2019-07-05']);
Object.defineProperty(apiLoader.services['networkmanager'], '2019-07-05', {
  get: function get() {
    var model = require('../apis/networkmanager-2019-07-05.min.json');
    model.paginators = require('../apis/networkmanager-2019-07-05.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.NetworkManager;
