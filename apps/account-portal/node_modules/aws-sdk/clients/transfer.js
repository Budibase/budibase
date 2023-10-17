require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['transfer'] = {};
AWS.Transfer = Service.defineService('transfer', ['2018-11-05']);
Object.defineProperty(apiLoader.services['transfer'], '2018-11-05', {
  get: function get() {
    var model = require('../apis/transfer-2018-11-05.min.json');
    model.paginators = require('../apis/transfer-2018-11-05.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Transfer;
