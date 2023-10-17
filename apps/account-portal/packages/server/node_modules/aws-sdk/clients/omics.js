require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['omics'] = {};
AWS.Omics = Service.defineService('omics', ['2022-11-28']);
Object.defineProperty(apiLoader.services['omics'], '2022-11-28', {
  get: function get() {
    var model = require('../apis/omics-2022-11-28.min.json');
    model.paginators = require('../apis/omics-2022-11-28.paginators.json').pagination;
    model.waiters = require('../apis/omics-2022-11-28.waiters2.json').waiters;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Omics;
