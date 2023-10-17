require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['serverlessapplicationrepository'] = {};
AWS.ServerlessApplicationRepository = Service.defineService('serverlessapplicationrepository', ['2017-09-08']);
Object.defineProperty(apiLoader.services['serverlessapplicationrepository'], '2017-09-08', {
  get: function get() {
    var model = require('../apis/serverlessrepo-2017-09-08.min.json');
    model.paginators = require('../apis/serverlessrepo-2017-09-08.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.ServerlessApplicationRepository;
