require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['voiceid'] = {};
AWS.VoiceID = Service.defineService('voiceid', ['2021-09-27']);
Object.defineProperty(apiLoader.services['voiceid'], '2021-09-27', {
  get: function get() {
    var model = require('../apis/voice-id-2021-09-27.min.json');
    model.paginators = require('../apis/voice-id-2021-09-27.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.VoiceID;
