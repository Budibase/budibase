require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['worklink'] = {};
AWS.WorkLink = Service.defineService('worklink', ['2018-09-25']);
Object.defineProperty(apiLoader.services['worklink'], '2018-09-25', {
  get: function get() {
    var model = require('../apis/worklink-2018-09-25.min.json');
    model.paginators = require('../apis/worklink-2018-09-25.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.WorkLink;
