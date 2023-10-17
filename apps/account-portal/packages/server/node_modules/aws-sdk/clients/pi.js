require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['pi'] = {};
AWS.PI = Service.defineService('pi', ['2018-02-27']);
Object.defineProperty(apiLoader.services['pi'], '2018-02-27', {
  get: function get() {
    var model = require('../apis/pi-2018-02-27.min.json');
    model.paginators = require('../apis/pi-2018-02-27.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.PI;
