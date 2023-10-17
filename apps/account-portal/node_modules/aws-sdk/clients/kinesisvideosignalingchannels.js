require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['kinesisvideosignalingchannels'] = {};
AWS.KinesisVideoSignalingChannels = Service.defineService('kinesisvideosignalingchannels', ['2019-12-04']);
Object.defineProperty(apiLoader.services['kinesisvideosignalingchannels'], '2019-12-04', {
  get: function get() {
    var model = require('../apis/kinesis-video-signaling-2019-12-04.min.json');
    model.paginators = require('../apis/kinesis-video-signaling-2019-12-04.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.KinesisVideoSignalingChannels;
