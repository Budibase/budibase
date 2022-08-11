require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['augmentedairuntime'] = {};
AWS.AugmentedAIRuntime = Service.defineService('augmentedairuntime', ['2019-11-07']);
Object.defineProperty(apiLoader.services['augmentedairuntime'], '2019-11-07', {
  get: function get() {
    var model = require('../apis/sagemaker-a2i-runtime-2019-11-07.min.json');
    model.paginators = require('../apis/sagemaker-a2i-runtime-2019-11-07.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.AugmentedAIRuntime;
