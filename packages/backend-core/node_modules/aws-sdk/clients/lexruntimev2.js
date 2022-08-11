require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['lexruntimev2'] = {};
AWS.LexRuntimeV2 = Service.defineService('lexruntimev2', ['2020-08-07']);
Object.defineProperty(apiLoader.services['lexruntimev2'], '2020-08-07', {
  get: function get() {
    var model = require('../apis/runtime.lex.v2-2020-08-07.min.json');
    model.paginators = require('../apis/runtime.lex.v2-2020-08-07.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.LexRuntimeV2;
