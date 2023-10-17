require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['iottwinmaker'] = {};
AWS.IoTTwinMaker = Service.defineService('iottwinmaker', ['2021-11-29']);
Object.defineProperty(apiLoader.services['iottwinmaker'], '2021-11-29', {
  get: function get() {
    var model = require('../apis/iottwinmaker-2021-11-29.min.json');
    model.paginators = require('../apis/iottwinmaker-2021-11-29.paginators.json').pagination;
    model.waiters = require('../apis/iottwinmaker-2021-11-29.waiters2.json').waiters;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.IoTTwinMaker;
