require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['personalizeruntime'] = {};
AWS.PersonalizeRuntime = Service.defineService('personalizeruntime', ['2018-05-22']);
Object.defineProperty(apiLoader.services['personalizeruntime'], '2018-05-22', {
  get: function get() {
    var model = require('../apis/personalize-runtime-2018-05-22.min.json');
    model.paginators = require('../apis/personalize-runtime-2018-05-22.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.PersonalizeRuntime;
