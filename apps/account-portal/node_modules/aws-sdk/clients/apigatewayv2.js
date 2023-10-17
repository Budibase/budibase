require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['apigatewayv2'] = {};
AWS.ApiGatewayV2 = Service.defineService('apigatewayv2', ['2018-11-29']);
Object.defineProperty(apiLoader.services['apigatewayv2'], '2018-11-29', {
  get: function get() {
    var model = require('../apis/apigatewayv2-2018-11-29.min.json');
    model.paginators = require('../apis/apigatewayv2-2018-11-29.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.ApiGatewayV2;
