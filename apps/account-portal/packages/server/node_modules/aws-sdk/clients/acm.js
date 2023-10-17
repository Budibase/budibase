require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['acm'] = {};
AWS.ACM = Service.defineService('acm', ['2015-12-08']);
Object.defineProperty(apiLoader.services['acm'], '2015-12-08', {
  get: function get() {
    var model = require('../apis/acm-2015-12-08.min.json');
    model.paginators = require('../apis/acm-2015-12-08.paginators.json').pagination;
    model.waiters = require('../apis/acm-2015-12-08.waiters2.json').waiters;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.ACM;
