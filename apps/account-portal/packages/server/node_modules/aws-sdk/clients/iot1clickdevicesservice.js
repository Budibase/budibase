require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['iot1clickdevicesservice'] = {};
AWS.IoT1ClickDevicesService = Service.defineService('iot1clickdevicesservice', ['2018-05-14']);
Object.defineProperty(apiLoader.services['iot1clickdevicesservice'], '2018-05-14', {
  get: function get() {
    var model = require('../apis/iot1click-devices-2018-05-14.min.json');
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.IoT1ClickDevicesService;
