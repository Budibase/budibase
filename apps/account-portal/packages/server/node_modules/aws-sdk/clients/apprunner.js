require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['apprunner'] = {};
AWS.AppRunner = Service.defineService('apprunner', ['2020-05-15']);
Object.defineProperty(apiLoader.services['apprunner'], '2020-05-15', {
  get: function get() {
    var model = require('../apis/apprunner-2020-05-15.min.json');
    model.paginators = require('../apis/apprunner-2020-05-15.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.AppRunner;
