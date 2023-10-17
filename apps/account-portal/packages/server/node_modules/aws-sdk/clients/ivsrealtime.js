require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['ivsrealtime'] = {};
AWS.IVSRealTime = Service.defineService('ivsrealtime', ['2020-07-14']);
Object.defineProperty(apiLoader.services['ivsrealtime'], '2020-07-14', {
  get: function get() {
    var model = require('../apis/ivs-realtime-2020-07-14.min.json');
    model.paginators = require('../apis/ivs-realtime-2020-07-14.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.IVSRealTime;
