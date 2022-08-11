require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['wellarchitected'] = {};
AWS.WellArchitected = Service.defineService('wellarchitected', ['2020-03-31']);
Object.defineProperty(apiLoader.services['wellarchitected'], '2020-03-31', {
  get: function get() {
    var model = require('../apis/wellarchitected-2020-03-31.min.json');
    model.paginators = require('../apis/wellarchitected-2020-03-31.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.WellArchitected;
