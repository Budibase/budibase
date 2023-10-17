require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['kinesisanalyticsv2'] = {};
AWS.KinesisAnalyticsV2 = Service.defineService('kinesisanalyticsv2', ['2018-05-23']);
Object.defineProperty(apiLoader.services['kinesisanalyticsv2'], '2018-05-23', {
  get: function get() {
    var model = require('../apis/kinesisanalyticsv2-2018-05-23.min.json');
    model.paginators = require('../apis/kinesisanalyticsv2-2018-05-23.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.KinesisAnalyticsV2;
