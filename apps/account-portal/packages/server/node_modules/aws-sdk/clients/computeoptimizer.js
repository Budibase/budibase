require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['computeoptimizer'] = {};
AWS.ComputeOptimizer = Service.defineService('computeoptimizer', ['2019-11-01']);
Object.defineProperty(apiLoader.services['computeoptimizer'], '2019-11-01', {
  get: function get() {
    var model = require('../apis/compute-optimizer-2019-11-01.min.json');
    model.paginators = require('../apis/compute-optimizer-2019-11-01.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.ComputeOptimizer;
