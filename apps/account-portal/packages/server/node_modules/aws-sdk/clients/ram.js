require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['ram'] = {};
AWS.RAM = Service.defineService('ram', ['2018-01-04']);
Object.defineProperty(apiLoader.services['ram'], '2018-01-04', {
  get: function get() {
    var model = require('../apis/ram-2018-01-04.min.json');
    model.paginators = require('../apis/ram-2018-01-04.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.RAM;
