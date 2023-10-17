require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['eventbridge'] = {};
AWS.EventBridge = Service.defineService('eventbridge', ['2015-10-07']);
require('../lib/services/eventbridge');
Object.defineProperty(apiLoader.services['eventbridge'], '2015-10-07', {
  get: function get() {
    var model = require('../apis/eventbridge-2015-10-07.min.json');
    model.paginators = require('../apis/eventbridge-2015-10-07.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.EventBridge;
