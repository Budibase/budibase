require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['mediapackagevod'] = {};
AWS.MediaPackageVod = Service.defineService('mediapackagevod', ['2018-11-07']);
Object.defineProperty(apiLoader.services['mediapackagevod'], '2018-11-07', {
  get: function get() {
    var model = require('../apis/mediapackage-vod-2018-11-07.min.json');
    model.paginators = require('../apis/mediapackage-vod-2018-11-07.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.MediaPackageVod;
