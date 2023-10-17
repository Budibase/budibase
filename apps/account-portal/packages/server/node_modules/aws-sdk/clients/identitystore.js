require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['identitystore'] = {};
AWS.IdentityStore = Service.defineService('identitystore', ['2020-06-15']);
Object.defineProperty(apiLoader.services['identitystore'], '2020-06-15', {
  get: function get() {
    var model = require('../apis/identitystore-2020-06-15.min.json');
    model.paginators = require('../apis/identitystore-2020-06-15.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.IdentityStore;
