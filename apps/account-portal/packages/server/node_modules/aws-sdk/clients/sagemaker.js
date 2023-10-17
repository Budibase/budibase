require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['sagemaker'] = {};
AWS.SageMaker = Service.defineService('sagemaker', ['2017-07-24']);
Object.defineProperty(apiLoader.services['sagemaker'], '2017-07-24', {
  get: function get() {
    var model = require('../apis/sagemaker-2017-07-24.min.json');
    model.paginators = require('../apis/sagemaker-2017-07-24.paginators.json').pagination;
    model.waiters = require('../apis/sagemaker-2017-07-24.waiters2.json').waiters;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.SageMaker;
