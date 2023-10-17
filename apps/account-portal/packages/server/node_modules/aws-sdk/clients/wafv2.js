require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['wafv2'] = {};
AWS.WAFV2 = Service.defineService('wafv2', ['2019-07-29']);
Object.defineProperty(apiLoader.services['wafv2'], '2019-07-29', {
  get: function get() {
    var model = require('../apis/wafv2-2019-07-29.min.json');
    model.paginators = require('../apis/wafv2-2019-07-29.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.WAFV2;
