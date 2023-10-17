require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['servicecatalogappregistry'] = {};
AWS.ServiceCatalogAppRegistry = Service.defineService('servicecatalogappregistry', ['2020-06-24']);
Object.defineProperty(apiLoader.services['servicecatalogappregistry'], '2020-06-24', {
  get: function get() {
    var model = require('../apis/servicecatalog-appregistry-2020-06-24.min.json');
    model.paginators = require('../apis/servicecatalog-appregistry-2020-06-24.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.ServiceCatalogAppRegistry;
