require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['sagemakerruntime'] = {};
AWS.SageMakerRuntime = Service.defineService('sagemakerruntime', ['2017-05-13']);
Object.defineProperty(apiLoader.services['sagemakerruntime'], '2017-05-13', {
  get: function get() {
    var model = require('../apis/runtime.sagemaker-2017-05-13.min.json');
    model.paginators = require('../apis/runtime.sagemaker-2017-05-13.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.SageMakerRuntime;
