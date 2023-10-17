require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['rdsdataservice'] = {};
AWS.RDSDataService = Service.defineService('rdsdataservice', ['2018-08-01']);
require('../lib/services/rdsdataservice');
Object.defineProperty(apiLoader.services['rdsdataservice'], '2018-08-01', {
  get: function get() {
    var model = require('../apis/rds-data-2018-08-01.min.json');
    model.paginators = require('../apis/rds-data-2018-08-01.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.RDSDataService;
