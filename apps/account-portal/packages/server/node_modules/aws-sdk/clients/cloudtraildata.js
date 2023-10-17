require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['cloudtraildata'] = {};
AWS.CloudTrailData = Service.defineService('cloudtraildata', ['2021-08-11']);
Object.defineProperty(apiLoader.services['cloudtraildata'], '2021-08-11', {
  get: function get() {
    var model = require('../apis/cloudtrail-data-2021-08-11.min.json');
    model.paginators = require('../apis/cloudtrail-data-2021-08-11.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.CloudTrailData;
