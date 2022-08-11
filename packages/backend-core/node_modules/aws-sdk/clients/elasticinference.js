require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['elasticinference'] = {};
AWS.ElasticInference = Service.defineService('elasticinference', ['2017-07-25']);
Object.defineProperty(apiLoader.services['elasticinference'], '2017-07-25', {
  get: function get() {
    var model = require('../apis/elastic-inference-2017-07-25.min.json');
    model.paginators = require('../apis/elastic-inference-2017-07-25.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.ElasticInference;
