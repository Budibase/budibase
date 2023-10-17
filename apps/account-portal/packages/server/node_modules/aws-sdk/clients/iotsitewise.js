require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['iotsitewise'] = {};
AWS.IoTSiteWise = Service.defineService('iotsitewise', ['2019-12-02']);
Object.defineProperty(apiLoader.services['iotsitewise'], '2019-12-02', {
  get: function get() {
    var model = require('../apis/iotsitewise-2019-12-02.min.json');
    model.paginators = require('../apis/iotsitewise-2019-12-02.paginators.json').pagination;
    model.waiters = require('../apis/iotsitewise-2019-12-02.waiters2.json').waiters;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.IoTSiteWise;
