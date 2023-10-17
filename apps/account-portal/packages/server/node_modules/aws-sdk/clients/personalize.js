require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['personalize'] = {};
AWS.Personalize = Service.defineService('personalize', ['2018-05-22']);
Object.defineProperty(apiLoader.services['personalize'], '2018-05-22', {
  get: function get() {
    var model = require('../apis/personalize-2018-05-22.min.json');
    model.paginators = require('../apis/personalize-2018-05-22.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Personalize;
