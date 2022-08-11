require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['chimesdkidentity'] = {};
AWS.ChimeSDKIdentity = Service.defineService('chimesdkidentity', ['2021-04-20']);
Object.defineProperty(apiLoader.services['chimesdkidentity'], '2021-04-20', {
  get: function get() {
    var model = require('../apis/chime-sdk-identity-2021-04-20.min.json');
    model.paginators = require('../apis/chime-sdk-identity-2021-04-20.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.ChimeSDKIdentity;
