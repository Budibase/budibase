require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['supportapp'] = {};
AWS.SupportApp = Service.defineService('supportapp', ['2021-08-20']);
Object.defineProperty(apiLoader.services['supportapp'], '2021-08-20', {
  get: function get() {
    var model = require('../apis/support-app-2021-08-20.min.json');
    model.paginators = require('../apis/support-app-2021-08-20.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.SupportApp;
