require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['sagemakermetrics'] = {};
AWS.SageMakerMetrics = Service.defineService('sagemakermetrics', ['2022-09-30']);
Object.defineProperty(apiLoader.services['sagemakermetrics'], '2022-09-30', {
  get: function get() {
    var model = require('../apis/sagemaker-metrics-2022-09-30.min.json');
    model.paginators = require('../apis/sagemaker-metrics-2022-09-30.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.SageMakerMetrics;
