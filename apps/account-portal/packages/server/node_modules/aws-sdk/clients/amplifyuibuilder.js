require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['amplifyuibuilder'] = {};
AWS.AmplifyUIBuilder = Service.defineService('amplifyuibuilder', ['2021-08-11']);
Object.defineProperty(apiLoader.services['amplifyuibuilder'], '2021-08-11', {
  get: function get() {
    var model = require('../apis/amplifyuibuilder-2021-08-11.min.json');
    model.paginators = require('../apis/amplifyuibuilder-2021-08-11.paginators.json').pagination;
    model.waiters = require('../apis/amplifyuibuilder-2021-08-11.waiters2.json').waiters;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.AmplifyUIBuilder;
