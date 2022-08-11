require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['route53resolver'] = {};
AWS.Route53Resolver = Service.defineService('route53resolver', ['2018-04-01']);
Object.defineProperty(apiLoader.services['route53resolver'], '2018-04-01', {
  get: function get() {
    var model = require('../apis/route53resolver-2018-04-01.min.json');
    model.paginators = require('../apis/route53resolver-2018-04-01.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Route53Resolver;
