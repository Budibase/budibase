require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['amplify'] = {};
AWS.Amplify = Service.defineService('amplify', ['2017-07-25']);
Object.defineProperty(apiLoader.services['amplify'], '2017-07-25', {
  get: function get() {
    var model = require('../apis/amplify-2017-07-25.min.json');
    model.paginators = require('../apis/amplify-2017-07-25.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Amplify;
