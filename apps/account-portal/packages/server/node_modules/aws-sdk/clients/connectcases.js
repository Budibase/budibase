require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['connectcases'] = {};
AWS.ConnectCases = Service.defineService('connectcases', ['2022-10-03']);
Object.defineProperty(apiLoader.services['connectcases'], '2022-10-03', {
  get: function get() {
    var model = require('../apis/connectcases-2022-10-03.min.json');
    model.paginators = require('../apis/connectcases-2022-10-03.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.ConnectCases;
