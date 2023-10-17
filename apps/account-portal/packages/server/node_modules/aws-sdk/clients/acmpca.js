require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['acmpca'] = {};
AWS.ACMPCA = Service.defineService('acmpca', ['2017-08-22']);
Object.defineProperty(apiLoader.services['acmpca'], '2017-08-22', {
  get: function get() {
    var model = require('../apis/acm-pca-2017-08-22.min.json');
    model.paginators = require('../apis/acm-pca-2017-08-22.paginators.json').pagination;
    model.waiters = require('../apis/acm-pca-2017-08-22.waiters2.json').waiters;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.ACMPCA;
