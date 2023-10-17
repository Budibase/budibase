require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['appconfig'] = {};
AWS.AppConfig = Service.defineService('appconfig', ['2019-10-09']);
Object.defineProperty(apiLoader.services['appconfig'], '2019-10-09', {
  get: function get() {
    var model = require('../apis/appconfig-2019-10-09.min.json');
    model.paginators = require('../apis/appconfig-2019-10-09.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.AppConfig;
