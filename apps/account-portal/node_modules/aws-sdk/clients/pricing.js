require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['pricing'] = {};
AWS.Pricing = Service.defineService('pricing', ['2017-10-15']);
Object.defineProperty(apiLoader.services['pricing'], '2017-10-15', {
  get: function get() {
    var model = require('../apis/pricing-2017-10-15.min.json');
    model.paginators = require('../apis/pricing-2017-10-15.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Pricing;
