require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['internetmonitor'] = {};
AWS.InternetMonitor = Service.defineService('internetmonitor', ['2021-06-03']);
Object.defineProperty(apiLoader.services['internetmonitor'], '2021-06-03', {
  get: function get() {
    var model = require('../apis/internetmonitor-2021-06-03.min.json');
    model.paginators = require('../apis/internetmonitor-2021-06-03.paginators.json').pagination;
    model.waiters = require('../apis/internetmonitor-2021-06-03.waiters2.json').waiters;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.InternetMonitor;
