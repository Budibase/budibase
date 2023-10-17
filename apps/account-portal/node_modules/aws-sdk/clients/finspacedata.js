require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['finspacedata'] = {};
AWS.Finspacedata = Service.defineService('finspacedata', ['2020-07-13']);
Object.defineProperty(apiLoader.services['finspacedata'], '2020-07-13', {
  get: function get() {
    var model = require('../apis/finspace-data-2020-07-13.min.json');
    model.paginators = require('../apis/finspace-data-2020-07-13.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Finspacedata;
