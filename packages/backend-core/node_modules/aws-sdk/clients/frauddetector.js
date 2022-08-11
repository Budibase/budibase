require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['frauddetector'] = {};
AWS.FraudDetector = Service.defineService('frauddetector', ['2019-11-15']);
Object.defineProperty(apiLoader.services['frauddetector'], '2019-11-15', {
  get: function get() {
    var model = require('../apis/frauddetector-2019-11-15.min.json');
    model.paginators = require('../apis/frauddetector-2019-11-15.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.FraudDetector;
