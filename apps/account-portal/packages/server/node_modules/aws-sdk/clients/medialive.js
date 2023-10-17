require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['medialive'] = {};
AWS.MediaLive = Service.defineService('medialive', ['2017-10-14']);
Object.defineProperty(apiLoader.services['medialive'], '2017-10-14', {
  get: function get() {
    var model = require('../apis/medialive-2017-10-14.min.json');
    model.paginators = require('../apis/medialive-2017-10-14.paginators.json').pagination;
    model.waiters = require('../apis/medialive-2017-10-14.waiters2.json').waiters;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.MediaLive;
