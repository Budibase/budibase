require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['chime'] = {};
AWS.Chime = Service.defineService('chime', ['2018-05-01']);
Object.defineProperty(apiLoader.services['chime'], '2018-05-01', {
  get: function get() {
    var model = require('../apis/chime-2018-05-01.min.json');
    model.paginators = require('../apis/chime-2018-05-01.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Chime;
