require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['emrcontainers'] = {};
AWS.EMRcontainers = Service.defineService('emrcontainers', ['2020-10-01']);
Object.defineProperty(apiLoader.services['emrcontainers'], '2020-10-01', {
  get: function get() {
    var model = require('../apis/emr-containers-2020-10-01.min.json');
    model.paginators = require('../apis/emr-containers-2020-10-01.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.EMRcontainers;
