require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['iotevents'] = {};
AWS.IoTEvents = Service.defineService('iotevents', ['2018-07-27']);
Object.defineProperty(apiLoader.services['iotevents'], '2018-07-27', {
  get: function get() {
    var model = require('../apis/iotevents-2018-07-27.min.json');
    model.paginators = require('../apis/iotevents-2018-07-27.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.IoTEvents;
