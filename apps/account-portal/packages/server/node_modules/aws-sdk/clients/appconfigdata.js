require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['appconfigdata'] = {};
AWS.AppConfigData = Service.defineService('appconfigdata', ['2021-11-11']);
Object.defineProperty(apiLoader.services['appconfigdata'], '2021-11-11', {
  get: function get() {
    var model = require('../apis/appconfigdata-2021-11-11.min.json');
    model.paginators = require('../apis/appconfigdata-2021-11-11.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.AppConfigData;
