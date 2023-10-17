require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['kinesisvideo'] = {};
AWS.KinesisVideo = Service.defineService('kinesisvideo', ['2017-09-30']);
Object.defineProperty(apiLoader.services['kinesisvideo'], '2017-09-30', {
  get: function get() {
    var model = require('../apis/kinesisvideo-2017-09-30.min.json');
    model.paginators = require('../apis/kinesisvideo-2017-09-30.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.KinesisVideo;
