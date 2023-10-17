require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['paymentcryptography'] = {};
AWS.PaymentCryptography = Service.defineService('paymentcryptography', ['2021-09-14']);
Object.defineProperty(apiLoader.services['paymentcryptography'], '2021-09-14', {
  get: function get() {
    var model = require('../apis/payment-cryptography-2021-09-14.min.json');
    model.paginators = require('../apis/payment-cryptography-2021-09-14.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.PaymentCryptography;
