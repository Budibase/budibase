"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.decodeBuffer = decodeBuffer;
exports.rotate = rotate;
exports.resize = resize;
exports.encodeJpeg = encodeJpeg;
exports.encodeWebp = encodeWebp;
exports.encodeAvif = encodeAvif;
exports.encodePng = encodePng;
var _semver = _interopRequireDefault(require("next/dist/compiled/semver"));
var _codecs = require("./codecs");
var _imageData = _interopRequireDefault(require("./image_data"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
// Fixed in Node.js 16.5.0 and newer.
// See https://github.com/nodejs/node/pull/39337
// Eventually, remove this delay when engines is updated.
// See https://git.io/JCTr0
const FIXED_VERSION = '16.5.0';
const DELAY_MS = 1000;
let _promise;
function delayOnce(ms) {
    if (!_promise) {
        _promise = new Promise((resolve)=>{
            setTimeout(resolve, ms);
        });
    }
    return _promise;
}
function maybeDelay() {
    const isAppleM1 = process.arch === 'arm64' && process.platform === 'darwin';
    if (isAppleM1 && _semver.default.lt(process.version, FIXED_VERSION)) {
        return delayOnce(DELAY_MS);
    }
    return Promise.resolve();
}
async function decodeBuffer(_buffer) {
    var ref;
    const buffer = Buffer.from(_buffer);
    const firstChunk = buffer.slice(0, 16);
    const firstChunkString = Array.from(firstChunk).map((v)=>String.fromCodePoint(v)
    ).join('');
    const key = (ref = Object.entries(_codecs.codecs).find(([, { detectors  }])=>detectors.some((detector)=>detector.exec(firstChunkString)
        )
    )) === null || ref === void 0 ? void 0 : ref[0];
    if (!key) {
        throw Error(`Buffer has an unsupported format`);
    }
    const encoder = _codecs.codecs[key];
    const mod = await encoder.dec();
    const rgba = mod.decode(new Uint8Array(buffer));
    return rgba;
}
async function rotate(image, numRotations) {
    image = _imageData.default.from(image);
    const m = await _codecs.preprocessors['rotate'].instantiate();
    return await m(image.data, image.width, image.height, {
        numRotations
    });
}
async function resize({ image , width , height  }) {
    image = _imageData.default.from(image);
    const p = _codecs.preprocessors['resize'];
    const m = await p.instantiate();
    await maybeDelay();
    return await m(image.data, image.width, image.height, {
        ...p.defaultOptions,
        width,
        height
    });
}
async function encodeJpeg(image, { quality  }) {
    image = _imageData.default.from(image);
    const e = _codecs.codecs['mozjpeg'];
    const m = await e.enc();
    await maybeDelay();
    const r = await m.encode(image.data, image.width, image.height, {
        ...e.defaultEncoderOptions,
        quality
    });
    return Buffer.from(r);
}
async function encodeWebp(image, { quality  }) {
    image = _imageData.default.from(image);
    const e = _codecs.codecs['webp'];
    const m = await e.enc();
    await maybeDelay();
    const r = await m.encode(image.data, image.width, image.height, {
        ...e.defaultEncoderOptions,
        quality
    });
    return Buffer.from(r);
}
async function encodeAvif(image, { quality  }) {
    image = _imageData.default.from(image);
    const e = _codecs.codecs['avif'];
    const m = await e.enc();
    await maybeDelay();
    const val = e.autoOptimize.min || 62;
    const r = await m.encode(image.data, image.width, image.height, {
        ...e.defaultEncoderOptions,
        // Think of cqLevel as the "amount" of quantization (0 to 62),
        // so a lower value yields higher quality (0 to 100).
        cqLevel: Math.round(val - quality / 100 * val)
    });
    return Buffer.from(r);
}
async function encodePng(image) {
    image = _imageData.default.from(image);
    const e = _codecs.codecs['oxipng'];
    const m = await e.enc();
    await maybeDelay();
    const r = await m.encode(image.data, image.width, image.height, {
        ...e.defaultEncoderOptions
    });
    return Buffer.from(r);
}

//# sourceMappingURL=impl.js.map