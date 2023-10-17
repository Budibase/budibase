require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['mediapackage'] = {};
AWS.MediaPackage = Service.defineService('mediapackage', ['2017-10-12']);
Object.defineProperty(apiLoader.services['mediapackage'], '2017-10-12', {
  get: function get() {
    var model = require('../apis/mediapackage-2017-10-12.min.json');
    model.paginators = require('../apis/mediapackage-2017-10-12.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.MediaPackage;
