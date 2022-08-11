require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['codeartifact'] = {};
AWS.CodeArtifact = Service.defineService('codeartifact', ['2018-09-22']);
Object.defineProperty(apiLoader.services['codeartifact'], '2018-09-22', {
  get: function get() {
    var model = require('../apis/codeartifact-2018-09-22.min.json');
    model.paginators = require('../apis/codeartifact-2018-09-22.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.CodeArtifact;
