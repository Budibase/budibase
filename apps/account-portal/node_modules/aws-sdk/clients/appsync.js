require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['appsync'] = {};
AWS.AppSync = Service.defineService('appsync', ['2017-07-25']);
Object.defineProperty(apiLoader.services['appsync'], '2017-07-25', {
  get: function get() {
    var model = require('../apis/appsync-2017-07-25.min.json');
    model.paginators = require('../apis/appsync-2017-07-25.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.AppSync;
