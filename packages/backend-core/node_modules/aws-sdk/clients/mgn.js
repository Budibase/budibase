require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['mgn'] = {};
AWS.Mgn = Service.defineService('mgn', ['2020-02-26']);
Object.defineProperty(apiLoader.services['mgn'], '2020-02-26', {
  get: function get() {
    var model = require('../apis/mgn-2020-02-26.min.json');
    model.paginators = require('../apis/mgn-2020-02-26.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Mgn;
