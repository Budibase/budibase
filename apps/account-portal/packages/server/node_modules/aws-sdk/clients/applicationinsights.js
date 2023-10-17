require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['applicationinsights'] = {};
AWS.ApplicationInsights = Service.defineService('applicationinsights', ['2018-11-25']);
Object.defineProperty(apiLoader.services['applicationinsights'], '2018-11-25', {
  get: function get() {
    var model = require('../apis/application-insights-2018-11-25.min.json');
    model.paginators = require('../apis/application-insights-2018-11-25.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.ApplicationInsights;
