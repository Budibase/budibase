require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['translate'] = {};
AWS.Translate = Service.defineService('translate', ['2017-07-01']);
Object.defineProperty(apiLoader.services['translate'], '2017-07-01', {
  get: function get() {
    var model = require('../apis/translate-2017-07-01.min.json');
    model.paginators = require('../apis/translate-2017-07-01.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Translate;
