require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['auditmanager'] = {};
AWS.AuditManager = Service.defineService('auditmanager', ['2017-07-25']);
Object.defineProperty(apiLoader.services['auditmanager'], '2017-07-25', {
  get: function get() {
    var model = require('../apis/auditmanager-2017-07-25.min.json');
    model.paginators = require('../apis/auditmanager-2017-07-25.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.AuditManager;
