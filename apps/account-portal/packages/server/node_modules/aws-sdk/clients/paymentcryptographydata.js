require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['paymentcryptographydata'] = {};
AWS.PaymentCryptographyData = Service.defineService('paymentcryptographydata', ['2022-02-03']);
Object.defineProperty(apiLoader.services['paymentcryptographydata'], '2022-02-03', {
  get: function get() {
    var model = require('../apis/payment-cryptography-data-2022-02-03.min.json');
    model.paginators = require('../apis/payment-cryptography-data-2022-02-03.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.PaymentCryptographyData;
