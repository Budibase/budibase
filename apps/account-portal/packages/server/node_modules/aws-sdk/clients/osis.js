require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['osis'] = {};
AWS.OSIS = Service.defineService('osis', ['2022-01-01']);
Object.defineProperty(apiLoader.services['osis'], '2022-01-01', {
  get: function get() {
    var model = require('../apis/osis-2022-01-01.min.json');
    model.paginators = require('../apis/osis-2022-01-01.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.OSIS;
