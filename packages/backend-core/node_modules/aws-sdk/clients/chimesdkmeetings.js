require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['chimesdkmeetings'] = {};
AWS.ChimeSDKMeetings = Service.defineService('chimesdkmeetings', ['2021-07-15']);
Object.defineProperty(apiLoader.services['chimesdkmeetings'], '2021-07-15', {
  get: function get() {
    var model = require('../apis/chime-sdk-meetings-2021-07-15.min.json');
    model.paginators = require('../apis/chime-sdk-meetings-2021-07-15.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.ChimeSDKMeetings;
