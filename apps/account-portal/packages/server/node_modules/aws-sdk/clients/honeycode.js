require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['honeycode'] = {};
AWS.Honeycode = Service.defineService('honeycode', ['2020-03-01']);
Object.defineProperty(apiLoader.services['honeycode'], '2020-03-01', {
  get: function get() {
    var model = require('../apis/honeycode-2020-03-01.min.json');
    model.paginators = require('../apis/honeycode-2020-03-01.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Honeycode;
