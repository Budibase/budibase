require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['sagemakeredge'] = {};
AWS.SagemakerEdge = Service.defineService('sagemakeredge', ['2020-09-23']);
Object.defineProperty(apiLoader.services['sagemakeredge'], '2020-09-23', {
  get: function get() {
    var model = require('../apis/sagemaker-edge-2020-09-23.min.json');
    model.paginators = require('../apis/sagemaker-edge-2020-09-23.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.SagemakerEdge;
