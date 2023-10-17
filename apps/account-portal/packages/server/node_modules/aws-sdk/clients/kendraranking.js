require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['kendraranking'] = {};
AWS.KendraRanking = Service.defineService('kendraranking', ['2022-10-19']);
Object.defineProperty(apiLoader.services['kendraranking'], '2022-10-19', {
  get: function get() {
    var model = require('../apis/kendra-ranking-2022-10-19.min.json');
    model.paginators = require('../apis/kendra-ranking-2022-10-19.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.KendraRanking;
