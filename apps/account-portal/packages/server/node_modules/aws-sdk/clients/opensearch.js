require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['opensearch'] = {};
AWS.OpenSearch = Service.defineService('opensearch', ['2021-01-01']);
Object.defineProperty(apiLoader.services['opensearch'], '2021-01-01', {
  get: function get() {
    var model = require('../apis/opensearch-2021-01-01.min.json');
    model.paginators = require('../apis/opensearch-2021-01-01.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.OpenSearch;
