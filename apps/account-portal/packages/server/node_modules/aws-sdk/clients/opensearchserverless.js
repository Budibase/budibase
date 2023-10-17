require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['opensearchserverless'] = {};
AWS.OpenSearchServerless = Service.defineService('opensearchserverless', ['2021-11-01']);
Object.defineProperty(apiLoader.services['opensearchserverless'], '2021-11-01', {
  get: function get() {
    var model = require('../apis/opensearchserverless-2021-11-01.min.json');
    model.paginators = require('../apis/opensearchserverless-2021-11-01.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.OpenSearchServerless;
