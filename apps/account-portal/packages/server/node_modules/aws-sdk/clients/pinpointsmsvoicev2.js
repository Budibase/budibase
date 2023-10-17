require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['pinpointsmsvoicev2'] = {};
AWS.PinpointSMSVoiceV2 = Service.defineService('pinpointsmsvoicev2', ['2022-03-31']);
Object.defineProperty(apiLoader.services['pinpointsmsvoicev2'], '2022-03-31', {
  get: function get() {
    var model = require('../apis/pinpoint-sms-voice-v2-2022-03-31.min.json');
    model.paginators = require('../apis/pinpoint-sms-voice-v2-2022-03-31.paginators.json').pagination;
    model.waiters = require('../apis/pinpoint-sms-voice-v2-2022-03-31.waiters2.json').waiters;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.PinpointSMSVoiceV2;
