require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['connectcontactlens'] = {};
AWS.ConnectContactLens = Service.defineService('connectcontactlens', ['2020-08-21']);
Object.defineProperty(apiLoader.services['connectcontactlens'], '2020-08-21', {
  get: function get() {
    var model = require('../apis/connect-contact-lens-2020-08-21.min.json');
    model.paginators = require('../apis/connect-contact-lens-2020-08-21.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.ConnectContactLens;
