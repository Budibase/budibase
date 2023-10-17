require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['bedrockruntime'] = {};
AWS.BedrockRuntime = Service.defineService('bedrockruntime', ['2023-09-30']);
Object.defineProperty(apiLoader.services['bedrockruntime'], '2023-09-30', {
  get: function get() {
    var model = require('../apis/bedrock-runtime-2023-09-30.min.json');
    model.paginators = require('../apis/bedrock-runtime-2023-09-30.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.BedrockRuntime;
