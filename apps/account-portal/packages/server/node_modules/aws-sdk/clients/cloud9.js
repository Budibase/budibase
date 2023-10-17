require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['cloud9'] = {};
AWS.Cloud9 = Service.defineService('cloud9', ['2017-09-23']);
Object.defineProperty(apiLoader.services['cloud9'], '2017-09-23', {
  get: function get() {
    var model = require('../apis/cloud9-2017-09-23.min.json');
    model.paginators = require('../apis/cloud9-2017-09-23.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Cloud9;
