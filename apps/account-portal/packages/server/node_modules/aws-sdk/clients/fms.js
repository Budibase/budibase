require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['fms'] = {};
AWS.FMS = Service.defineService('fms', ['2018-01-01']);
Object.defineProperty(apiLoader.services['fms'], '2018-01-01', {
  get: function get() {
    var model = require('../apis/fms-2018-01-01.min.json');
    model.paginators = require('../apis/fms-2018-01-01.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.FMS;
