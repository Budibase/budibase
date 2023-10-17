require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['scheduler'] = {};
AWS.Scheduler = Service.defineService('scheduler', ['2021-06-30']);
Object.defineProperty(apiLoader.services['scheduler'], '2021-06-30', {
  get: function get() {
    var model = require('../apis/scheduler-2021-06-30.min.json');
    model.paginators = require('../apis/scheduler-2021-06-30.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Scheduler;
