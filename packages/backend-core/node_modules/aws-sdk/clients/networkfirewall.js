require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['networkfirewall'] = {};
AWS.NetworkFirewall = Service.defineService('networkfirewall', ['2020-11-12']);
Object.defineProperty(apiLoader.services['networkfirewall'], '2020-11-12', {
  get: function get() {
    var model = require('../apis/network-firewall-2020-11-12.min.json');
    model.paginators = require('../apis/network-firewall-2020-11-12.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.NetworkFirewall;
