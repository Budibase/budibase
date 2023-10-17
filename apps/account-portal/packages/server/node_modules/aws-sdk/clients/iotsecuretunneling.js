require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['iotsecuretunneling'] = {};
AWS.IoTSecureTunneling = Service.defineService('iotsecuretunneling', ['2018-10-05']);
Object.defineProperty(apiLoader.services['iotsecuretunneling'], '2018-10-05', {
  get: function get() {
    var model = require('../apis/iotsecuretunneling-2018-10-05.min.json');
    model.paginators = require('../apis/iotsecuretunneling-2018-10-05.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.IoTSecureTunneling;
