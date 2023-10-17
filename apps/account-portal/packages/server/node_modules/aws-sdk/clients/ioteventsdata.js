require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['ioteventsdata'] = {};
AWS.IoTEventsData = Service.defineService('ioteventsdata', ['2018-10-23']);
Object.defineProperty(apiLoader.services['ioteventsdata'], '2018-10-23', {
  get: function get() {
    var model = require('../apis/iotevents-data-2018-10-23.min.json');
    model.paginators = require('../apis/iotevents-data-2018-10-23.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.IoTEventsData;
