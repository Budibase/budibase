require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['ec2instanceconnect'] = {};
AWS.EC2InstanceConnect = Service.defineService('ec2instanceconnect', ['2018-04-02']);
Object.defineProperty(apiLoader.services['ec2instanceconnect'], '2018-04-02', {
  get: function get() {
    var model = require('../apis/ec2-instance-connect-2018-04-02.min.json');
    model.paginators = require('../apis/ec2-instance-connect-2018-04-02.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.EC2InstanceConnect;
