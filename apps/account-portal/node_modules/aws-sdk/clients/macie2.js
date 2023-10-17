require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['macie2'] = {};
AWS.Macie2 = Service.defineService('macie2', ['2020-01-01']);
Object.defineProperty(apiLoader.services['macie2'], '2020-01-01', {
  get: function get() {
    var model = require('../apis/macie2-2020-01-01.min.json');
    model.paginators = require('../apis/macie2-2020-01-01.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Macie2;
