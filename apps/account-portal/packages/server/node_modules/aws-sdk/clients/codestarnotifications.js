require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['codestarnotifications'] = {};
AWS.CodeStarNotifications = Service.defineService('codestarnotifications', ['2019-10-15']);
Object.defineProperty(apiLoader.services['codestarnotifications'], '2019-10-15', {
  get: function get() {
    var model = require('../apis/codestar-notifications-2019-10-15.min.json');
    model.paginators = require('../apis/codestar-notifications-2019-10-15.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.CodeStarNotifications;
