require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['mediaconvert'] = {};
AWS.MediaConvert = Service.defineService('mediaconvert', ['2017-08-29']);
Object.defineProperty(apiLoader.services['mediaconvert'], '2017-08-29', {
  get: function get() {
    var model = require('../apis/mediaconvert-2017-08-29.min.json');
    model.paginators = require('../apis/mediaconvert-2017-08-29.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.MediaConvert;
