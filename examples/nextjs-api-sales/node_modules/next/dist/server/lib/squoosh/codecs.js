"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.codecs = exports.preprocessors = void 0;
var _fs = require("fs");
var path = _interopRequireWildcard(require("path"));
var _emscriptenUtilsJs = require("./emscripten-utils.js");
var _mozjpegNodeEncJs = _interopRequireDefault(require("./mozjpeg/mozjpeg_node_enc.js"));
var _mozjpegNodeDecJs = _interopRequireDefault(require("./mozjpeg/mozjpeg_node_dec.js"));
var _webpNodeEncJs = _interopRequireDefault(require("./webp/webp_node_enc.js"));
var _webpNodeDecJs = _interopRequireDefault(require("./webp/webp_node_dec.js"));
var _avifNodeEncJs = _interopRequireDefault(require("./avif/avif_node_enc.js"));
var _avifNodeDecJs = _interopRequireDefault(require("./avif/avif_node_dec.js"));
var pngEncDec = _interopRequireWildcard(require("./png/squoosh_png.js"));
var oxipng = _interopRequireWildcard(require("./png/squoosh_oxipng.js"));
var resize = _interopRequireWildcard(require("./resize/squoosh_resize.js"));
var _imageData = _interopRequireDefault(require("./image_data"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {
        };
        if (obj != null) {
            for(var key in obj){
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {
                    };
                    if (desc.get || desc.set) {
                        Object.defineProperty(newObj, key, desc);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
        }
        newObj.default = obj;
        return newObj;
    }
}
const mozEncWasm = path.resolve(__dirname, './mozjpeg/mozjpeg_node_enc.wasm');
const mozDecWasm = path.resolve(__dirname, './mozjpeg/mozjpeg_node_dec.wasm');
const webpEncWasm = path.resolve(__dirname, './webp/webp_node_enc.wasm');
const webpDecWasm = path.resolve(__dirname, './webp/webp_node_dec.wasm');
const avifEncWasm = path.resolve(__dirname, './avif/avif_node_enc.wasm');
const avifDecWasm = path.resolve(__dirname, './avif/avif_node_dec.wasm');
const pngEncDecWasm = path.resolve(__dirname, './png/squoosh_png_bg.wasm');
const pngEncDecInit = ()=>pngEncDec.default(_fs.promises.readFile((0, _emscriptenUtilsJs).pathify(pngEncDecWasm)))
;
const oxipngWasm = path.resolve(__dirname, './png/squoosh_oxipng_bg.wasm');
const oxipngInit = ()=>oxipng.default(_fs.promises.readFile((0, _emscriptenUtilsJs).pathify(oxipngWasm)))
;
const resizeWasm = path.resolve(__dirname, './resize/squoosh_resize_bg.wasm');
const resizeInit = ()=>resize.default(_fs.promises.readFile((0, _emscriptenUtilsJs).pathify(resizeWasm)))
;
// rotate
const rotateWasm = path.resolve(__dirname, './rotate/rotate.wasm');
global.ImageData = _imageData.default;
function resizeNameToIndex(name) {
    switch(name){
        case 'triangle':
            return 0;
        case 'catrom':
            return 1;
        case 'mitchell':
            return 2;
        case 'lanczos3':
            return 3;
        default:
            throw Error(`Unknown resize algorithm "${name}"`);
    }
}
function resizeWithAspect({ input_width , input_height , target_width , target_height  }) {
    if (!target_width && !target_height) {
        throw Error('Need to specify at least width or height when resizing');
    }
    if (target_width && target_height) {
        return {
            width: target_width,
            height: target_height
        };
    }
    if (!target_width) {
        return {
            width: Math.round(input_width / input_height * target_height),
            height: target_height
        };
    }
    return {
        width: target_width,
        height: Math.round(input_height / input_width * target_width)
    };
}
const preprocessors = {
    resize: {
        name: 'Resize',
        description: 'Resize the image before compressing',
        instantiate: async ()=>{
            await resizeInit();
            return (buffer, input_width, input_height, { width , height , method , premultiply , linearRGB  })=>{
                ({ width , height  } = resizeWithAspect({
                    input_width,
                    input_height,
                    target_width: width,
                    target_height: height
                }));
                const imageData = new _imageData.default(resize.resize(buffer, input_width, input_height, width, height, resizeNameToIndex(method), premultiply, linearRGB), width, height);
                resize.cleanup();
                return imageData;
            };
        },
        defaultOptions: {
            method: 'lanczos3',
            fitMethod: 'stretch',
            premultiply: true,
            linearRGB: true
        }
    },
    rotate: {
        name: 'Rotate',
        description: 'Rotate image',
        instantiate: async ()=>{
            return async (buffer, width, height, { numRotations  })=>{
                const degrees = numRotations * 90 % 360;
                const sameDimensions = degrees === 0 || degrees === 180;
                const size = width * height * 4;
                const instance = (await WebAssembly.instantiate(await _fs.promises.readFile((0, _emscriptenUtilsJs).pathify(rotateWasm)))).instance;
                const { memory  } = instance.exports;
                const additionalPagesNeeded = Math.ceil((size * 2 - memory.buffer.byteLength + 8) / (64 * 1024));
                if (additionalPagesNeeded > 0) {
                    memory.grow(additionalPagesNeeded);
                }
                const view = new Uint8ClampedArray(memory.buffer);
                view.set(buffer, 8);
                instance.exports.rotate(width, height, degrees);
                return new _imageData.default(view.slice(size + 8, size * 2 + 8), sameDimensions ? width : height, sameDimensions ? height : width);
            };
        },
        defaultOptions: {
            numRotations: 0
        }
    }
};
exports.preprocessors = preprocessors;
const codecs = {
    mozjpeg: {
        name: 'MozJPEG',
        extension: 'jpg',
        detectors: [
            /^\xFF\xD8\xFF/
        ],
        dec: ()=>(0, _emscriptenUtilsJs).instantiateEmscriptenWasm(_mozjpegNodeDecJs.default, mozDecWasm)
        ,
        enc: ()=>(0, _emscriptenUtilsJs).instantiateEmscriptenWasm(_mozjpegNodeEncJs.default, mozEncWasm)
        ,
        defaultEncoderOptions: {
            quality: 75,
            baseline: false,
            arithmetic: false,
            progressive: true,
            optimize_coding: true,
            smoothing: 0,
            color_space: 3 /*YCbCr*/ ,
            quant_table: 3,
            trellis_multipass: false,
            trellis_opt_zero: false,
            trellis_opt_table: false,
            trellis_loops: 1,
            auto_subsample: true,
            chroma_subsample: 2,
            separate_chroma_quality: false,
            chroma_quality: 75
        },
        autoOptimize: {
            option: 'quality',
            min: 0,
            max: 100
        }
    },
    webp: {
        name: 'WebP',
        extension: 'webp',
        detectors: [
            /^RIFF....WEBPVP8[LX ]/s
        ],
        dec: ()=>(0, _emscriptenUtilsJs).instantiateEmscriptenWasm(_webpNodeDecJs.default, webpDecWasm)
        ,
        enc: ()=>(0, _emscriptenUtilsJs).instantiateEmscriptenWasm(_webpNodeEncJs.default, webpEncWasm)
        ,
        defaultEncoderOptions: {
            quality: 75,
            target_size: 0,
            target_PSNR: 0,
            method: 4,
            sns_strength: 50,
            filter_strength: 60,
            filter_sharpness: 0,
            filter_type: 1,
            partitions: 0,
            segments: 4,
            pass: 1,
            show_compressed: 0,
            preprocessing: 0,
            autofilter: 0,
            partition_limit: 0,
            alpha_compression: 1,
            alpha_filtering: 1,
            alpha_quality: 100,
            lossless: 0,
            exact: 0,
            image_hint: 0,
            emulate_jpeg_size: 0,
            thread_level: 0,
            low_memory: 0,
            near_lossless: 100,
            use_delta_palette: 0,
            use_sharp_yuv: 0
        },
        autoOptimize: {
            option: 'quality',
            min: 0,
            max: 100
        }
    },
    avif: {
        name: 'AVIF',
        extension: 'avif',
        // eslint-disable-next-line no-control-regex
        detectors: [
            /^\x00\x00\x00 ftypavif\x00\x00\x00\x00/
        ],
        dec: ()=>(0, _emscriptenUtilsJs).instantiateEmscriptenWasm(_avifNodeDecJs.default, avifDecWasm)
        ,
        enc: async ()=>{
            return (0, _emscriptenUtilsJs).instantiateEmscriptenWasm(_avifNodeEncJs.default, avifEncWasm);
        },
        defaultEncoderOptions: {
            cqLevel: 33,
            cqAlphaLevel: -1,
            denoiseLevel: 0,
            tileColsLog2: 0,
            tileRowsLog2: 0,
            speed: 6,
            subsample: 1,
            chromaDeltaQ: false,
            sharpness: 0,
            tune: 0 /* AVIFTune.auto */ 
        },
        autoOptimize: {
            option: 'cqLevel',
            min: 62,
            max: 0
        }
    },
    oxipng: {
        name: 'OxiPNG',
        extension: 'png',
        // eslint-disable-next-line no-control-regex
        detectors: [
            /^\x89PNG\x0D\x0A\x1A\x0A/
        ],
        dec: async ()=>{
            await pngEncDecInit();
            return {
                decode: (buffer)=>{
                    const imageData = pngEncDec.decode(buffer);
                    pngEncDec.cleanup();
                    return imageData;
                }
            };
        },
        enc: async ()=>{
            await pngEncDecInit();
            await oxipngInit();
            return {
                encode: (buffer, width, height, opts)=>{
                    const simplePng = pngEncDec.encode(new Uint8Array(buffer), width, height);
                    const imageData = oxipng.optimise(simplePng, opts.level, false);
                    oxipng.cleanup();
                    return imageData;
                }
            };
        },
        defaultEncoderOptions: {
            level: 2
        },
        autoOptimize: {
            option: 'level',
            min: 6,
            max: 1
        }
    }
};
exports.codecs = codecs;

//# sourceMappingURL=codecs.js.map