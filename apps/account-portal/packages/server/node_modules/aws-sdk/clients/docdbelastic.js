require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['docdbelastic'] = {};
AWS.DocDBElastic = Service.defineService('docdbelastic', ['2022-11-28']);
Object.defineProperty(apiLoader.services['docdbelastic'], '2022-11-28', {
  get: function get() {
    var model = require('../apis/docdb-elastic-2022-11-28.min.json');
    model.paginators = require('../apis/docdb-elastic-2022-11-28.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.DocDBElastic;
