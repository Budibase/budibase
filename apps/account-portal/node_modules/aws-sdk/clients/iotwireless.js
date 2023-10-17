require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['iotwireless'] = {};
AWS.IoTWireless = Service.defineService('iotwireless', ['2020-11-22']);
Object.defineProperty(apiLoader.services['iotwireless'], '2020-11-22', {
  get: function get() {
    var model = require('../apis/iotwireless-2020-11-22.min.json');
    model.paginators = require('../apis/iotwireless-2020-11-22.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.IoTWireless;
