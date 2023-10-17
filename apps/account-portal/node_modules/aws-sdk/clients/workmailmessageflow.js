require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['workmailmessageflow'] = {};
AWS.WorkMailMessageFlow = Service.defineService('workmailmessageflow', ['2019-05-01']);
Object.defineProperty(apiLoader.services['workmailmessageflow'], '2019-05-01', {
  get: function get() {
    var model = require('../apis/workmailmessageflow-2019-05-01.min.json');
    model.paginators = require('../apis/workmailmessageflow-2019-05-01.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.WorkMailMessageFlow;
