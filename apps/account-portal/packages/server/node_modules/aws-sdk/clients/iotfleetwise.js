require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['iotfleetwise'] = {};
AWS.IoTFleetWise = Service.defineService('iotfleetwise', ['2021-06-17']);
Object.defineProperty(apiLoader.services['iotfleetwise'], '2021-06-17', {
  get: function get() {
    var model = require('../apis/iotfleetwise-2021-06-17.min.json');
    model.paginators = require('../apis/iotfleetwise-2021-06-17.paginators.json').pagination;
    model.waiters = require('../apis/iotfleetwise-2021-06-17.waiters2.json').waiters;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.IoTFleetWise;
