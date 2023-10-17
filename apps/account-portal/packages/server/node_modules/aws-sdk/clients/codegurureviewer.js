require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['codegurureviewer'] = {};
AWS.CodeGuruReviewer = Service.defineService('codegurureviewer', ['2019-09-19']);
Object.defineProperty(apiLoader.services['codegurureviewer'], '2019-09-19', {
  get: function get() {
    var model = require('../apis/codeguru-reviewer-2019-09-19.min.json');
    model.paginators = require('../apis/codeguru-reviewer-2019-09-19.paginators.json').pagination;
    model.waiters = require('../apis/codeguru-reviewer-2019-09-19.waiters2.json').waiters;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.CodeGuruReviewer;
