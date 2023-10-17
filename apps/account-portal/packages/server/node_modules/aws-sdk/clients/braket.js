require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['braket'] = {};
AWS.Braket = Service.defineService('braket', ['2019-09-01']);
Object.defineProperty(apiLoader.services['braket'], '2019-09-01', {
  get: function get() {
    var model = require('../apis/braket-2019-09-01.min.json');
    model.paginators = require('../apis/braket-2019-09-01.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Braket;
