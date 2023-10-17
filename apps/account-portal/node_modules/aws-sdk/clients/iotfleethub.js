require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['iotfleethub'] = {};
AWS.IoTFleetHub = Service.defineService('iotfleethub', ['2020-11-03']);
Object.defineProperty(apiLoader.services['iotfleethub'], '2020-11-03', {
  get: function get() {
    var model = require('../apis/iotfleethub-2020-11-03.min.json');
    model.paginators = require('../apis/iotfleethub-2020-11-03.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.IoTFleetHub;
