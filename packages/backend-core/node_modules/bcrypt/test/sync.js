var bcrypt = require('../bcrypt');

module.exports = {
    test_salt_length: function(assert) {
        var salt = bcrypt.genSaltSync(10);
        assert.strictEqual(29, salt.length, "Salt isn't the correct length.");
        var split_salt = salt.split('$');
        assert.strictEqual(split_salt[1], '2b');
        assert.strictEqual(split_salt[2], '10');
        assert.done();
    },
    test_salt_no_params: function(assert) {
        // same as test_verify_salt except using default rounds of 10
        var salt = bcrypt.genSaltSync();
        var split_salt = salt.split('$');
        assert.strictEqual(split_salt[1], '2b');
        assert.strictEqual(split_salt[2], '10');
        assert.done();
    },
    test_salt_rounds_is_string_number: function(assert) {
        assert.throws(function() {bcrypt.genSaltSync('10');}, "Should throw an Error. No params.");
        assert.done();
    },
    test_salt_rounds_is_NaN: function(assert) {
        assert.throws(function() {bcrypt.genSaltSync('b');}, "Should throw an Error. gen_salt requires rounds to be a number.");
        assert.done();
    },
    test_salt_minor_a: function(assert) {
        var salt = bcrypt.genSaltSync(10, 'a');
        assert.strictEqual(29, salt.length, "Salt isn't the correct length.");
        var split_salt = salt.split('$');
        assert.strictEqual(split_salt[1], '2a');
        assert.strictEqual(split_salt[2], '10');
        assert.done();
    },
    test_salt_minor_b: function(assert) {
        var salt = bcrypt.genSaltSync(10, 'b');
        assert.strictEqual(29, salt.length, "Salt isn't the correct length.");
        var split_salt = salt.split('$');
        assert.strictEqual(split_salt[1], '2b');
        assert.strictEqual(split_salt[2], '10');
        assert.done();
    },
    test_hash: function(assert) {
        assert.ok(bcrypt.hashSync('password', bcrypt.genSaltSync(10)), "Shouldn't throw an Error.");
        assert.done();
    },
    test_hash_rounds: function(assert) {
        var hash = bcrypt.hashSync('password', 8);
        assert.strictEqual(bcrypt.getRounds(hash), 8, "Number of rounds should equal 8.");
        assert.done();
    },
    test_hash_empty_string: function(assert) {
        assert.ok(bcrypt.hashSync('', bcrypt.genSaltSync(10)), "Shouldn't throw an Error.");
        assert.throws(function() {bcrypt.hashSync('password', '')}, "Should have thrown an Error related to the salt.");
        assert.throws(function() {bcrypt.hashSync('', '')}, "Should have thrown an Error related to the salt.");
        assert.done();
    },
    test_hash_pw_no_params: function(assert) {
        assert.throws(function() {bcrypt.hashSync();}, "Should throw an Error. No Params.");
        assert.done();
    },
    test_hash_pw_one_param: function(assert) {
        assert.throws(function() {bcrypt.hashSync('password');}, "Should throw an Error. No salt.");
        assert.done();
    },
    test_hash_pw_not_hash_str: function(assert) {
        assert.throws(function() {bcrypt.hashSync('password', {});}, "Should throw an Error. hash should be a string or number.");
        assert.done();
    },
    test_hash_salt_validity: function(assert) {
        assert.expect(2);
        assert.ok(bcrypt.hashSync('password', '$2a$10$somesaltyvaluertsetrse'));
        assert.throws(function() {
            bcrypt.hashSync('password', 'some$value');
        });
        assert.done();
    },
    test_verify_salt: function(assert) {
        var salt = bcrypt.genSaltSync(10);
        var split_salt = salt.split('$');
        assert.strictEqual(split_salt[1], '2b');
        assert.strictEqual(split_salt[2], '10');
        assert.done();
    },
    test_verify_salt_min_rounds: function(assert) {
        var salt = bcrypt.genSaltSync(1);
        var split_salt = salt.split('$');
        assert.strictEqual(split_salt[1], '2b');
        assert.strictEqual(split_salt[2], '04');
        assert.done();
    },
    test_verify_salt_max_rounds: function(assert) {
        var salt = bcrypt.genSaltSync(100);
        var split_salt = salt.split('$');
        assert.strictEqual(split_salt[1], '2b');
        assert.strictEqual(split_salt[2], '31');
        assert.done();
    },
    test_hash_compare: function(assert) {
        var salt = bcrypt.genSaltSync(10);
        assert.strictEqual(29, salt.length, "Salt isn't the correct length.");
        var hash = bcrypt.hashSync("test", salt);
        assert.ok(bcrypt.compareSync("test", hash), "These hashes should be equal.");
        assert.ok(!(bcrypt.compareSync("blah", hash)), "These hashes should not be equal.");
        assert.done();
    },
    test_hash_compare_empty_strings: function(assert) {
        assert.ok(!(bcrypt.compareSync("", "password")), "These hashes should not be equal.");
        assert.ok(!(bcrypt.compareSync("", "")), "These hashes should not be equal.");
        assert.ok(!(bcrypt.compareSync("password", "")), "These hashes should not be equal.");
        assert.done();
    },
    test_hash_compare_invalid_strings: function(assert) {
      var fullString = 'envy1362987212538';
      var hash = '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqaG3vv1BD7WC';
      var wut = ':';
      bcrypt.compareSync(fullString, hash, function(err, res) {
        assert.ok(res);
      });
      bcrypt.compareSync(fullString, wut, function(err, res) {
        assert.ok(!res)
      });
      assert.done();
    },
    test_getRounds: function(assert) {
        var hash = bcrypt.hashSync("test", bcrypt.genSaltSync(9));
        assert.strictEqual(9, bcrypt.getRounds(hash), "getRounds can't extract rounds");
        assert.done();
    },
    test_getRounds: function(assert) {
        var hash = bcrypt.hashSync("test", bcrypt.genSaltSync(9));
        assert.strictEqual(9, bcrypt.getRounds(hash), "getRounds can't extract rounds");
        assert.throws(function() {bcrypt.getRounds(''); }, "Must pass a valid hash to getRounds");
        assert.done();
    }
};
