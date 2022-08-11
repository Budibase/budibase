require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['apigatewaymanagementapi'] = {};
AWS.ApiGatewayManagementApi = Service.defineService('apigatewaymanagementapi', ['2018-11-29']);
Object.defineProperty(apiLoader.services['apigatewaymanagementapi'], '2018-11-29', {
  get: function get() {
    var model = require('../apis/apigatewaymanagementapi-2018-11-29.min.json');
    model.paginators = require('../apis/apigatewaymanagementapi-2018-11-29.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.ApiGatewayManagementApi;
