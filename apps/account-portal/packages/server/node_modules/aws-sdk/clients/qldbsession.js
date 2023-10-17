require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['qldbsession'] = {};
AWS.QLDBSession = Service.defineService('qldbsession', ['2019-07-11']);
Object.defineProperty(apiLoader.services['qldbsession'], '2019-07-11', {
  get: function get() {
    var model = require('../apis/qldb-session-2019-07-11.min.json');
    model.paginators = require('../apis/qldb-session-2019-07-11.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.QLDBSession;
