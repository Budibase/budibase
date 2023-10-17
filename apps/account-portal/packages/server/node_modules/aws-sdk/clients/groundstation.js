require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['groundstation'] = {};
AWS.GroundStation = Service.defineService('groundstation', ['2019-05-23']);
Object.defineProperty(apiLoader.services['groundstation'], '2019-05-23', {
  get: function get() {
    var model = require('../apis/groundstation-2019-05-23.min.json');
    model.paginators = require('../apis/groundstation-2019-05-23.paginators.json').pagination;
    model.waiters = require('../apis/groundstation-2019-05-23.waiters2.json').waiters;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.GroundStation;
