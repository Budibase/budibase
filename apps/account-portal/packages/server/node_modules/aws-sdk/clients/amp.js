require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['amp'] = {};
AWS.Amp = Service.defineService('amp', ['2020-08-01']);
Object.defineProperty(apiLoader.services['amp'], '2020-08-01', {
  get: function get() {
    var model = require('../apis/amp-2020-08-01.min.json');
    model.paginators = require('../apis/amp-2020-08-01.paginators.json').pagination;
    model.waiters = require('../apis/amp-2020-08-01.waiters2.json').waiters;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Amp;
