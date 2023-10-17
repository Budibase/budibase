require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['oam'] = {};
AWS.OAM = Service.defineService('oam', ['2022-06-10']);
Object.defineProperty(apiLoader.services['oam'], '2022-06-10', {
  get: function get() {
    var model = require('../apis/oam-2022-06-10.min.json');
    model.paginators = require('../apis/oam-2022-06-10.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.OAM;
