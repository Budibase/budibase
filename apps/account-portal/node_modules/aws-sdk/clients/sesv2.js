require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['sesv2'] = {};
AWS.SESV2 = Service.defineService('sesv2', ['2019-09-27']);
Object.defineProperty(apiLoader.services['sesv2'], '2019-09-27', {
  get: function get() {
    var model = require('../apis/sesv2-2019-09-27.min.json');
    model.paginators = require('../apis/sesv2-2019-09-27.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.SESV2;
