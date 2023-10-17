require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['amplifybackend'] = {};
AWS.AmplifyBackend = Service.defineService('amplifybackend', ['2020-08-11']);
Object.defineProperty(apiLoader.services['amplifybackend'], '2020-08-11', {
  get: function get() {
    var model = require('../apis/amplifybackend-2020-08-11.min.json');
    model.paginators = require('../apis/amplifybackend-2020-08-11.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.AmplifyBackend;
