require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['keyspaces'] = {};
AWS.Keyspaces = Service.defineService('keyspaces', ['2022-02-10']);
Object.defineProperty(apiLoader.services['keyspaces'], '2022-02-10', {
  get: function get() {
    var model = require('../apis/keyspaces-2022-02-10.min.json');
    model.paginators = require('../apis/keyspaces-2022-02-10.paginators.json').pagination;
    model.waiters = require('../apis/keyspaces-2022-02-10.waiters2.json').waiters;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Keyspaces;
