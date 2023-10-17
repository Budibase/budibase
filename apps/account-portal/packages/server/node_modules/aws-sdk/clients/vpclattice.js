require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['vpclattice'] = {};
AWS.VPCLattice = Service.defineService('vpclattice', ['2022-11-30']);
Object.defineProperty(apiLoader.services['vpclattice'], '2022-11-30', {
  get: function get() {
    var model = require('../apis/vpc-lattice-2022-11-30.min.json');
    model.paginators = require('../apis/vpc-lattice-2022-11-30.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.VPCLattice;
