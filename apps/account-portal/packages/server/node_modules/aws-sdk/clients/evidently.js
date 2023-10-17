require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['evidently'] = {};
AWS.Evidently = Service.defineService('evidently', ['2021-02-01']);
Object.defineProperty(apiLoader.services['evidently'], '2021-02-01', {
  get: function get() {
    var model = require('../apis/evidently-2021-02-01.min.json');
    model.paginators = require('../apis/evidently-2021-02-01.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Evidently;
