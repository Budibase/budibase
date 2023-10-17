require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['costexplorer'] = {};
AWS.CostExplorer = Service.defineService('costexplorer', ['2017-10-25']);
Object.defineProperty(apiLoader.services['costexplorer'], '2017-10-25', {
  get: function get() {
    var model = require('../apis/ce-2017-10-25.min.json');
    model.paginators = require('../apis/ce-2017-10-25.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.CostExplorer;
