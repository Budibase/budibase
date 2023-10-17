require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['iotdeviceadvisor'] = {};
AWS.IotDeviceAdvisor = Service.defineService('iotdeviceadvisor', ['2020-09-18']);
Object.defineProperty(apiLoader.services['iotdeviceadvisor'], '2020-09-18', {
  get: function get() {
    var model = require('../apis/iotdeviceadvisor-2020-09-18.min.json');
    model.paginators = require('../apis/iotdeviceadvisor-2020-09-18.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.IotDeviceAdvisor;
