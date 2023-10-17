require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['simspaceweaver'] = {};
AWS.SimSpaceWeaver = Service.defineService('simspaceweaver', ['2022-10-28']);
Object.defineProperty(apiLoader.services['simspaceweaver'], '2022-10-28', {
  get: function get() {
    var model = require('../apis/simspaceweaver-2022-10-28.min.json');
    model.paginators = require('../apis/simspaceweaver-2022-10-28.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.SimSpaceWeaver;
