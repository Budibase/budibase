require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['datasync'] = {};
AWS.DataSync = Service.defineService('datasync', ['2018-11-09']);
Object.defineProperty(apiLoader.services['datasync'], '2018-11-09', {
  get: function get() {
    var model = require('../apis/datasync-2018-11-09.min.json');
    model.paginators = require('../apis/datasync-2018-11-09.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.DataSync;
