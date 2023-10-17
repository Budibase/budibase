require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['pipes'] = {};
AWS.Pipes = Service.defineService('pipes', ['2015-10-07']);
Object.defineProperty(apiLoader.services['pipes'], '2015-10-07', {
  get: function get() {
    var model = require('../apis/pipes-2015-10-07.min.json');
    model.paginators = require('../apis/pipes-2015-10-07.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Pipes;
