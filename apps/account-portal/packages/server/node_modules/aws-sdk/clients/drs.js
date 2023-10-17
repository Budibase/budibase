require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['drs'] = {};
AWS.Drs = Service.defineService('drs', ['2020-02-26']);
Object.defineProperty(apiLoader.services['drs'], '2020-02-26', {
  get: function get() {
    var model = require('../apis/drs-2020-02-26.min.json');
    model.paginators = require('../apis/drs-2020-02-26.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Drs;
