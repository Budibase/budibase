require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['mediastoredata'] = {};
AWS.MediaStoreData = Service.defineService('mediastoredata', ['2017-09-01']);
Object.defineProperty(apiLoader.services['mediastoredata'], '2017-09-01', {
  get: function get() {
    var model = require('../apis/mediastore-data-2017-09-01.min.json');
    model.paginators = require('../apis/mediastore-data-2017-09-01.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.MediaStoreData;
