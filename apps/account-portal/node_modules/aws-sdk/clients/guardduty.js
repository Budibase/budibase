require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['guardduty'] = {};
AWS.GuardDuty = Service.defineService('guardduty', ['2017-11-28']);
Object.defineProperty(apiLoader.services['guardduty'], '2017-11-28', {
  get: function get() {
    var model = require('../apis/guardduty-2017-11-28.min.json');
    model.paginators = require('../apis/guardduty-2017-11-28.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.GuardDuty;
