require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['m2'] = {};
AWS.M2 = Service.defineService('m2', ['2021-04-28']);
Object.defineProperty(apiLoader.services['m2'], '2021-04-28', {
  get: function get() {
    var model = require('../apis/m2-2021-04-28.min.json');
    model.paginators = require('../apis/m2-2021-04-28.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.M2;
