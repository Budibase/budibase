var hashUtils = require('./browserHashUtils');
var Buffer = require('buffer/').Buffer;

var BLOCK_SIZE = 64;

var DIGEST_LENGTH = 16;

var INIT = [
    0x67452301,
    0xefcdab89,
    0x98badcfe,
    0x10325476,
];

/**
 * @api private
 */
function Md5() {
    this.state = [
        0x67452301,
        0xefcdab89,
        0x98badcfe,
        0x10325476,
    ];
    this.buffer = new DataView(new ArrayBuffer(BLOCK_SIZE));
    this.bufferLength = 0;
    this.bytesHashed = 0;
    this.finished = false;
}

/**
 * @api private
 */
module.exports = exports = Md5;

Md5.BLOCK_SIZE = BLOCK_SIZE;

Md5.prototype.update = function (sourceData) {
    if (hashUtils.isEmptyData(sourceData)) {
        return this;
    } else if (this.finished) {
        throw new Error('Attempted to update an already finished hash.');
    }

    var data = hashUtils.convertToBuffer(sourceData);
    var position = 0;
    var byteLength = data.byteLength;
    this.bytesHashed += byteLength;
    while (byteLength > 0) {
        this.buffer.setUint8(this.bufferLength++, data[position++]);
        byteLength--;
        if (this.bufferLength === BLOCK_SIZE) {
            this.hashBuffer();
            this.bufferLength = 0;
        }
    }

    return this;
};

Md5.prototype.digest = function (encoding) {
    if (!this.finished) {
        var _a = this, buffer = _a.buffer, undecoratedLength = _a.bufferLength, bytesHashed = _a.bytesHashed;
        var bitsHashed = bytesHashed * 8;
        buffer.setUint8(this.bufferLength++, 128);
        // Ensure the final block has enough room for the hashed length
        if (undecoratedLength % BLOCK_SIZE >= BLOCK_SIZE - 8) {
            for (var i = this.bufferLength; i < BLOCK_SIZE; i++) {
                buffer.setUint8(i, 0);
            }
            this.hashBuffer();
            this.bufferLength = 0;
        }
        for (var i = this.bufferLength; i < BLOCK_SIZE - 8; i++) {
            buffer.setUint8(i, 0);
        }
        buffer.setUint32(BLOCK_SIZE - 8, bitsHashed >>> 0, true);
        buffer.setUint32(BLOCK_SIZE - 4, Math.floor(bitsHashed / 0x100000000), true);
        this.hashBuffer();
        this.finished = true;
    }
    var out = new DataView(new ArrayBuffer(DIGEST_LENGTH));
    for (var i = 0; i < 4; i++) {
        out.setUint32(i * 4, this.state[i], true);
    }
    var buff = new Buffer(out.buffer, out.byteOffset, out.byteLength);
    return encoding ? buff.toString(encoding) : buff;
};

Md5.prototype.hashBuffer = function () {
    var _a = this, buffer = _a.buffer, state = _a.state;
    var a = state[0], b = state[1], c = state[2], d = state[3];
    a = ff(a, b, c, d, buffer.getUint32(0, true), 7, 0xd76aa478);
    d = ff(d, a, b, c, buffer.getUint32(4, true), 12, 0xe8c7b756);
    c = ff(c, d, a, b, buffer.getUint32(8, true), 17, 0x242070db);
    b = ff(b, c, d, a, buffer.getUint32(12, true), 22, 0xc1bdceee);
    a = ff(a, b, c, d, buffer.getUint32(16, true), 7, 0xf57c0faf);
    d = ff(d, a, b, c, buffer.getUint32(20, true), 12, 0x4787c62a);
    c = ff(c, d, a, b, buffer.getUint32(24, true), 17, 0xa8304613);
    b = ff(b, c, d, a, buffer.getUint32(28, true), 22, 0xfd469501);
    a = ff(a, b, c, d, buffer.getUint32(32, true), 7, 0x698098d8);
    d = ff(d, a, b, c, buffer.getUint32(36, true), 12, 0x8b44f7af);
    c = ff(c, d, a, b, buffer.getUint32(40, true), 17, 0xffff5bb1);
    b = ff(b, c, d, a, buffer.getUint32(44, true), 22, 0x895cd7be);
    a = ff(a, b, c, d, buffer.getUint32(48, true), 7, 0x6b901122);
    d = ff(d, a, b, c, buffer.getUint32(52, true), 12, 0xfd987193);
    c = ff(c, d, a, b, buffer.getUint32(56, true), 17, 0xa679438e);
    b = ff(b, c, d, a, buffer.getUint32(60, true), 22, 0x49b40821);
    a = gg(a, b, c, d, buffer.getUint32(4, true), 5, 0xf61e2562);
    d = gg(d, a, b, c, buffer.getUint32(24, true), 9, 0xc040b340);
    c = gg(c, d, a, b, buffer.getUint32(44, true), 14, 0x265e5a51);
    b = gg(b, c, d, a, buffer.getUint32(0, true), 20, 0xe9b6c7aa);
    a = gg(a, b, c, d, buffer.getUint32(20, true), 5, 0xd62f105d);
    d = gg(d, a, b, c, buffer.getUint32(40, true), 9, 0x02441453);
    c = gg(c, d, a, b, buffer.getUint32(60, true), 14, 0xd8a1e681);
    b = gg(b, c, d, a, buffer.getUint32(16, true), 20, 0xe7d3fbc8);
    a = gg(a, b, c, d, buffer.getUint32(36, true), 5, 0x21e1cde6);
    d = gg(d, a, b, c, buffer.getUint32(56, true), 9, 0xc33707d6);
    c = gg(c, d, a, b, buffer.getUint32(12, true), 14, 0xf4d50d87);
    b = gg(b, c, d, a, buffer.getUint32(32, true), 20, 0x455a14ed);
    a = gg(a, b, c, d, buffer.getUint32(52, true), 5, 0xa9e3e905);
    d = gg(d, a, b, c, buffer.getUint32(8, true), 9, 0xfcefa3f8);
    c = gg(c, d, a, b, buffer.getUint32(28, true), 14, 0x676f02d9);
    b = gg(b, c, d, a, buffer.getUint32(48, true), 20, 0x8d2a4c8a);
    a = hh(a, b, c, d, buffer.getUint32(20, true), 4, 0xfffa3942);
    d = hh(d, a, b, c, buffer.getUint32(32, true), 11, 0x8771f681);
    c = hh(c, d, a, b, buffer.getUint32(44, true), 16, 0x6d9d6122);
    b = hh(b, c, d, a, buffer.getUint32(56, true), 23, 0xfde5380c);
    a = hh(a, b, c, d, buffer.getUint32(4, true), 4, 0xa4beea44);
    d = hh(d, a, b, c, buffer.getUint32(16, true), 11, 0x4bdecfa9);
    c = hh(c, d, a, b, buffer.getUint32(28, true), 16, 0xf6bb4b60);
    b = hh(b, c, d, a, buffer.getUint32(40, true), 23, 0xbebfbc70);
    a = hh(a, b, c, d, buffer.getUint32(52, true), 4, 0x289b7ec6);
    d = hh(d, a, b, c, buffer.getUint32(0, true), 11, 0xeaa127fa);
    c = hh(c, d, a, b, buffer.getUint32(12, true), 16, 0xd4ef3085);
    b = hh(b, c, d, a, buffer.getUint32(24, true), 23, 0x04881d05);
    a = hh(a, b, c, d, buffer.getUint32(36, true), 4, 0xd9d4d039);
    d = hh(d, a, b, c, buffer.getUint32(48, true), 11, 0xe6db99e5);
    c = hh(c, d, a, b, buffer.getUint32(60, true), 16, 0x1fa27cf8);
    b = hh(b, c, d, a, buffer.getUint32(8, true), 23, 0xc4ac5665);
    a = ii(a, b, c, d, buffer.getUint32(0, true), 6, 0xf4292244);
    d = ii(d, a, b, c, buffer.getUint32(28, true), 10, 0x432aff97);
    c = ii(c, d, a, b, buffer.getUint32(56, true), 15, 0xab9423a7);
    b = ii(b, c, d, a, buffer.getUint32(20, true), 21, 0xfc93a039);
    a = ii(a, b, c, d, buffer.getUint32(48, true), 6, 0x655b59c3);
    d = ii(d, a, b, c, buffer.getUint32(12, true), 10, 0x8f0ccc92);
    c = ii(c, d, a, b, buffer.getUint32(40, true), 15, 0xffeff47d);
    b = ii(b, c, d, a, buffer.getUint32(4, true), 21, 0x85845dd1);
    a = ii(a, b, c, d, buffer.getUint32(32, true), 6, 0x6fa87e4f);
    d = ii(d, a, b, c, buffer.getUint32(60, true), 10, 0xfe2ce6e0);
    c = ii(c, d, a, b, buffer.getUint32(24, true), 15, 0xa3014314);
    b = ii(b, c, d, a, buffer.getUint32(52, true), 21, 0x4e0811a1);
    a = ii(a, b, c, d, buffer.getUint32(16, true), 6, 0xf7537e82);
    d = ii(d, a, b, c, buffer.getUint32(44, true), 10, 0xbd3af235);
    c = ii(c, d, a, b, buffer.getUint32(8, true), 15, 0x2ad7d2bb);
    b = ii(b, c, d, a, buffer.getUint32(36, true), 21, 0xeb86d391);
    state[0] = (a + state[0]) & 0xFFFFFFFF;
    state[1] = (b + state[1]) & 0xFFFFFFFF;
    state[2] = (c + state[2]) & 0xFFFFFFFF;
    state[3] = (d + state[3]) & 0xFFFFFFFF;
};

function cmn(q, a, b, x, s, t) {
    a = (((a + q) & 0xFFFFFFFF) + ((x + t) & 0xFFFFFFFF)) & 0xFFFFFFFF;
    return (((a << s) | (a >>> (32 - s))) + b) & 0xFFFFFFFF;
}

function ff(a, b, c, d, x, s, t) {
    return cmn((b & c) | ((~b) & d), a, b, x, s, t);
}

function gg(a, b, c, d, x, s, t) {
    return cmn((b & d) | (c & (~d)), a, b, x, s, t);
}

function hh(a, b, c, d, x, s, t) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
}

function ii(a, b, c, d, x, s, t) {
    return cmn(c ^ (b | (~d)), a, b, x, s, t);
}
