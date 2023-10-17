require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['autoscalingplans'] = {};
AWS.AutoScalingPlans = Service.defineService('autoscalingplans', ['2018-01-06']);
Object.defineProperty(apiLoader.services['autoscalingplans'], '2018-01-06', {
  get: function get() {
    var model = require('../apis/autoscaling-plans-2018-01-06.min.json');
    model.paginators = require('../apis/autoscaling-plans-2018-01-06.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.AutoScalingPlans;
