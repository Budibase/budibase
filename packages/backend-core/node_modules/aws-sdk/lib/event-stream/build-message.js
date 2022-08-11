var util = require('../core').util;
var crypto = util.crypto;
var Int64 = require('./int64').Int64;
var toBuffer = util.buffer.toBuffer;
var allocBuffer = util.buffer.alloc;
var Buffer = util.Buffer;

/**
 * @api private
 */
function buildMessage(message) {
    var formattedHeaders = buildHeaders(message.headers);

    var headerLengthBytes = allocBuffer(4);
    headerLengthBytes.writeUInt32BE(formattedHeaders.length, 0);

    var totalLengthBytes = allocBuffer(4);
    totalLengthBytes.writeUInt32BE(
        totalLengthBytes.length + // size of this buffer
        headerLengthBytes.length + // size of header length buffer
        4 + // prelude crc32
        formattedHeaders.length + // total size of headers
        message.body.length + // total size of payload
        4, // size of crc32 of the total message
        0
    );

    var prelude = Buffer.concat([
        totalLengthBytes,
        headerLengthBytes
    ], totalLengthBytes.length + headerLengthBytes.length);
    var preludeCrc32 = crc32(prelude);

    var totalSansCrc32 = Buffer.concat([
        prelude, preludeCrc32, formattedHeaders, message.body
    ], prelude.length + preludeCrc32.length + formattedHeaders.length + message.body.length);
    var totalCrc32 = crc32(totalSansCrc32);

    return Buffer.concat([totalSansCrc32, totalCrc32]);
}

function buildHeaders(headers) {
    /** @type {Buffer[]} */
    var chunks = [];
    var totalSize = 0;

    var headerNames = Object.keys(headers);
    for (var i = 0; i < headerNames.length; i++) {
        var headerName = headerNames[i];
        var bytes = toBuffer(headerName);
        var headerValue = buildHeaderValue(headers[headerName]);
        var nameLength = allocBuffer(1);
        nameLength[0] = headerName.length;
        chunks.push(
            nameLength,
            bytes,
            headerValue
        );
        totalSize += nameLength.length + bytes.length + headerValue.length;
    }

    var out = allocBuffer(totalSize);
    var position = 0;
    for (var j = 0; j < chunks.length; j++) {
        var chunk = chunks[j];
        for (var k = 0; k < chunk.length; k++) {
            out[position] = chunk[k];
            position++;
        }
    }

    return out;
}

/**
 * @param {object} header
 * @param {'boolean'|'byte'|'short'|'integer'|'long'|'binary'|'string'|'timestamp'|'uuid'} header.type
 * @param {*} header.value
 * @returns {Buffer}
 */
function buildHeaderValue(header) {
    switch (header.type) {
        case 'binary':
            var binBytes = allocBuffer(3);
            binBytes.writeUInt8(HEADER_VALUE_TYPE.byteArray, 0);
            binBytes.writeUInt16BE(header.value.length, 1);
            return Buffer.concat([
                binBytes, header.value
            ], binBytes.length + header.value.length);
        case 'boolean':
            var boolByte = allocBuffer(1);
            boolByte[0] = header.value ? HEADER_VALUE_TYPE.boolTrue : HEADER_VALUE_TYPE.boolFalse;
            return boolByte;
        case 'byte':
            var singleByte = allocBuffer(2);
            singleByte[0] = HEADER_VALUE_TYPE.byte;
            singleByte[1] = header.value;
            return singleByte;
        case 'integer':
            var intBytes = allocBuffer(5);
            intBytes.writeUInt8(HEADER_VALUE_TYPE.integer, 0);
            intBytes.writeInt32BE(header.value, 1);
            return intBytes;
        case 'long':
            var longBytes = allocBuffer(1);
            longBytes[0] = HEADER_VALUE_TYPE.long;
            return Buffer.concat([
                longBytes, header.value.bytes
            ], 9);
        case 'short':
            var shortBytes = allocBuffer(3);
            shortBytes.writeUInt8(HEADER_VALUE_TYPE.short, 0);
            shortBytes.writeInt16BE(header.value, 1);
            return shortBytes;
        case 'string':
            var utf8Bytes = toBuffer(header.value);
            var strBytes = allocBuffer(3);
            strBytes.writeUInt8(HEADER_VALUE_TYPE.string, 0);
            strBytes.writeUInt16BE(utf8Bytes.length, 1);
            return Buffer.concat([
                strBytes, utf8Bytes
            ], strBytes.length + utf8Bytes.length);
        case 'timestamp':
            var tsBytes = allocBuffer(1);
            tsBytes[0] = HEADER_VALUE_TYPE.timestamp;
            return Buffer.concat([
                tsBytes, Int64.fromNumber(header.value.valueOf()).bytes
            ], 9);
        case 'uuid':
            if (!UUID_PATTERN.test(header.value)) {
                throw new Error('Invalid UUID received: ' + header.value);
            }

            var uuidBytes = allocBuffer(1);
            uuidBytes[0] = HEADER_VALUE_TYPE.uuid;
            return Buffer.concat([
                uuidBytes, toBuffer(header.value.replace(/\-/g, ''), 'hex')
            ], 17);
    }
}

function crc32(buffer) {
    var crc32 = crypto.crc32(buffer);

    var crc32Buffer = allocBuffer(4);
    crc32Buffer.writeUInt32BE(crc32, 0);

    return crc32Buffer;
}

/**
 * @api private
 */
var HEADER_VALUE_TYPE = {
    boolTrue: 0,
    boolFalse: 1,
    byte: 2,
    short: 3,
    integer: 4,
    long: 5,
    byteArray: 6,
    string: 7,
    timestamp: 8,
    uuid: 9,
};

var UUID_PATTERN = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;

/**
 * @api private
 */
module.exports = {
    buildMessage: buildMessage
};
