require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['marketplacecatalog'] = {};
AWS.MarketplaceCatalog = Service.defineService('marketplacecatalog', ['2018-09-17']);
Object.defineProperty(apiLoader.services['marketplacecatalog'], '2018-09-17', {
  get: function get() {
    var model = require('../apis/marketplace-catalog-2018-09-17.min.json');
    model.paginators = require('../apis/marketplace-catalog-2018-09-17.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.MarketplaceCatalog;
