require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['route53recoverycontrolconfig'] = {};
AWS.Route53RecoveryControlConfig = Service.defineService('route53recoverycontrolconfig', ['2020-11-02']);
Object.defineProperty(apiLoader.services['route53recoverycontrolconfig'], '2020-11-02', {
  get: function get() {
    var model = require('../apis/route53-recovery-control-config-2020-11-02.min.json');
    model.paginators = require('../apis/route53-recovery-control-config-2020-11-02.paginators.json').pagination;
    model.waiters = require('../apis/route53-recovery-control-config-2020-11-02.waiters2.json').waiters;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Route53RecoveryControlConfig;
