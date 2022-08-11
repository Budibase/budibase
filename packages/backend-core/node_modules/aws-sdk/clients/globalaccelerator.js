require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['globalaccelerator'] = {};
AWS.GlobalAccelerator = Service.defineService('globalaccelerator', ['2018-08-08']);
Object.defineProperty(apiLoader.services['globalaccelerator'], '2018-08-08', {
  get: function get() {
    var model = require('../apis/globalaccelerator-2018-08-08.min.json');
    model.paginators = require('../apis/globalaccelerator-2018-08-08.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.GlobalAccelerator;
