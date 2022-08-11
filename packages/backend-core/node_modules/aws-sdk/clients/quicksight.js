require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['quicksight'] = {};
AWS.QuickSight = Service.defineService('quicksight', ['2018-04-01']);
Object.defineProperty(apiLoader.services['quicksight'], '2018-04-01', {
  get: function get() {
    var model = require('../apis/quicksight-2018-04-01.min.json');
    model.paginators = require('../apis/quicksight-2018-04-01.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.QuickSight;
