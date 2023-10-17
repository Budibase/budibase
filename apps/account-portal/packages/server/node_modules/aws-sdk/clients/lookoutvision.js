require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['lookoutvision'] = {};
AWS.LookoutVision = Service.defineService('lookoutvision', ['2020-11-20']);
Object.defineProperty(apiLoader.services['lookoutvision'], '2020-11-20', {
  get: function get() {
    var model = require('../apis/lookoutvision-2020-11-20.min.json');
    model.paginators = require('../apis/lookoutvision-2020-11-20.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.LookoutVision;
