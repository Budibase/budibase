require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['rbin'] = {};
AWS.Rbin = Service.defineService('rbin', ['2021-06-15']);
Object.defineProperty(apiLoader.services['rbin'], '2021-06-15', {
  get: function get() {
    var model = require('../apis/rbin-2021-06-15.min.json');
    model.paginators = require('../apis/rbin-2021-06-15.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Rbin;
