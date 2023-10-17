require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['workspacesweb'] = {};
AWS.WorkSpacesWeb = Service.defineService('workspacesweb', ['2020-07-08']);
Object.defineProperty(apiLoader.services['workspacesweb'], '2020-07-08', {
  get: function get() {
    var model = require('../apis/workspaces-web-2020-07-08.min.json');
    model.paginators = require('../apis/workspaces-web-2020-07-08.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.WorkSpacesWeb;
