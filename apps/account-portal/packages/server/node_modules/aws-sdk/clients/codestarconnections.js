require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['codestarconnections'] = {};
AWS.CodeStarconnections = Service.defineService('codestarconnections', ['2019-12-01']);
Object.defineProperty(apiLoader.services['codestarconnections'], '2019-12-01', {
  get: function get() {
    var model = require('../apis/codestar-connections-2019-12-01.min.json');
    model.paginators = require('../apis/codestar-connections-2019-12-01.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.CodeStarconnections;
