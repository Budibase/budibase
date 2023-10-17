require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['lookoutmetrics'] = {};
AWS.LookoutMetrics = Service.defineService('lookoutmetrics', ['2017-07-25']);
Object.defineProperty(apiLoader.services['lookoutmetrics'], '2017-07-25', {
  get: function get() {
    var model = require('../apis/lookoutmetrics-2017-07-25.min.json');
    model.paginators = require('../apis/lookoutmetrics-2017-07-25.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.LookoutMetrics;
