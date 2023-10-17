require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['grafana'] = {};
AWS.Grafana = Service.defineService('grafana', ['2020-08-18']);
Object.defineProperty(apiLoader.services['grafana'], '2020-08-18', {
  get: function get() {
    var model = require('../apis/grafana-2020-08-18.min.json');
    model.paginators = require('../apis/grafana-2020-08-18.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Grafana;
