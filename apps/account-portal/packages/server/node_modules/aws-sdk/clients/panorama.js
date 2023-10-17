require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['panorama'] = {};
AWS.Panorama = Service.defineService('panorama', ['2019-07-24']);
Object.defineProperty(apiLoader.services['panorama'], '2019-07-24', {
  get: function get() {
    var model = require('../apis/panorama-2019-07-24.min.json');
    model.paginators = require('../apis/panorama-2019-07-24.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Panorama;
