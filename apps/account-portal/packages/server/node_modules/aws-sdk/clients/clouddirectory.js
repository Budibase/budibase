require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['clouddirectory'] = {};
AWS.CloudDirectory = Service.defineService('clouddirectory', ['2016-05-10', '2016-05-10*', '2017-01-11']);
Object.defineProperty(apiLoader.services['clouddirectory'], '2016-05-10', {
  get: function get() {
    var model = require('../apis/clouddirectory-2016-05-10.min.json');
    model.paginators = require('../apis/clouddirectory-2016-05-10.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});
Object.defineProperty(apiLoader.services['clouddirectory'], '2017-01-11', {
  get: function get() {
    var model = require('../apis/clouddirectory-2017-01-11.min.json');
    model.paginators = require('../apis/clouddirectory-2017-01-11.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.CloudDirectory;
