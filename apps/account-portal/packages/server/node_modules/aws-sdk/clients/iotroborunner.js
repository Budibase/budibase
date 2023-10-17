require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['iotroborunner'] = {};
AWS.IoTRoboRunner = Service.defineService('iotroborunner', ['2018-05-10']);
Object.defineProperty(apiLoader.services['iotroborunner'], '2018-05-10', {
  get: function get() {
    var model = require('../apis/iot-roborunner-2018-05-10.min.json');
    model.paginators = require('../apis/iot-roborunner-2018-05-10.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.IoTRoboRunner;
