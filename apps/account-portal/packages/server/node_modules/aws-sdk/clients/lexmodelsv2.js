require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['lexmodelsv2'] = {};
AWS.LexModelsV2 = Service.defineService('lexmodelsv2', ['2020-08-07']);
Object.defineProperty(apiLoader.services['lexmodelsv2'], '2020-08-07', {
  get: function get() {
    var model = require('../apis/models.lex.v2-2020-08-07.min.json');
    model.paginators = require('../apis/models.lex.v2-2020-08-07.paginators.json').pagination;
    model.waiters = require('../apis/models.lex.v2-2020-08-07.waiters2.json').waiters;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.LexModelsV2;
