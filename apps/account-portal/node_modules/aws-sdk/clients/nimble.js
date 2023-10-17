require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['nimble'] = {};
AWS.Nimble = Service.defineService('nimble', ['2020-08-01']);
Object.defineProperty(apiLoader.services['nimble'], '2020-08-01', {
  get: function get() {
    var model = require('../apis/nimble-2020-08-01.min.json');
    model.paginators = require('../apis/nimble-2020-08-01.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Nimble;
