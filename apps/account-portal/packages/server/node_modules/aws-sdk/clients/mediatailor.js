require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['mediatailor'] = {};
AWS.MediaTailor = Service.defineService('mediatailor', ['2018-04-23']);
Object.defineProperty(apiLoader.services['mediatailor'], '2018-04-23', {
  get: function get() {
    var model = require('../apis/mediatailor-2018-04-23.min.json');
    model.paginators = require('../apis/mediatailor-2018-04-23.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.MediaTailor;
