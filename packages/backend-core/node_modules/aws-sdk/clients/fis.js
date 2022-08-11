require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['fis'] = {};
AWS.Fis = Service.defineService('fis', ['2020-12-01']);
Object.defineProperty(apiLoader.services['fis'], '2020-12-01', {
  get: function get() {
    var model = require('../apis/fis-2020-12-01.min.json');
    model.paginators = require('../apis/fis-2020-12-01.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Fis;
