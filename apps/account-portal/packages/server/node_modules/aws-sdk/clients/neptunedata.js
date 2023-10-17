require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['neptunedata'] = {};
AWS.Neptunedata = Service.defineService('neptunedata', ['2023-08-01']);
Object.defineProperty(apiLoader.services['neptunedata'], '2023-08-01', {
  get: function get() {
    var model = require('../apis/neptunedata-2023-08-01.min.json');
    model.paginators = require('../apis/neptunedata-2023-08-01.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Neptunedata;
