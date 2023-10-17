require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['ssoadmin'] = {};
AWS.SSOAdmin = Service.defineService('ssoadmin', ['2020-07-20']);
Object.defineProperty(apiLoader.services['ssoadmin'], '2020-07-20', {
  get: function get() {
    var model = require('../apis/sso-admin-2020-07-20.min.json');
    model.paginators = require('../apis/sso-admin-2020-07-20.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.SSOAdmin;
