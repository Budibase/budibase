require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['wisdom'] = {};
AWS.Wisdom = Service.defineService('wisdom', ['2020-10-19']);
Object.defineProperty(apiLoader.services['wisdom'], '2020-10-19', {
  get: function get() {
    var model = require('../apis/wisdom-2020-10-19.min.json');
    model.paginators = require('../apis/wisdom-2020-10-19.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Wisdom;
