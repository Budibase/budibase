require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['mediastore'] = {};
AWS.MediaStore = Service.defineService('mediastore', ['2017-09-01']);
Object.defineProperty(apiLoader.services['mediastore'], '2017-09-01', {
  get: function get() {
    var model = require('../apis/mediastore-2017-09-01.min.json');
    model.paginators = require('../apis/mediastore-2017-09-01.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.MediaStore;
