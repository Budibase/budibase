require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['comprehend'] = {};
AWS.Comprehend = Service.defineService('comprehend', ['2017-11-27']);
Object.defineProperty(apiLoader.services['comprehend'], '2017-11-27', {
  get: function get() {
    var model = require('../apis/comprehend-2017-11-27.min.json');
    model.paginators = require('../apis/comprehend-2017-11-27.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Comprehend;
