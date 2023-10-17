require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['arczonalshift'] = {};
AWS.ARCZonalShift = Service.defineService('arczonalshift', ['2022-10-30']);
Object.defineProperty(apiLoader.services['arczonalshift'], '2022-10-30', {
  get: function get() {
    var model = require('../apis/arc-zonal-shift-2022-10-30.min.json');
    model.paginators = require('../apis/arc-zonal-shift-2022-10-30.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.ARCZonalShift;
