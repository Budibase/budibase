require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['kafkaconnect'] = {};
AWS.KafkaConnect = Service.defineService('kafkaconnect', ['2021-09-14']);
Object.defineProperty(apiLoader.services['kafkaconnect'], '2021-09-14', {
  get: function get() {
    var model = require('../apis/kafkaconnect-2021-09-14.min.json');
    model.paginators = require('../apis/kafkaconnect-2021-09-14.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.KafkaConnect;
