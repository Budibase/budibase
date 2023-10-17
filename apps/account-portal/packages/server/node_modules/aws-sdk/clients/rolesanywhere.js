require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['rolesanywhere'] = {};
AWS.RolesAnywhere = Service.defineService('rolesanywhere', ['2018-05-10']);
Object.defineProperty(apiLoader.services['rolesanywhere'], '2018-05-10', {
  get: function get() {
    var model = require('../apis/rolesanywhere-2018-05-10.min.json');
    model.paginators = require('../apis/rolesanywhere-2018-05-10.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.RolesAnywhere;
