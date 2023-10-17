require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['connect'] = {};
AWS.Connect = Service.defineService('connect', ['2017-08-08']);
Object.defineProperty(apiLoader.services['connect'], '2017-08-08', {
  get: function get() {
    var model = require('../apis/connect-2017-08-08.min.json');
    model.paginators = require('../apis/connect-2017-08-08.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Connect;
