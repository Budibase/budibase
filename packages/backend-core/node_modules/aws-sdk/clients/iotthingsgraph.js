require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['iotthingsgraph'] = {};
AWS.IoTThingsGraph = Service.defineService('iotthingsgraph', ['2018-09-06']);
Object.defineProperty(apiLoader.services['iotthingsgraph'], '2018-09-06', {
  get: function get() {
    var model = require('../apis/iotthingsgraph-2018-09-06.min.json');
    model.paginators = require('../apis/iotthingsgraph-2018-09-06.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.IoTThingsGraph;
