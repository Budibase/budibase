require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['route53recoverycluster'] = {};
AWS.Route53RecoveryCluster = Service.defineService('route53recoverycluster', ['2019-12-02']);
Object.defineProperty(apiLoader.services['route53recoverycluster'], '2019-12-02', {
  get: function get() {
    var model = require('../apis/route53-recovery-cluster-2019-12-02.min.json');
    model.paginators = require('../apis/route53-recovery-cluster-2019-12-02.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Route53RecoveryCluster;
