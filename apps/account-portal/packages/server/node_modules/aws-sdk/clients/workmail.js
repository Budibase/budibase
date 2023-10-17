require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['workmail'] = {};
AWS.WorkMail = Service.defineService('workmail', ['2017-10-01']);
Object.defineProperty(apiLoader.services['workmail'], '2017-10-01', {
  get: function get() {
    var model = require('../apis/workmail-2017-10-01.min.json');
    model.paginators = require('../apis/workmail-2017-10-01.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.WorkMail;
