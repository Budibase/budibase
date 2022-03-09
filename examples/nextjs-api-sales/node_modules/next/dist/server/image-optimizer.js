"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.imageOptimizer = imageOptimizer;
exports.sendResponse = sendResponse;
exports.getHash = getHash;
exports.detectContentType = detectContentType;
exports.getMaxAge = getMaxAge;
exports.resizeImage = resizeImage;
exports.getImageSize = getImageSize;
var _accept = require("next/dist/compiled/@hapi/accept");
var _crypto = require("crypto");
var _fs = require("fs");
var _getOrientation = require("next/dist/compiled/get-orientation");
var _imageSize = _interopRequireDefault(require("next/dist/compiled/image-size"));
var _isAnimated = _interopRequireDefault(require("next/dist/compiled/is-animated"));
var _contentDisposition = _interopRequireDefault(require("next/dist/compiled/content-disposition"));
var _path = require("path");
var _stream = _interopRequireDefault(require("stream"));
var _url = _interopRequireDefault(require("url"));
var _main = require("./lib/squoosh/main");
var _sendPayload = require("./send-payload");
var _serveStatic = require("./serve-static");
var _chalk = _interopRequireDefault(require("next/dist/compiled/chalk"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const AVIF = 'image/avif';
const WEBP = 'image/webp';
const PNG = 'image/png';
const JPEG = 'image/jpeg';
const GIF = 'image/gif';
const SVG = 'image/svg+xml';
const CACHE_VERSION = 3;
const ANIMATABLE_TYPES = [
    WEBP,
    PNG,
    GIF
];
const VECTOR_TYPES = [
    SVG
];
const BLUR_IMG_SIZE = 8 // should match `next-image-loader`
;
let sharp;
try {
    sharp = require(process.env.NEXT_SHARP_PATH || 'sharp');
} catch (e) {
// Sharp not present on the server, Squoosh fallback will be used
}
let showSharpMissingWarning = process.env.NODE_ENV === 'production';
class ImageOptimizerCache {
    static validateParams(req, query, nextConfig, isDev) {
        const imageData = nextConfig.images;
        const { deviceSizes =[] , imageSizes =[] , domains =[] , minimumCacheTTL =60 , formats =[
            'image/webp'
        ] ,  } = imageData;
        const { url , w , q  } = query;
        let href;
        if (!url) {
            return {
                errorMessage: '"url" parameter is required'
            };
        } else if (Array.isArray(url)) {
            return {
                errorMessage: '"url" parameter cannot be an array'
            };
        }
        let isAbsolute;
        if (url.startsWith('/')) {
            href = url;
            isAbsolute = false;
        } else {
            let hrefParsed;
            try {
                hrefParsed = new URL(url);
                href = hrefParsed.toString();
                isAbsolute = true;
            } catch (_error) {
                return {
                    errorMessage: '"url" parameter is invalid'
                };
            }
            if (![
                'http:',
                'https:'
            ].includes(hrefParsed.protocol)) {
                return {
                    errorMessage: '"url" parameter is invalid'
                };
            }
            if (!domains || !domains.includes(hrefParsed.hostname)) {
                return {
                    errorMessage: '"url" parameter is not allowed'
                };
            }
        }
        if (!w) {
            return {
                errorMessage: '"w" parameter (width) is required'
            };
        } else if (Array.isArray(w)) {
            return {
                errorMessage: '"w" parameter (width) cannot be an array'
            };
        }
        if (!q) {
            return {
                errorMessage: '"q" parameter (quality) is required'
            };
        } else if (Array.isArray(q)) {
            return {
                errorMessage: '"q" parameter (quality) cannot be an array'
            };
        }
        const width = parseInt(w, 10);
        if (!width || isNaN(width)) {
            return {
                errorMessage: '"w" parameter (width) must be a number greater than 0'
            };
        }
        const sizes = [
            ...deviceSizes || [],
            ...imageSizes || []
        ];
        if (isDev) {
            sizes.push(BLUR_IMG_SIZE);
        }
        if (!sizes.includes(width)) {
            return {
                errorMessage: `"w" parameter (width) of ${width} is not allowed`
            };
        }
        const quality = parseInt(q);
        if (isNaN(quality) || quality < 1 || quality > 100) {
            return {
                errorMessage: '"q" parameter (quality) must be a number between 1 and 100'
            };
        }
        const mimeType = getSupportedMimeType(formats || [], req.headers['accept']);
        const isStatic = url.startsWith(`${nextConfig.basePath || ''}/_next/static/media`);
        return {
            href,
            sizes,
            isAbsolute,
            isStatic,
            width,
            quality,
            mimeType,
            minimumCacheTTL
        };
    }
    static getCacheKey({ href , width , quality , mimeType  }) {
        return getHash([
            CACHE_VERSION,
            href,
            width,
            quality,
            mimeType
        ]);
    }
    constructor({ distDir , nextConfig  }){
        this.cacheDir = (0, _path).join(distDir, 'cache', 'images');
        this.nextConfig = nextConfig;
    }
    async get(cacheKey) {
        try {
            const cacheDir = (0, _path).join(this.cacheDir, cacheKey);
            const files = await _fs.promises.readdir(cacheDir);
            const now = Date.now();
            for (const file of files){
                const [maxAgeSt, expireAtSt, etag, extension] = file.split('.');
                const buffer = await _fs.promises.readFile((0, _path).join(cacheDir, file));
                const expireAt = Number(expireAtSt);
                const maxAge = Number(maxAgeSt);
                return {
                    value: {
                        kind: 'IMAGE',
                        etag,
                        buffer,
                        extension
                    },
                    revalidateAfter: Math.max(maxAge, this.nextConfig.images.minimumCacheTTL) * 1000 + Date.now(),
                    curRevalidate: maxAge,
                    isStale: now > expireAt
                };
            }
        } catch (_) {
        // failed to read from cache dir, treat as cache miss
        }
        return null;
    }
    async set(cacheKey, value, revalidate) {
        if ((value === null || value === void 0 ? void 0 : value.kind) !== 'IMAGE') {
            throw new Error('invariant attempted to set non-image to image-cache');
        }
        if (typeof revalidate !== 'number') {
            throw new Error('invariant revalidate must be a number for image-cache');
        }
        const expireAt = Math.max(revalidate, this.nextConfig.images.minimumCacheTTL) * 1000 + Date.now();
        try {
            await writeToCacheDir((0, _path).join(this.cacheDir, cacheKey), value.extension, revalidate, expireAt, value.buffer, value.etag);
        } catch (err) {
            console.error(`Failed to write image to cache ${cacheKey}`, err);
        }
    }
}
exports.ImageOptimizerCache = ImageOptimizerCache;
class ImageError extends Error {
    constructor(statusCode, message){
        super(message);
        this.statusCode = statusCode;
    }
}
exports.ImageError = ImageError;
async function imageOptimizer(_req, _res, paramsResult, nextConfig, handleRequest) {
    let upstreamBuffer;
    let upstreamType;
    let maxAge;
    const { isAbsolute , href , width , mimeType , quality  } = paramsResult;
    if (isAbsolute) {
        const upstreamRes = await fetch(href);
        if (!upstreamRes.ok) {
            console.error('upstream image response failed for', href, upstreamRes.status);
            throw new ImageError(upstreamRes.status, '"url" parameter is valid but upstream response is invalid');
        }
        upstreamBuffer = Buffer.from(await upstreamRes.arrayBuffer());
        upstreamType = detectContentType(upstreamBuffer) || upstreamRes.headers.get('Content-Type');
        maxAge = getMaxAge(upstreamRes.headers.get('Cache-Control'));
    } else {
        try {
            const resBuffers = [];
            const mockRes = new _stream.default.Writable();
            const isStreamFinished = new Promise(function(resolve, reject) {
                mockRes.on('finish', ()=>resolve(true)
                );
                mockRes.on('end', ()=>resolve(true)
                );
                mockRes.on('error', (err)=>reject(err)
                );
            });
            mockRes.write = (chunk)=>{
                resBuffers.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
            };
            mockRes._write = (chunk, _encoding, callback)=>{
                mockRes.write(chunk);
                // According to Node.js documentation, the callback MUST be invoked to signal that
                // the write completed successfully. If this callback is not invoked, the 'finish' event
                // will not be emitted.
                // https://nodejs.org/docs/latest-v16.x/api/stream.html#writable_writechunk-encoding-callback
                callback();
            };
            const mockHeaders = {
            };
            mockRes.writeHead = (_status, _headers)=>Object.assign(mockHeaders, _headers)
            ;
            mockRes.getHeader = (name)=>mockHeaders[name.toLowerCase()]
            ;
            mockRes.getHeaders = ()=>mockHeaders
            ;
            mockRes.getHeaderNames = ()=>Object.keys(mockHeaders)
            ;
            mockRes.setHeader = (name, value)=>mockHeaders[name.toLowerCase()] = value
            ;
            mockRes.removeHeader = (name)=>{
                delete mockHeaders[name.toLowerCase()];
            };
            mockRes._implicitHeader = ()=>{
            };
            mockRes.connection = _res.connection;
            mockRes.finished = false;
            mockRes.statusCode = 200;
            const mockReq = new _stream.default.Readable();
            mockReq._read = ()=>{
                mockReq.emit('end');
                mockReq.emit('close');
                return Buffer.from('');
            };
            mockReq.headers = _req.headers;
            mockReq.method = _req.method;
            mockReq.url = href;
            mockReq.connection = _req.connection;
            await handleRequest(mockReq, mockRes, _url.default.parse(href, true));
            await isStreamFinished;
            if (!mockRes.statusCode) {
                console.error('image response failed for', href, mockRes.statusCode);
                throw new ImageError(mockRes.statusCode, '"url" parameter is valid but internal response is invalid');
            }
            upstreamBuffer = Buffer.concat(resBuffers);
            upstreamType = detectContentType(upstreamBuffer) || mockRes.getHeader('Content-Type');
            maxAge = getMaxAge(mockRes.getHeader('Cache-Control'));
        } catch (err) {
            console.error('upstream image response failed for', href, err);
            throw new ImageError(500, '"url" parameter is valid but upstream response is invalid');
        }
    }
    if (upstreamType === SVG && !nextConfig.images.dangerouslyAllowSVG) {
        console.error(`The requested resource "${href}" has type "${upstreamType}" but dangerouslyAllowSVG is disabled`);
        throw new ImageError(400, '"url" parameter is valid but image type is not allowed');
    }
    if (upstreamType) {
        const vector = VECTOR_TYPES.includes(upstreamType);
        const animate = ANIMATABLE_TYPES.includes(upstreamType) && (0, _isAnimated).default(upstreamBuffer);
        if (vector || animate) {
            return {
                buffer: upstreamBuffer,
                contentType: upstreamType,
                maxAge
            };
        }
        if (!upstreamType.startsWith('image/')) {
            console.error("The requested resource isn't a valid image for", href, 'received', upstreamType);
            throw new ImageError(400, "The requested resource isn't a valid image.");
        }
    }
    let contentType;
    if (mimeType) {
        contentType = mimeType;
    } else if ((upstreamType === null || upstreamType === void 0 ? void 0 : upstreamType.startsWith('image/')) && (0, _serveStatic).getExtension(upstreamType)) {
        contentType = upstreamType;
    } else {
        contentType = JPEG;
    }
    try {
        let optimizedBuffer;
        if (sharp) {
            // Begin sharp transformation logic
            const transformer = sharp(upstreamBuffer);
            transformer.rotate();
            const { width: metaWidth  } = await transformer.metadata();
            if (metaWidth && metaWidth > width) {
                transformer.resize(width);
            }
            if (contentType === AVIF) {
                if (transformer.avif) {
                    const avifQuality = quality - 15;
                    transformer.avif({
                        quality: Math.max(avifQuality, 0),
                        chromaSubsampling: '4:2:0'
                    });
                } else {
                    console.warn(_chalk.default.yellow.bold('Warning: ') + `Your installed version of the 'sharp' package does not support AVIF images. Run 'yarn add sharp@latest' to upgrade to the latest version.\n` + 'Read more: https://nextjs.org/docs/messages/sharp-version-avif');
                    transformer.webp({
                        quality
                    });
                }
            } else if (contentType === WEBP) {
                transformer.webp({
                    quality
                });
            } else if (contentType === PNG) {
                transformer.png({
                    quality
                });
            } else if (contentType === JPEG) {
                transformer.jpeg({
                    quality
                });
            }
            optimizedBuffer = await transformer.toBuffer();
        // End sharp transformation logic
        } else {
            var ref;
            if (showSharpMissingWarning && ((ref = nextConfig.experimental) === null || ref === void 0 ? void 0 : ref.outputStandalone)) {
                // TODO: should we ensure squoosh also works even though we don't
                // recommend it be used in production and this is a production feature
                console.error(`Error: 'sharp' is required to be installed in standalone mode for the image optimization to function correctly`);
                throw new ImageError(500, 'internal server error');
            }
            // Show sharp warning in production once
            if (showSharpMissingWarning) {
                console.warn(_chalk.default.yellow.bold('Warning: ') + `For production Image Optimization with Next.js, the optional 'sharp' package is strongly recommended. Run 'yarn add sharp', and Next.js will use it automatically for Image Optimization.\n` + 'Read more: https://nextjs.org/docs/messages/sharp-missing-in-production');
                showSharpMissingWarning = false;
            }
            // Begin Squoosh transformation logic
            const orientation = await (0, _getOrientation).getOrientation(upstreamBuffer);
            const operations = [];
            if (orientation === _getOrientation.Orientation.RIGHT_TOP) {
                operations.push({
                    type: 'rotate',
                    numRotations: 1
                });
            } else if (orientation === _getOrientation.Orientation.BOTTOM_RIGHT) {
                operations.push({
                    type: 'rotate',
                    numRotations: 2
                });
            } else if (orientation === _getOrientation.Orientation.LEFT_BOTTOM) {
                operations.push({
                    type: 'rotate',
                    numRotations: 3
                });
            } else {
            // TODO: support more orientations
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            // const _: never = orientation
            }
            operations.push({
                type: 'resize',
                width
            });
            if (contentType === AVIF) {
                optimizedBuffer = await (0, _main).processBuffer(upstreamBuffer, operations, 'avif', quality);
            } else if (contentType === WEBP) {
                optimizedBuffer = await (0, _main).processBuffer(upstreamBuffer, operations, 'webp', quality);
            } else if (contentType === PNG) {
                optimizedBuffer = await (0, _main).processBuffer(upstreamBuffer, operations, 'png', quality);
            } else if (contentType === JPEG) {
                optimizedBuffer = await (0, _main).processBuffer(upstreamBuffer, operations, 'jpeg', quality);
            }
        // End Squoosh transformation logic
        }
        if (optimizedBuffer) {
            return {
                buffer: optimizedBuffer,
                contentType,
                maxAge: Math.max(maxAge, nextConfig.images.minimumCacheTTL)
            };
        } else {
            throw new ImageError(500, 'Unable to optimize buffer');
        }
    } catch (error) {
        return {
            buffer: upstreamBuffer,
            contentType: upstreamType,
            maxAge
        };
    }
}
async function writeToCacheDir(dir, extension, maxAge, expireAt, buffer, etag) {
    const filename = (0, _path).join(dir, `${maxAge}.${expireAt}.${etag}.${extension}`);
    // Added in: v14.14.0 https://nodejs.org/api/fs.html#fspromisesrmpath-options
    // attempt cleaning up existing stale cache
    if (_fs.promises.rm) {
        await _fs.promises.rm(dir, {
            force: true,
            recursive: true
        }).catch(()=>{
        });
    } else {
        await _fs.promises.rmdir(dir, {
            recursive: true
        }).catch(()=>{
        });
    }
    await _fs.promises.mkdir(dir, {
        recursive: true
    });
    await _fs.promises.writeFile(filename, buffer);
}
function getFileNameWithExtension(url, contentType) {
    const [urlWithoutQueryParams] = url.split('?');
    const fileNameWithExtension = urlWithoutQueryParams.split('/').pop();
    if (!contentType || !fileNameWithExtension) {
        return;
    }
    const [fileName] = fileNameWithExtension.split('.');
    const extension = (0, _serveStatic).getExtension(contentType);
    return `${fileName}.${extension}`;
}
function setResponseHeaders(req, res, url, etag, contentType, isStatic, xCache, contentSecurityPolicy) {
    res.setHeader('Vary', 'Accept');
    res.setHeader('Cache-Control', isStatic ? 'public, max-age=315360000, immutable' : `public, max-age=0, must-revalidate`);
    if ((0, _sendPayload).sendEtagResponse(req, res, etag)) {
        // already called res.end() so we're finished
        return {
            finished: true
        };
    }
    if (contentType) {
        res.setHeader('Content-Type', contentType);
    }
    const fileName = getFileNameWithExtension(url, contentType);
    if (fileName) {
        res.setHeader('Content-Disposition', (0, _contentDisposition).default(fileName, {
            type: 'inline'
        }));
    }
    if (contentSecurityPolicy) {
        res.setHeader('Content-Security-Policy', contentSecurityPolicy);
    }
    res.setHeader('X-Nextjs-Cache', xCache);
    return {
        finished: false
    };
}
function sendResponse(req, res, url, extension, buffer, isStatic, xCache, contentSecurityPolicy) {
    const contentType = (0, _serveStatic).getContentType(extension);
    const etag = getHash([
        buffer
    ]);
    const result = setResponseHeaders(req, res, url, etag, contentType, isStatic, xCache, contentSecurityPolicy);
    if (!result.finished) {
        res.end(buffer);
    }
}
function getSupportedMimeType(options, accept = '') {
    const mimeType = (0, _accept).mediaType(accept, options);
    return accept.includes(mimeType) ? mimeType : '';
}
function getHash(items) {
    const hash = (0, _crypto).createHash('sha256');
    for (let item of items){
        if (typeof item === 'number') hash.update(String(item));
        else {
            hash.update(item);
        }
    }
    // See https://en.wikipedia.org/wiki/Base64#Filenames
    return hash.digest('base64').replace(/\//g, '-');
}
function parseCacheControl(str) {
    const map = new Map();
    if (!str) {
        return map;
    }
    for (let directive of str.split(',')){
        let [key, value] = directive.trim().split('=');
        key = key.toLowerCase();
        if (value) {
            value = value.toLowerCase();
        }
        map.set(key, value);
    }
    return map;
}
function detectContentType(buffer) {
    if ([
        255,
        216,
        255
    ].every((b, i)=>buffer[i] === b
    )) {
        return JPEG;
    }
    if ([
        137,
        80,
        78,
        71,
        13,
        10,
        26,
        10
    ].every((b, i)=>buffer[i] === b
    )) {
        return PNG;
    }
    if ([
        71,
        73,
        70,
        56
    ].every((b, i)=>buffer[i] === b
    )) {
        return GIF;
    }
    if ([
        82,
        73,
        70,
        70,
        0,
        0,
        0,
        0,
        87,
        69,
        66,
        80
    ].every((b, i)=>!b || buffer[i] === b
    )) {
        return WEBP;
    }
    if ([
        60,
        63,
        120,
        109,
        108
    ].every((b, i)=>buffer[i] === b
    )) {
        return SVG;
    }
    if ([
        0,
        0,
        0,
        0,
        102,
        116,
        121,
        112,
        97,
        118,
        105,
        102
    ].every((b, i)=>!b || buffer[i] === b
    )) {
        return AVIF;
    }
    return null;
}
function getMaxAge(str) {
    const map = parseCacheControl(str);
    if (map) {
        let age = map.get('s-maxage') || map.get('max-age') || '';
        if (age.startsWith('"') && age.endsWith('"')) {
            age = age.slice(1, -1);
        }
        const n = parseInt(age, 10);
        if (!isNaN(n)) {
            return n;
        }
    }
    return 0;
}
async function resizeImage(content, dimension, size, // Should match VALID_BLUR_EXT
extension, quality) {
    if (sharp) {
        const transformer = sharp(content);
        if (extension === 'avif') {
            if (transformer.avif) {
                transformer.avif({
                    quality
                });
            } else {
                console.warn(_chalk.default.yellow.bold('Warning: ') + `Your installed version of the 'sharp' package does not support AVIF images. Run 'yarn add sharp@latest' to upgrade to the latest version.\n` + 'Read more: https://nextjs.org/docs/messages/sharp-version-avif');
                transformer.webp({
                    quality
                });
            }
        } else if (extension === 'webp') {
            transformer.webp({
                quality
            });
        } else if (extension === 'png') {
            transformer.png({
                quality
            });
        } else if (extension === 'jpeg') {
            transformer.jpeg({
                quality
            });
        }
        if (dimension === 'width') {
            transformer.resize(size);
        } else {
            transformer.resize(null, size);
        }
        const buf = await transformer.toBuffer();
        return buf;
    } else {
        const resizeOperationOpts = dimension === 'width' ? {
            type: 'resize',
            width: size
        } : {
            type: 'resize',
            height: size
        };
        const buf = await (0, _main).processBuffer(content, [
            resizeOperationOpts
        ], extension, quality);
        return buf;
    }
}
async function getImageSize(buffer, // Should match VALID_BLUR_EXT
extension) {
    // TODO: upgrade "image-size" package to support AVIF
    // See https://github.com/image-size/image-size/issues/348
    if (extension === 'avif') {
        if (sharp) {
            const transformer = sharp(buffer);
            const { width , height  } = await transformer.metadata();
            return {
                width,
                height
            };
        } else {
            const { width , height  } = await (0, _main).decodeBuffer(buffer);
            return {
                width,
                height
            };
        }
    }
    const { width , height  } = (0, _imageSize).default(buffer);
    return {
        width,
        height
    };
}
class Deferred {
    constructor(){
        this.promise = new Promise((resolve, reject)=>{
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}
exports.Deferred = Deferred;

//# sourceMappingURL=image-optimizer.js.map