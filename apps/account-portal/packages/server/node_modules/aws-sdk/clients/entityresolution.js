require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['entityresolution'] = {};
AWS.EntityResolution = Service.defineService('entityresolution', ['2018-05-10']);
Object.defineProperty(apiLoader.services['entityresolution'], '2018-05-10', {
  get: function get() {
    var model = require('../apis/entityresolution-2018-05-10.min.json');
    model.paginators = require('../apis/entityresolution-2018-05-10.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.EntityResolution;
