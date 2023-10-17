require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['snowdevicemanagement'] = {};
AWS.SnowDeviceManagement = Service.defineService('snowdevicemanagement', ['2021-08-04']);
Object.defineProperty(apiLoader.services['snowdevicemanagement'], '2021-08-04', {
  get: function get() {
    var model = require('../apis/snow-device-management-2021-08-04.min.json');
    model.paginators = require('../apis/snow-device-management-2021-08-04.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.SnowDeviceManagement;
