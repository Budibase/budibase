require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['resiliencehub'] = {};
AWS.Resiliencehub = Service.defineService('resiliencehub', ['2020-04-30']);
Object.defineProperty(apiLoader.services['resiliencehub'], '2020-04-30', {
  get: function get() {
    var model = require('../apis/resiliencehub-2020-04-30.min.json');
    model.paginators = require('../apis/resiliencehub-2020-04-30.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Resiliencehub;
