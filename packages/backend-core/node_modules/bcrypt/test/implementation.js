var bcrypt = require('../bcrypt');

// some tests were adapted from https://github.com/riverrun/bcrypt_elixir/blob/master/test/base_test.exs
// which are under the BSD LICENSE
module.exports = {
    openwall_bcrypt_tests: function(assert) {
        assert.strictEqual(bcrypt.hashSync("U*U", "$2a$05$CCCCCCCCCCCCCCCCCCCCC."), "$2a$05$CCCCCCCCCCCCCCCCCCCCC.E5YPO9kmyuRGyh0XouQYb4YMJKvyOeW");
        assert.strictEqual(bcrypt.hashSync("U*U*", "$2a$05$CCCCCCCCCCCCCCCCCCCCC."), "$2a$05$CCCCCCCCCCCCCCCCCCCCC.VGOzA784oUp/Z0DY336zx7pLYAy0lwK");
        assert.strictEqual(bcrypt.hashSync("U*U*U", "$2a$05$XXXXXXXXXXXXXXXXXXXXXO"), "$2a$05$XXXXXXXXXXXXXXXXXXXXXOAcXxm9kjPGEMsLznoKqmqw7tc8WCx4a");
        assert.strictEqual(bcrypt.hashSync("", "$2a$05$CCCCCCCCCCCCCCCCCCCCC."), "$2a$05$CCCCCCCCCCCCCCCCCCCCC.7uG0VCzI2bS7j6ymqJi9CdcdxiRTWNy");
        assert.strictEqual(bcrypt.hashSync("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", "$2a$05$abcdefghijklmnopqrstuu"), "$2a$05$abcdefghijklmnopqrstuu5s2v8.iXieOjg/.AySBTTZIIVFJeBui");
        assert.done();
    },
    openbsd_bcrypt_tests: function(assert) {
        assert.strictEqual(bcrypt.hashSync("000000000000000000000000000000000000000000000000000000000000000000000000", "$2a$05$CCCCCCCCCCCCCCCCCCCCC."), "$2a$05$CCCCCCCCCCCCCCCCCCCCC.6.O1dLNbjod2uo0DVcW.jHucKbPDdHS");
        assert.strictEqual(bcrypt.hashSync("000000000000000000000000000000000000000000000000000000000000000000000000", "$2b$05$CCCCCCCCCCCCCCCCCCCCC."), "$2b$05$CCCCCCCCCCCCCCCCCCCCC.6.O1dLNbjod2uo0DVcW.jHucKbPDdHS");
        assert.done();
    },
    test_long_passwords: function(assert) {
        // bcrypt wrap-around bug in $2a$
        assert.strictEqual(bcrypt.hashSync("012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234", "$2a$05$CCCCCCCCCCCCCCCCCCCCC."), "$2a$05$CCCCCCCCCCCCCCCCCCCCC.6.O1dLNbjod2uo0DVcW.jHucKbPDdHS");
        assert.strictEqual(bcrypt.hashSync("01XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", "$2a$05$CCCCCCCCCCCCCCCCCCCCC."), "$2a$05$CCCCCCCCCCCCCCCCCCCCC.6.O1dLNbjod2uo0DVcW.jHucKbPDdHS");

        // tests for $2b$ which fixes wrap-around bugs
        assert.strictEqual(bcrypt.hashSync("012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234", "$2b$05$CCCCCCCCCCCCCCCCCCCCC."), "$2b$05$CCCCCCCCCCCCCCCCCCCCC.XxrQqgBi/5Sxuq9soXzDtjIZ7w5pMfK");
        assert.strictEqual(bcrypt.hashSync("0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345", "$2b$05$CCCCCCCCCCCCCCCCCCCCC."), "$2b$05$CCCCCCCCCCCCCCCCCCCCC.XxrQqgBi/5Sxuq9soXzDtjIZ7w5pMfK");
        assert.done();
    },
    test_embedded_nulls: function(assert) {
        assert.strictEqual(bcrypt.hashSync("Passw\0rd123", "$2b$05$CCCCCCCCCCCCCCCCCCCCC."), "$2b$05$CCCCCCCCCCCCCCCCCCCCC.VHy/kzL4sCcX3Ib3wN5rNGiRt.TpfxS");
        assert.strictEqual(bcrypt.hashSync("Passw\0 you can literally write anything after the NUL character", "$2b$05$CCCCCCCCCCCCCCCCCCCCC."), "$2b$05$CCCCCCCCCCCCCCCCCCCCC.4vJLJQ6nZ/70INTjjSZWQ0iyUek92tu");
        assert.strictEqual(bcrypt.hashSync(Buffer.from("Passw\0 you can literally write anything after the NUL character"), "$2b$05$CCCCCCCCCCCCCCCCCCCCC."), "$2b$05$CCCCCCCCCCCCCCCCCCCCC.4vJLJQ6nZ/70INTjjSZWQ0iyUek92tu");
        assert.done();
    },
    test_shorten_salt_to_128_bits: function(assert) {
        assert.strictEqual(bcrypt.hashSync("test", "$2a$10$1234567899123456789012"), "$2a$10$123456789912345678901u.OtL1A1eGK5wmvBKUDYKvuVKI7h2XBu");
        assert.strictEqual(bcrypt.hashSync("U*U*", "$2a$05$CCCCCCCCCCCCCCCCCCCCCh"), "$2a$05$CCCCCCCCCCCCCCCCCCCCCeUQ7VjYZ2hd4bLYZdhuPpZMUpEUJDw1S");
        assert.strictEqual(bcrypt.hashSync("U*U*", "$2a$05$CCCCCCCCCCCCCCCCCCCCCM"), "$2a$05$CCCCCCCCCCCCCCCCCCCCC.VGOzA784oUp/Z0DY336zx7pLYAy0lwK");
        assert.strictEqual(bcrypt.hashSync("U*U*", "$2a$05$CCCCCCCCCCCCCCCCCCCCCA"), "$2a$05$CCCCCCCCCCCCCCCCCCCCC.VGOzA784oUp/Z0DY336zx7pLYAy0lwK");
        assert.done();
    },
    test_consistency: function(assert) {
        assert.strictEqual(bcrypt.hashSync("ππππππππ", "$2a$10$.TtQJ4Jr6isd4Hp.mVfZeu"), "$2a$10$.TtQJ4Jr6isd4Hp.mVfZeuh6Gws4rOQ/vdBczhDx.19NFK0Y84Dle");
        assert.strictEqual(bcrypt.hashSync("p@5sw0rd", "$2b$12$zQ4CooEXdGqcwi0PHsgc8e"), "$2b$12$zQ4CooEXdGqcwi0PHsgc8eAf0DLXE/XHoBE8kCSGQ97rXwuClaPam");
        assert.strictEqual(bcrypt.hashSync("C'est bon, la vie!", "$2b$12$cbo7LZ.wxgW4yxAA5Vqlv."), "$2b$12$cbo7LZ.wxgW4yxAA5Vqlv.KR6QFPt4qCdc9RYJNXxa/rbUOp.1sw.");
        assert.strictEqual(bcrypt.hashSync("ἓν οἶδα ὅτι οὐδὲν οἶδα", "$2b$12$LeHKWR2bmrazi/6P22Jpau"), "$2b$12$LeHKWR2bmrazi/6P22JpauX5my/eKwwKpWqL7L5iEByBnxNc76FRW");
        assert.strictEqual(bcrypt.hashSync(Buffer.from("ἓν οἶδα ὅτι οὐδὲν οἶδα"), "$2b$12$LeHKWR2bmrazi/6P22Jpau"), "$2b$12$LeHKWR2bmrazi/6P22JpauX5my/eKwwKpWqL7L5iEByBnxNc76FRW");
        bcrypt.hash(Buffer.from("ἓν οἶδα ὅτι οὐδὲν οἶδα"), "$2b$12$LeHKWR2bmrazi/6P22Jpau", function(err, hash) {
            assert.strictEqual(hash, "$2b$12$LeHKWR2bmrazi/6P22JpauX5my/eKwwKpWqL7L5iEByBnxNc76FRW");
            assert.done();
        });
    }
}
