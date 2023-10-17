require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['transcribeservice'] = {};
AWS.TranscribeService = Service.defineService('transcribeservice', ['2017-10-26']);
Object.defineProperty(apiLoader.services['transcribeservice'], '2017-10-26', {
  get: function get() {
    var model = require('../apis/transcribe-2017-10-26.min.json');
    model.paginators = require('../apis/transcribe-2017-10-26.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.TranscribeService;
