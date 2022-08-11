require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['iotjobsdataplane'] = {};
AWS.IoTJobsDataPlane = Service.defineService('iotjobsdataplane', ['2017-09-29']);
Object.defineProperty(apiLoader.services['iotjobsdataplane'], '2017-09-29', {
  get: function get() {
    var model = require('../apis/iot-jobs-data-2017-09-29.min.json');
    model.paginators = require('../apis/iot-jobs-data-2017-09-29.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.IoTJobsDataPlane;
