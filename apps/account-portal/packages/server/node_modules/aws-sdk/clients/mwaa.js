require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['mwaa'] = {};
AWS.MWAA = Service.defineService('mwaa', ['2020-07-01']);
Object.defineProperty(apiLoader.services['mwaa'], '2020-07-01', {
  get: function get() {
    var model = require('../apis/mwaa-2020-07-01.min.json');
    model.paginators = require('../apis/mwaa-2020-07-01.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.MWAA;
