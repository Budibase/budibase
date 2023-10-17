require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['bedrock'] = {};
AWS.Bedrock = Service.defineService('bedrock', ['2023-04-20']);
Object.defineProperty(apiLoader.services['bedrock'], '2023-04-20', {
  get: function get() {
    var model = require('../apis/bedrock-2023-04-20.min.json');
    model.paginators = require('../apis/bedrock-2023-04-20.paginators.json').pagination;
    model.waiters = require('../apis/bedrock-2023-04-20.waiters2.json').waiters;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Bedrock;
