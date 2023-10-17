require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['chimesdkmessaging'] = {};
AWS.ChimeSDKMessaging = Service.defineService('chimesdkmessaging', ['2021-05-15']);
Object.defineProperty(apiLoader.services['chimesdkmessaging'], '2021-05-15', {
  get: function get() {
    var model = require('../apis/chime-sdk-messaging-2021-05-15.min.json');
    model.paginators = require('../apis/chime-sdk-messaging-2021-05-15.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.ChimeSDKMessaging;
