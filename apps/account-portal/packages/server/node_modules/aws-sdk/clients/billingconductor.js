require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['billingconductor'] = {};
AWS.Billingconductor = Service.defineService('billingconductor', ['2021-07-30']);
Object.defineProperty(apiLoader.services['billingconductor'], '2021-07-30', {
  get: function get() {
    var model = require('../apis/billingconductor-2021-07-30.min.json');
    model.paginators = require('../apis/billingconductor-2021-07-30.paginators.json').pagination;
    model.waiters = require('../apis/billingconductor-2021-07-30.waiters2.json').waiters;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Billingconductor;
