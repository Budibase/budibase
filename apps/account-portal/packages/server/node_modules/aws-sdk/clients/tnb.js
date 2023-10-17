require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['tnb'] = {};
AWS.Tnb = Service.defineService('tnb', ['2008-10-21']);
Object.defineProperty(apiLoader.services['tnb'], '2008-10-21', {
  get: function get() {
    var model = require('../apis/tnb-2008-10-21.min.json');
    model.paginators = require('../apis/tnb-2008-10-21.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Tnb;
