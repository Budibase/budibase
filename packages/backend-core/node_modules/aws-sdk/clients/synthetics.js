require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['synthetics'] = {};
AWS.Synthetics = Service.defineService('synthetics', ['2017-10-11']);
Object.defineProperty(apiLoader.services['synthetics'], '2017-10-11', {
  get: function get() {
    var model = require('../apis/synthetics-2017-10-11.min.json');
    model.paginators = require('../apis/synthetics-2017-10-11.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Synthetics;
