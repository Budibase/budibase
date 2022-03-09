"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.streamToIterator = streamToIterator;
exports.readableStreamTee = readableStreamTee;
exports.notImplemented = notImplemented;
exports.fromNodeHeaders = fromNodeHeaders;
exports.toNodeHeaders = toNodeHeaders;
exports.splitCookiesString = splitCookiesString;
exports.validateURL = validateURL;
async function* streamToIterator(readable) {
    const reader = readable.getReader();
    while(true){
        const { value , done  } = await reader.read();
        if (done) break;
        if (value) {
            yield value;
        }
    }
    reader.releaseLock();
}
function readableStreamTee(readable) {
    const transformStream = new TransformStream();
    const transformStream2 = new TransformStream();
    const writer = transformStream.writable.getWriter();
    const writer2 = transformStream2.writable.getWriter();
    const reader = readable.getReader();
    function read() {
        reader.read().then(({ done , value  })=>{
            if (done) {
                writer.close();
                writer2.close();
                return;
            }
            writer.write(value);
            writer2.write(value);
            read();
        });
    }
    read();
    return [
        transformStream.readable,
        transformStream2.readable
    ];
}
function notImplemented(name, method) {
    throw new Error(`Failed to get the '${method}' property on '${name}': the property is not implemented`);
}
function fromNodeHeaders(object) {
    const headers = new Headers();
    for (let [key, value] of Object.entries(object)){
        const values = Array.isArray(value) ? value : [
            value
        ];
        for (let v of values){
            if (v !== undefined) {
                headers.append(key, v);
            }
        }
    }
    return headers;
}
function toNodeHeaders(headers) {
    const result = {
    };
    if (headers) {
        for (const [key, value] of headers.entries()){
            result[key] = value;
            if (key.toLowerCase() === 'set-cookie') {
                result[key] = splitCookiesString(value);
            }
        }
    }
    return result;
}
function splitCookiesString(cookiesString) {
    var cookiesStrings = [];
    var pos = 0;
    var start;
    var ch;
    var lastComma;
    var nextStart;
    var cookiesSeparatorFound;
    function skipWhitespace() {
        while(pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))){
            pos += 1;
        }
        return pos < cookiesString.length;
    }
    function notSpecialChar() {
        ch = cookiesString.charAt(pos);
        return ch !== '=' && ch !== ';' && ch !== ',';
    }
    while(pos < cookiesString.length){
        start = pos;
        cookiesSeparatorFound = false;
        while(skipWhitespace()){
            ch = cookiesString.charAt(pos);
            if (ch === ',') {
                // ',' is a cookie separator if we have later first '=', not ';' or ','
                lastComma = pos;
                pos += 1;
                skipWhitespace();
                nextStart = pos;
                while(pos < cookiesString.length && notSpecialChar()){
                    pos += 1;
                }
                // currently special character
                if (pos < cookiesString.length && cookiesString.charAt(pos) === '=') {
                    // we found cookies separator
                    cookiesSeparatorFound = true;
                    // pos is inside the next cookie, so back up and return it.
                    pos = nextStart;
                    cookiesStrings.push(cookiesString.substring(start, lastComma));
                    start = pos;
                } else {
                    // in param ',' or param separator ';',
                    // we continue from that comma
                    pos = lastComma + 1;
                }
            } else {
                pos += 1;
            }
        }
        if (!cookiesSeparatorFound || pos >= cookiesString.length) {
            cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
        }
    }
    return cookiesStrings;
}
function validateURL(url) {
    try {
        return String(new URL(String(url)));
    } catch (error) {
        throw new Error(`URLs is malformed. Please use only absolute URLs - https://nextjs.org/docs/messages/middleware-relative-urls`, // @ts-expect-error This will work for people who enable the error causes polyfill
        {
            cause: error
        });
    }
}

//# sourceMappingURL=utils.js.map