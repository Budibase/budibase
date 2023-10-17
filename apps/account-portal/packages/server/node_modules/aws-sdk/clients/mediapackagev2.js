require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['mediapackagev2'] = {};
AWS.MediaPackageV2 = Service.defineService('mediapackagev2', ['2022-12-25']);
Object.defineProperty(apiLoader.services['mediapackagev2'], '2022-12-25', {
  get: function get() {
    var model = require('../apis/mediapackagev2-2022-12-25.min.json');
    model.paginators = require('../apis/mediapackagev2-2022-12-25.paginators.json').pagination;
    model.waiters = require('../apis/mediapackagev2-2022-12-25.waiters2.json').waiters;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.MediaPackageV2;
