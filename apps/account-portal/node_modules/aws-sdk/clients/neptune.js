require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['neptune'] = {};
AWS.Neptune = Service.defineService('neptune', ['2014-10-31']);
require('../lib/services/neptune');
Object.defineProperty(apiLoader.services['neptune'], '2014-10-31', {
  get: function get() {
    var model = require('../apis/neptune-2014-10-31.min.json');
    model.paginators = require('../apis/neptune-2014-10-31.paginators.json').pagination;
    model.waiters = require('../apis/neptune-2014-10-31.waiters2.json').waiters;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Neptune;
