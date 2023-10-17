require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['redshiftdata'] = {};
AWS.RedshiftData = Service.defineService('redshiftdata', ['2019-12-20']);
Object.defineProperty(apiLoader.services['redshiftdata'], '2019-12-20', {
  get: function get() {
    var model = require('../apis/redshift-data-2019-12-20.min.json');
    model.paginators = require('../apis/redshift-data-2019-12-20.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.RedshiftData;
