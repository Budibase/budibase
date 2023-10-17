require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['qldb'] = {};
AWS.QLDB = Service.defineService('qldb', ['2019-01-02']);
Object.defineProperty(apiLoader.services['qldb'], '2019-01-02', {
  get: function get() {
    var model = require('../apis/qldb-2019-01-02.min.json');
    model.paginators = require('../apis/qldb-2019-01-02.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.QLDB;
