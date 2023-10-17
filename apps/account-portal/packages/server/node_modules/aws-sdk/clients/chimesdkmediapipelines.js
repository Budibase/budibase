require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['chimesdkmediapipelines'] = {};
AWS.ChimeSDKMediaPipelines = Service.defineService('chimesdkmediapipelines', ['2021-07-15']);
Object.defineProperty(apiLoader.services['chimesdkmediapipelines'], '2021-07-15', {
  get: function get() {
    var model = require('../apis/chime-sdk-media-pipelines-2021-07-15.min.json');
    model.paginators = require('../apis/chime-sdk-media-pipelines-2021-07-15.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.ChimeSDKMediaPipelines;
