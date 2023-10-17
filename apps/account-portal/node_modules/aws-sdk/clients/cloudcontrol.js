require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['cloudcontrol'] = {};
AWS.CloudControl = Service.defineService('cloudcontrol', ['2021-09-30']);
Object.defineProperty(apiLoader.services['cloudcontrol'], '2021-09-30', {
  get: function get() {
    var model = require('../apis/cloudcontrol-2021-09-30.min.json');
    model.paginators = require('../apis/cloudcontrol-2021-09-30.paginators.json').pagination;
    model.waiters = require('../apis/cloudcontrol-2021-09-30.waiters2.json').waiters;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.CloudControl;
