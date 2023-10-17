require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['ivs'] = {};
AWS.IVS = Service.defineService('ivs', ['2020-07-14']);
Object.defineProperty(apiLoader.services['ivs'], '2020-07-14', {
  get: function get() {
    var model = require('../apis/ivs-2020-07-14.min.json');
    model.paginators = require('../apis/ivs-2020-07-14.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.IVS;
