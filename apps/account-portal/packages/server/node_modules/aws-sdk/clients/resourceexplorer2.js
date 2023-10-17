require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['resourceexplorer2'] = {};
AWS.ResourceExplorer2 = Service.defineService('resourceexplorer2', ['2022-07-28']);
Object.defineProperty(apiLoader.services['resourceexplorer2'], '2022-07-28', {
  get: function get() {
    var model = require('../apis/resource-explorer-2-2022-07-28.min.json');
    model.paginators = require('../apis/resource-explorer-2-2022-07-28.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.ResourceExplorer2;
