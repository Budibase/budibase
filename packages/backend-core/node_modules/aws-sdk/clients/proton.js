require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['proton'] = {};
AWS.Proton = Service.defineService('proton', ['2020-07-20']);
Object.defineProperty(apiLoader.services['proton'], '2020-07-20', {
  get: function get() {
    var model = require('../apis/proton-2020-07-20.min.json');
    model.paginators = require('../apis/proton-2020-07-20.paginators.json').pagination;
    model.waiters = require('../apis/proton-2020-07-20.waiters2.json').waiters;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Proton;
