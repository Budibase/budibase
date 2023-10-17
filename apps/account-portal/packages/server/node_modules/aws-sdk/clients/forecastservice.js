require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['forecastservice'] = {};
AWS.ForecastService = Service.defineService('forecastservice', ['2018-06-26']);
Object.defineProperty(apiLoader.services['forecastservice'], '2018-06-26', {
  get: function get() {
    var model = require('../apis/forecast-2018-06-26.min.json');
    model.paginators = require('../apis/forecast-2018-06-26.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.ForecastService;
