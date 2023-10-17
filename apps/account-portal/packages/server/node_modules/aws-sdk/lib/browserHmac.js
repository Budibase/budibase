var hashUtils = require('./browserHashUtils');

/**
 * @api private
 */
function Hmac(hashCtor, secret) {
    this.hash = new hashCtor();
    this.outer = new hashCtor();

    var inner = bufferFromSecret(hashCtor, secret);
    var outer = new Uint8Array(hashCtor.BLOCK_SIZE);
    outer.set(inner);

    for (var i = 0; i < hashCtor.BLOCK_SIZE; i++) {
        inner[i] ^= 0x36;
        outer[i] ^= 0x5c;
    }

    this.hash.update(inner);
    this.outer.update(outer);

    // Zero out the copied key buffer.
    for (var i = 0; i < inner.byteLength; i++) {
        inner[i] = 0;
    }
}

/**
 * @api private
 */
module.exports = exports = Hmac;

Hmac.prototype.update = function (toHash) {
    if (hashUtils.isEmptyData(toHash) || this.error) {
        return this;
    }

    try {
        this.hash.update(hashUtils.convertToBuffer(toHash));
    } catch (e) {
        this.error = e;
    }

    return this;
};

Hmac.prototype.digest = function (encoding) {
    if (!this.outer.finished) {
        this.outer.update(this.hash.digest());
    }

    return this.outer.digest(encoding);
};

function bufferFromSecret(hashCtor, secret) {
    var input = hashUtils.convertToBuffer(secret);
    if (input.byteLength > hashCtor.BLOCK_SIZE) {
        var bufferHash = new hashCtor;
        bufferHash.update(input);
        input = bufferHash.digest();
    }
    var buffer = new Uint8Array(hashCtor.BLOCK_SIZE);
    buffer.set(input);
    return buffer;
}
