require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['servicediscovery'] = {};
AWS.ServiceDiscovery = Service.defineService('servicediscovery', ['2017-03-14']);
Object.defineProperty(apiLoader.services['servicediscovery'], '2017-03-14', {
  get: function get() {
    var model = require('../apis/servicediscovery-2017-03-14.min.json');
    model.paginators = require('../apis/servicediscovery-2017-03-14.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.ServiceDiscovery;
