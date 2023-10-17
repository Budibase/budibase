require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['finspace'] = {};
AWS.Finspace = Service.defineService('finspace', ['2021-03-12']);
Object.defineProperty(apiLoader.services['finspace'], '2021-03-12', {
  get: function get() {
    var model = require('../apis/finspace-2021-03-12.min.json');
    model.paginators = require('../apis/finspace-2021-03-12.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Finspace;
