var Buffer = require('buffer/').Buffer;

/**
 * This is a polyfill for the static method `isView` of `ArrayBuffer`, which is
 * e.g. missing in IE 10.
 *
 * @api private
 */
if (
    typeof ArrayBuffer !== 'undefined' &&
    typeof ArrayBuffer.isView === 'undefined'
) {
    ArrayBuffer.isView = function(arg) {
        return viewStrings.indexOf(Object.prototype.toString.call(arg)) > -1;
    };
}

/**
 * @api private
 */
var viewStrings = [
    '[object Int8Array]',
    '[object Uint8Array]',
    '[object Uint8ClampedArray]',
    '[object Int16Array]',
    '[object Uint16Array]',
    '[object Int32Array]',
    '[object Uint32Array]',
    '[object Float32Array]',
    '[object Float64Array]',
    '[object DataView]',
];

/**
 * @api private
 */
function isEmptyData(data) {
    if (typeof data === 'string') {
        return data.length === 0;
    }
    return data.byteLength === 0;
}

/**
 * @api private
 */
function convertToBuffer(data) {
    if (typeof data === 'string') {
        data = new Buffer(data, 'utf8');
    }

    if (ArrayBuffer.isView(data)) {
        return new Uint8Array(data.buffer, data.byteOffset, data.byteLength / Uint8Array.BYTES_PER_ELEMENT);
    }

    return new Uint8Array(data);
}

/**
 * @api private
 */
module.exports = exports = {
    isEmptyData: isEmptyData,
    convertToBuffer: convertToBuffer,
};
