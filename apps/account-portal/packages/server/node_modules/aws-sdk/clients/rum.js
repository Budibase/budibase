require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['rum'] = {};
AWS.RUM = Service.defineService('rum', ['2018-05-10']);
Object.defineProperty(apiLoader.services['rum'], '2018-05-10', {
  get: function get() {
    var model = require('../apis/rum-2018-05-10.min.json');
    model.paginators = require('../apis/rum-2018-05-10.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.RUM;
