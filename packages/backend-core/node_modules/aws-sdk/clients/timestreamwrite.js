require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['timestreamwrite'] = {};
AWS.TimestreamWrite = Service.defineService('timestreamwrite', ['2018-11-01']);
Object.defineProperty(apiLoader.services['timestreamwrite'], '2018-11-01', {
  get: function get() {
    var model = require('../apis/timestream-write-2018-11-01.min.json');
    model.paginators = require('../apis/timestream-write-2018-11-01.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.TimestreamWrite;
