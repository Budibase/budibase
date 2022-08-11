require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['greengrassv2'] = {};
AWS.GreengrassV2 = Service.defineService('greengrassv2', ['2020-11-30']);
Object.defineProperty(apiLoader.services['greengrassv2'], '2020-11-30', {
  get: function get() {
    var model = require('../apis/greengrassv2-2020-11-30.min.json');
    model.paginators = require('../apis/greengrassv2-2020-11-30.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.GreengrassV2;
