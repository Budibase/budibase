require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['pinpointsmsvoice'] = {};
AWS.PinpointSMSVoice = Service.defineService('pinpointsmsvoice', ['2018-09-05']);
Object.defineProperty(apiLoader.services['pinpointsmsvoice'], '2018-09-05', {
  get: function get() {
    var model = require('../apis/sms-voice-2018-09-05.min.json');
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.PinpointSMSVoice;
