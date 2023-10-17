require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['ivschat'] = {};
AWS.Ivschat = Service.defineService('ivschat', ['2020-07-14']);
Object.defineProperty(apiLoader.services['ivschat'], '2020-07-14', {
  get: function get() {
    var model = require('../apis/ivschat-2020-07-14.min.json');
    model.paginators = require('../apis/ivschat-2020-07-14.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Ivschat;
