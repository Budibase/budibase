require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['codegurusecurity'] = {};
AWS.CodeGuruSecurity = Service.defineService('codegurusecurity', ['2018-05-10']);
Object.defineProperty(apiLoader.services['codegurusecurity'], '2018-05-10', {
  get: function get() {
    var model = require('../apis/codeguru-security-2018-05-10.min.json');
    model.paginators = require('../apis/codeguru-security-2018-05-10.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.CodeGuruSecurity;
