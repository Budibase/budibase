require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['applicationcostprofiler'] = {};
AWS.ApplicationCostProfiler = Service.defineService('applicationcostprofiler', ['2020-09-10']);
Object.defineProperty(apiLoader.services['applicationcostprofiler'], '2020-09-10', {
  get: function get() {
    var model = require('../apis/applicationcostprofiler-2020-09-10.min.json');
    model.paginators = require('../apis/applicationcostprofiler-2020-09-10.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.ApplicationCostProfiler;
