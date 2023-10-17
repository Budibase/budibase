require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['marketplacemetering'] = {};
AWS.MarketplaceMetering = Service.defineService('marketplacemetering', ['2016-01-14']);
Object.defineProperty(apiLoader.services['marketplacemetering'], '2016-01-14', {
  get: function get() {
    var model = require('../apis/meteringmarketplace-2016-01-14.min.json');
    model.paginators = require('../apis/meteringmarketplace-2016-01-14.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.MarketplaceMetering;
