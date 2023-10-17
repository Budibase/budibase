require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['kinesisvideoarchivedmedia'] = {};
AWS.KinesisVideoArchivedMedia = Service.defineService('kinesisvideoarchivedmedia', ['2017-09-30']);
Object.defineProperty(apiLoader.services['kinesisvideoarchivedmedia'], '2017-09-30', {
  get: function get() {
    var model = require('../apis/kinesis-video-archived-media-2017-09-30.min.json');
    model.paginators = require('../apis/kinesis-video-archived-media-2017-09-30.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.KinesisVideoArchivedMedia;
