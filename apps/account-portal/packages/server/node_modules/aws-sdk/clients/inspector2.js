require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['inspector2'] = {};
AWS.Inspector2 = Service.defineService('inspector2', ['2020-06-08']);
Object.defineProperty(apiLoader.services['inspector2'], '2020-06-08', {
  get: function get() {
    var model = require('../apis/inspector2-2020-06-08.min.json');
    model.paginators = require('../apis/inspector2-2020-06-08.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Inspector2;
