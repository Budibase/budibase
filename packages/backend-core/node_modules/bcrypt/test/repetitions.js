var bcrypt = require('../bcrypt');

var EXPECTED = 2500; //number of times to iterate these tests...

module.exports = {
  test_salt_length: function(assert) {
    assert.expect(EXPECTED);
    var n = 0;
    for (var i = 0; i < EXPECTED; i++) {
      bcrypt.genSalt(10, function(err, salt) {
        assert.equals(29, salt.length, "Salt ("+salt+") isn't the correct length. It is: " + salt.length);
        n++;
      });
    }

    function checkVal() {
        if (n == EXPECTED) {
          assert.done();
        } else {
          setTimeout(checkVal, 100);
        }
    }
    setTimeout(checkVal, 100);
  },
  test_hash_length: function(assert) {
    assert.expect(EXPECTED);
    var SALT = '$2a$04$TnjywYklQbbZjdjBgBoA4e';
    var n = 0;
    for (var i = 0; i < EXPECTED; i++) {
      bcrypt.hash('test', SALT, function(err, crypted) {
        assert.equals(60, crypted.length, "Encrypted ("+crypted+") isn't the correct length. It is: " + crypted.length);
        n++;
      });
    }

    function checkVal() {
      if (n == EXPECTED) {
        assert.done();
      } else {
        setTimeout(checkVal, 100);
      }
    }
    setTimeout(checkVal, 100);
  },
  test_compare: function(assert) {
    assert.expect(EXPECTED);
    var HASH = '$2a$04$TnjywYklQbbZjdjBgBoA4e9G7RJt9blgMgsCvUvus4Iv4TENB5nHy';
    var n = 0;
    for (var i = 0; i < EXPECTED; i++) {
      bcrypt.compare('test', HASH, function(err, match) {
        assert.equal(true, match, "No match.");
        n++;
      });
    }

    function checkVal() {
      if (n == EXPECTED) {
        assert.done();
      } else {
        setTimeout(checkVal, 100);
      }
    }
    setTimeout(checkVal, 100);
  },
  test_hash_and_compare: function(assert) {
    assert.expect((EXPECTED-1)*3);
    var salt = bcrypt.genSaltSync(4),
        idx = 0,
        good_done = false,
        bad_done = false;

    function next() {
      return test('secret' + Math.random());
    }

    function test(password) {
      idx += 1;
      return bcrypt.hash(password, salt, function(err, hash) {
        if (err) throw err;
        //console.log('\nbcrypt iter ' + idx);

        assert.ok(hash);

        bcrypt.compare(password, hash, function(err, res) {
          //if (err) throw err;
          assert.ok(res);
          if (idx >= (EXPECTED-1)) {
            good_done = true;
          }
        });

        bcrypt.compare('bad' + password, hash, function(err, res) {
          //if (err) throw err;
          assert.ok(!res);
          if (idx >= (EXPECTED-1)) {
            bad_done = true;
          }
        });

        if (idx < ((EXPECTED)-1)) {
          next();
        } else {
          function checkDone() {
            if (idx >= (EXPECTED-1) && good_done && bad_done) {
              assert.done();
            } else {
              setTimeout(checkDone, 100);
            }
          }

          setTimeout(checkDone, 100);
        }
      });
    }

    next();
  }
};
