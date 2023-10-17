require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['lakeformation'] = {};
AWS.LakeFormation = Service.defineService('lakeformation', ['2017-03-31']);
Object.defineProperty(apiLoader.services['lakeformation'], '2017-03-31', {
  get: function get() {
    var model = require('../apis/lakeformation-2017-03-31.min.json');
    model.paginators = require('../apis/lakeformation-2017-03-31.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.LakeFormation;
