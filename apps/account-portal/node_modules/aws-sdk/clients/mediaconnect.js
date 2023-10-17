require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['mediaconnect'] = {};
AWS.MediaConnect = Service.defineService('mediaconnect', ['2018-11-14']);
Object.defineProperty(apiLoader.services['mediaconnect'], '2018-11-14', {
  get: function get() {
    var model = require('../apis/mediaconnect-2018-11-14.min.json');
    model.paginators = require('../apis/mediaconnect-2018-11-14.paginators.json').pagination;
    model.waiters = require('../apis/mediaconnect-2018-11-14.waiters2.json').waiters;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.MediaConnect;
