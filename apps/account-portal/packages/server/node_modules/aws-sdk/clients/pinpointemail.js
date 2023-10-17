require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['pinpointemail'] = {};
AWS.PinpointEmail = Service.defineService('pinpointemail', ['2018-07-26']);
Object.defineProperty(apiLoader.services['pinpointemail'], '2018-07-26', {
  get: function get() {
    var model = require('../apis/pinpoint-email-2018-07-26.min.json');
    model.paginators = require('../apis/pinpoint-email-2018-07-26.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.PinpointEmail;
