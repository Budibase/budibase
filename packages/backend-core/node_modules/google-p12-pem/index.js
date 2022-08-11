var forge = require('node-forge');
var fs = require('fs');

/**
 * Convert a .p12 file to .pem string.
 * This is the constructor so it can also be used to
 * create an object that can be reused to get different keys.
 *
 * @param  {string}    filename The .p12 key filename.
 * @param  {Function=} callback The callback function.
 */
function GoogleP12toPem(filename, callback) {
  if (!(this instanceof GoogleP12toPem)) {
    var gp12 = new GoogleP12toPem();
    return gp12.getPem(filename, callback);
  }

  this.pem = null;
}

/**
 * Convert a .p12 file to .pem string
 * @param  {string}    filename The .p12 key filename.
 * @param  {Function=} callback The callback function.
 * @return {string=}            The .pem private key if no callback provided.
 */
GoogleP12toPem.prototype.getPem = function(filename, callback) {
  var self = this;

  if (typeof callback === 'function') {
    fs.readFile(filename, { encoding: 'base64' }, function(err, keyp12) {
      if (err) {
        callback(err, null);
        return;
      }
      try {
        this.pem = _convertToPem(keyp12);
      } catch (e) {
        callback(e, null);
        return;
      }
      callback(null, this.pem);
    });
  } else {
    var keyp12 = fs.readFileSync(filename, { encoding: 'base64' });
    this.pem = _convertToPem(keyp12);
    return this.pem;
  }

  function _convertToPem(p12base64) {
    var p12Der = forge.util.decode64(p12base64);
    var p12Asn1 = forge.asn1.fromDer(p12Der);
    var p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, 'notasecret');
    var privateKey = p12.getBagsByFriendlyName('privatekey')[0].key;
    var pem = forge.pki.privateKeyToPem(privateKey);
    return pem.replace(/\r\n/g, '\n');
  }
};

module.exports = GoogleP12toPem;
