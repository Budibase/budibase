require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['docdb'] = {};
AWS.DocDB = Service.defineService('docdb', ['2014-10-31']);
require('../lib/services/docdb');
Object.defineProperty(apiLoader.services['docdb'], '2014-10-31', {
  get: function get() {
    var model = require('../apis/docdb-2014-10-31.min.json');
    model.paginators = require('../apis/docdb-2014-10-31.paginators.json').pagination;
    model.waiters = require('../apis/docdb-2014-10-31.waiters2.json').waiters;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.DocDB;
