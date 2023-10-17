require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['codecatalyst'] = {};
AWS.CodeCatalyst = Service.defineService('codecatalyst', ['2022-09-28']);
Object.defineProperty(apiLoader.services['codecatalyst'], '2022-09-28', {
  get: function get() {
    var model = require('../apis/codecatalyst-2022-09-28.min.json');
    model.paginators = require('../apis/codecatalyst-2022-09-28.paginators.json').pagination;
    model.waiters = require('../apis/codecatalyst-2022-09-28.waiters2.json').waiters;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.CodeCatalyst;
