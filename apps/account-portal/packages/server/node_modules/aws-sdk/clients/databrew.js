require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['databrew'] = {};
AWS.DataBrew = Service.defineService('databrew', ['2017-07-25']);
Object.defineProperty(apiLoader.services['databrew'], '2017-07-25', {
  get: function get() {
    var model = require('../apis/databrew-2017-07-25.min.json');
    model.paginators = require('../apis/databrew-2017-07-25.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.DataBrew;
