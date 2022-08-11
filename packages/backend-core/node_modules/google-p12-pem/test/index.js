var assert = require('assert');
var fs = require('fs');

describe('GoogleP12Pem', function() {
  var gp12pem = require('../index.js');
  var GOODP12FILE = './test/assets/key.p12';
  var BADP12FILE = './test/assets/badkey.p12';
  var PEMFILENAME = './test/assets/key.pem';
  var expectedPem = fs.readFileSync(PEMFILENAME, { encoding: 'utf8' });
  var noop = function() {};

  it('should exist', function() {
    assert.equal(typeof gp12pem, 'function');
  });

  it('should provide error on bad filename and callback', function(done) {
    gp12pem('./badfilename.p12', function(err, pem) {
      assert(err);
      assert.equal(pem, null);
      assert.ok(err.message.startsWith("ENOENT"));
      done();
    });
  });

  it('should throw ENOENT on bad filename with no callback', function() {
    assert.throws(function() {
      var pem = gp12pem('./badfilename.p12');
    }, /ENOENT/);
  });

  it('should throw error on bad .p12 with no callback', function() {
    assert.throws(function() {
      var pem = gp12pem(BADP12FILE);
    }, /Too few bytes to read/);
  });

  it('should return error on bad .p12 in callback', function(done) {
    assert.doesNotThrow(function() {
      gp12pem(BADP12FILE, function(err, pem) {
        assert.equal(null);
        assert(err.message.indexOf('Too few bytes to read') > -1);
        done();
      });
    });
  });

  it('should work async when provided a callback', function(done) {
    gp12pem(GOODP12FILE, function(err, pem) {
      assert.ifError(err);
      assert.equal(expectedPem, pem);
      done();
    });
  });

  it('should work sync when not provided a callback', function() {
    var pem = gp12pem(GOODP12FILE);
    assert.equal(expectedPem, pem);
  });
});
