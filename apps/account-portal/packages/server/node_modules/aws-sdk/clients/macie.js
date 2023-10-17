require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['macie'] = {};
AWS.Macie = Service.defineService('macie', ['2017-12-19']);
Object.defineProperty(apiLoader.services['macie'], '2017-12-19', {
  get: function get() {
    var model = require('../apis/macie-2017-12-19.min.json');
    model.paginators = require('../apis/macie-2017-12-19.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Macie;
