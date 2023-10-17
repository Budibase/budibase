require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['dlm'] = {};
AWS.DLM = Service.defineService('dlm', ['2018-01-12']);
Object.defineProperty(apiLoader.services['dlm'], '2018-01-12', {
  get: function get() {
    var model = require('../apis/dlm-2018-01-12.min.json');
    model.paginators = require('../apis/dlm-2018-01-12.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.DLM;
