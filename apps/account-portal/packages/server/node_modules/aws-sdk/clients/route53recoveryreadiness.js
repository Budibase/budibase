require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['route53recoveryreadiness'] = {};
AWS.Route53RecoveryReadiness = Service.defineService('route53recoveryreadiness', ['2019-12-02']);
Object.defineProperty(apiLoader.services['route53recoveryreadiness'], '2019-12-02', {
  get: function get() {
    var model = require('../apis/route53-recovery-readiness-2019-12-02.min.json');
    model.paginators = require('../apis/route53-recovery-readiness-2019-12-02.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Route53RecoveryReadiness;
