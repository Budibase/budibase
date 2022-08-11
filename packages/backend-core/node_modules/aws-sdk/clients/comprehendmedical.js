require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['comprehendmedical'] = {};
AWS.ComprehendMedical = Service.defineService('comprehendmedical', ['2018-10-30']);
Object.defineProperty(apiLoader.services['comprehendmedical'], '2018-10-30', {
  get: function get() {
    var model = require('../apis/comprehendmedical-2018-10-30.min.json');
    model.paginators = require('../apis/comprehendmedical-2018-10-30.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.ComprehendMedical;
