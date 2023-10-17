require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['location'] = {};
AWS.Location = Service.defineService('location', ['2020-11-19']);
Object.defineProperty(apiLoader.services['location'], '2020-11-19', {
  get: function get() {
    var model = require('../apis/location-2020-11-19.min.json');
    model.paginators = require('../apis/location-2020-11-19.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Location;
