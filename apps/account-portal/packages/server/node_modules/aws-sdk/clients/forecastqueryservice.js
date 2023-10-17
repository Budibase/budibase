require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['forecastqueryservice'] = {};
AWS.ForecastQueryService = Service.defineService('forecastqueryservice', ['2018-06-26']);
Object.defineProperty(apiLoader.services['forecastqueryservice'], '2018-06-26', {
  get: function get() {
    var model = require('../apis/forecastquery-2018-06-26.min.json');
    model.paginators = require('../apis/forecastquery-2018-06-26.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.ForecastQueryService;
