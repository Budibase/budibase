require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['kafka'] = {};
AWS.Kafka = Service.defineService('kafka', ['2018-11-14']);
Object.defineProperty(apiLoader.services['kafka'], '2018-11-14', {
  get: function get() {
    var model = require('../apis/kafka-2018-11-14.min.json');
    model.paginators = require('../apis/kafka-2018-11-14.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Kafka;
