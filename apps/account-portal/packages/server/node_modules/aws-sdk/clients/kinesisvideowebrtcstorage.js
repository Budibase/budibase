require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['kinesisvideowebrtcstorage'] = {};
AWS.KinesisVideoWebRTCStorage = Service.defineService('kinesisvideowebrtcstorage', ['2018-05-10']);
Object.defineProperty(apiLoader.services['kinesisvideowebrtcstorage'], '2018-05-10', {
  get: function get() {
    var model = require('../apis/kinesis-video-webrtc-storage-2018-05-10.min.json');
    model.paginators = require('../apis/kinesis-video-webrtc-storage-2018-05-10.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.KinesisVideoWebRTCStorage;
