require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['verifiedpermissions'] = {};
AWS.VerifiedPermissions = Service.defineService('verifiedpermissions', ['2021-12-01']);
Object.defineProperty(apiLoader.services['verifiedpermissions'], '2021-12-01', {
  get: function get() {
    var model = require('../apis/verifiedpermissions-2021-12-01.min.json');
    model.paginators = require('../apis/verifiedpermissions-2021-12-01.paginators.json').pagination;
    model.waiters = require('../apis/verifiedpermissions-2021-12-01.waiters2.json').waiters;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.VerifiedPermissions;
