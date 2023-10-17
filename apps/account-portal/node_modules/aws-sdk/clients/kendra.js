require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['kendra'] = {};
AWS.Kendra = Service.defineService('kendra', ['2019-02-03']);
Object.defineProperty(apiLoader.services['kendra'], '2019-02-03', {
  get: function get() {
    var model = require('../apis/kendra-2019-02-03.min.json');
    model.paginators = require('../apis/kendra-2019-02-03.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Kendra;
