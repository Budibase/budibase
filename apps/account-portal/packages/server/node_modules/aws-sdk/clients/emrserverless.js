require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['emrserverless'] = {};
AWS.EMRServerless = Service.defineService('emrserverless', ['2021-07-13']);
Object.defineProperty(apiLoader.services['emrserverless'], '2021-07-13', {
  get: function get() {
    var model = require('../apis/emr-serverless-2021-07-13.min.json');
    model.paginators = require('../apis/emr-serverless-2021-07-13.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.EMRServerless;
