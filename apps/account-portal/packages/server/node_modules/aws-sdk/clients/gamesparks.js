require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['gamesparks'] = {};
AWS.GameSparks = Service.defineService('gamesparks', ['2021-08-17']);
Object.defineProperty(apiLoader.services['gamesparks'], '2021-08-17', {
  get: function get() {
    var model = require('../apis/gamesparks-2021-08-17.min.json');
    model.paginators = require('../apis/gamesparks-2021-08-17.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.GameSparks;
