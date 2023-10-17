require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['chimesdkvoice'] = {};
AWS.ChimeSDKVoice = Service.defineService('chimesdkvoice', ['2022-08-03']);
Object.defineProperty(apiLoader.services['chimesdkvoice'], '2022-08-03', {
  get: function get() {
    var model = require('../apis/chime-sdk-voice-2022-08-03.min.json');
    model.paginators = require('../apis/chime-sdk-voice-2022-08-03.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.ChimeSDKVoice;
