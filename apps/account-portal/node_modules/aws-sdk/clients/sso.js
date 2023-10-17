require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['sso'] = {};
AWS.SSO = Service.defineService('sso', ['2019-06-10']);
Object.defineProperty(apiLoader.services['sso'], '2019-06-10', {
  get: function get() {
    var model = require('../apis/sso-2019-06-10.min.json');
    model.paginators = require('../apis/sso-2019-06-10.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.SSO;
