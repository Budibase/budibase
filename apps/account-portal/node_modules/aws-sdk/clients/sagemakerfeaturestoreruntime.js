require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['sagemakerfeaturestoreruntime'] = {};
AWS.SageMakerFeatureStoreRuntime = Service.defineService('sagemakerfeaturestoreruntime', ['2020-07-01']);
Object.defineProperty(apiLoader.services['sagemakerfeaturestoreruntime'], '2020-07-01', {
  get: function get() {
    var model = require('../apis/sagemaker-featurestore-runtime-2020-07-01.min.json');
    model.paginators = require('../apis/sagemaker-featurestore-runtime-2020-07-01.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.SageMakerFeatureStoreRuntime;
