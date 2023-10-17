require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['ssmincidents'] = {};
AWS.SSMIncidents = Service.defineService('ssmincidents', ['2018-05-10']);
Object.defineProperty(apiLoader.services['ssmincidents'], '2018-05-10', {
  get: function get() {
    var model = require('../apis/ssm-incidents-2018-05-10.min.json');
    model.paginators = require('../apis/ssm-incidents-2018-05-10.paginators.json').pagination;
    model.waiters = require('../apis/ssm-incidents-2018-05-10.waiters2.json').waiters;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.SSMIncidents;
