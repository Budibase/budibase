require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['dataexchange'] = {};
AWS.DataExchange = Service.defineService('dataexchange', ['2017-07-25']);
Object.defineProperty(apiLoader.services['dataexchange'], '2017-07-25', {
  get: function get() {
    var model = require('../apis/dataexchange-2017-07-25.min.json');
    model.paginators = require('../apis/dataexchange-2017-07-25.paginators.json').pagination;
    model.waiters = require('../apis/dataexchange-2017-07-25.waiters2.json').waiters;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.DataExchange;
