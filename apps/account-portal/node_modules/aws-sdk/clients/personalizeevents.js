require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['personalizeevents'] = {};
AWS.PersonalizeEvents = Service.defineService('personalizeevents', ['2018-03-22']);
Object.defineProperty(apiLoader.services['personalizeevents'], '2018-03-22', {
  get: function get() {
    var model = require('../apis/personalize-events-2018-03-22.min.json');
    model.paginators = require('../apis/personalize-events-2018-03-22.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.PersonalizeEvents;
