require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['savingsplans'] = {};
AWS.SavingsPlans = Service.defineService('savingsplans', ['2019-06-28']);
Object.defineProperty(apiLoader.services['savingsplans'], '2019-06-28', {
  get: function get() {
    var model = require('../apis/savingsplans-2019-06-28.min.json');
    model.paginators = require('../apis/savingsplans-2019-06-28.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.SavingsPlans;
