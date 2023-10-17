require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['redshiftserverless'] = {};
AWS.RedshiftServerless = Service.defineService('redshiftserverless', ['2021-04-21']);
Object.defineProperty(apiLoader.services['redshiftserverless'], '2021-04-21', {
  get: function get() {
    var model = require('../apis/redshift-serverless-2021-04-21.min.json');
    model.paginators = require('../apis/redshift-serverless-2021-04-21.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.RedshiftServerless;
