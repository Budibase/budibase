require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['appflow'] = {};
AWS.Appflow = Service.defineService('appflow', ['2020-08-23']);
Object.defineProperty(apiLoader.services['appflow'], '2020-08-23', {
  get: function get() {
    var model = require('../apis/appflow-2020-08-23.min.json');
    model.paginators = require('../apis/appflow-2020-08-23.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Appflow;
