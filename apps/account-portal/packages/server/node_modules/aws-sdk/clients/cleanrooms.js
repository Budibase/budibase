require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['cleanrooms'] = {};
AWS.CleanRooms = Service.defineService('cleanrooms', ['2022-02-17']);
Object.defineProperty(apiLoader.services['cleanrooms'], '2022-02-17', {
  get: function get() {
    var model = require('../apis/cleanrooms-2022-02-17.min.json');
    model.paginators = require('../apis/cleanrooms-2022-02-17.paginators.json').pagination;
    model.waiters = require('../apis/cleanrooms-2022-02-17.waiters2.json').waiters;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.CleanRooms;
