require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['servicequotas'] = {};
AWS.ServiceQuotas = Service.defineService('servicequotas', ['2019-06-24']);
Object.defineProperty(apiLoader.services['servicequotas'], '2019-06-24', {
  get: function get() {
    var model = require('../apis/service-quotas-2019-06-24.min.json');
    model.paginators = require('../apis/service-quotas-2019-06-24.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.ServiceQuotas;
