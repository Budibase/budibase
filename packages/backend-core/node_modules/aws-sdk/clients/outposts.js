require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['outposts'] = {};
AWS.Outposts = Service.defineService('outposts', ['2019-12-03']);
Object.defineProperty(apiLoader.services['outposts'], '2019-12-03', {
  get: function get() {
    var model = require('../apis/outposts-2019-12-03.min.json');
    model.paginators = require('../apis/outposts-2019-12-03.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Outposts;
