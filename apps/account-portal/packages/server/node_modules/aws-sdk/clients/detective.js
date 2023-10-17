require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['detective'] = {};
AWS.Detective = Service.defineService('detective', ['2018-10-26']);
Object.defineProperty(apiLoader.services['detective'], '2018-10-26', {
  get: function get() {
    var model = require('../apis/detective-2018-10-26.min.json');
    model.paginators = require('../apis/detective-2018-10-26.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Detective;
