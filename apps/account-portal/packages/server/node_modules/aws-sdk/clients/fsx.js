require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['fsx'] = {};
AWS.FSx = Service.defineService('fsx', ['2018-03-01']);
Object.defineProperty(apiLoader.services['fsx'], '2018-03-01', {
  get: function get() {
    var model = require('../apis/fsx-2018-03-01.min.json');
    model.paginators = require('../apis/fsx-2018-03-01.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.FSx;
