"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = exports.raw = void 0;
var _loaderUtils3 = _interopRequireDefault(require("next/dist/compiled/loader-utils3"));
var _imageOptimizer = require("../../../server/image-optimizer");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const BLUR_IMG_SIZE = 8;
const BLUR_QUALITY = 70;
const VALID_BLUR_EXT = [
    'jpeg',
    'png',
    'webp',
    'avif'
] // should match next/client/image.tsx
;
function nextImageLoader(content) {
    const imageLoaderSpan = this.currentTraceSpan.traceChild('next-image-loader');
    return imageLoaderSpan.traceAsyncFn(async ()=>{
        const { isServer , isDev , assetPrefix , basePath  } = this.getOptions();
        const context = this.rootContext;
        const opts = {
            context,
            content
        };
        const interpolatedName = _loaderUtils3.default.interpolateName(this, '/static/media/[name].[hash:8].[ext]', opts);
        const outputPath = assetPrefix + '/_next' + interpolatedName;
        let extension = _loaderUtils3.default.interpolateName(this, '[ext]', opts);
        if (extension === 'jpg') {
            extension = 'jpeg';
        }
        const imageSizeSpan = imageLoaderSpan.traceChild('image-size-calculation');
        const imageSize = await imageSizeSpan.traceAsyncFn(()=>(0, _imageOptimizer).getImageSize(content, extension)
        );
        let blurDataURL;
        if (VALID_BLUR_EXT.includes(extension)) {
            if (isDev) {
                const prefix = 'http://localhost';
                const url = new URL(`${basePath || ''}/_next/image`, prefix);
                url.searchParams.set('url', outputPath);
                url.searchParams.set('w', BLUR_IMG_SIZE);
                url.searchParams.set('q', BLUR_QUALITY);
                blurDataURL = url.href.slice(prefix.length);
            } else {
                // Shrink the image's largest dimension
                const dimension = imageSize.width >= imageSize.height ? 'width' : 'height';
                const resizeImageSpan = imageLoaderSpan.traceChild('image-resize');
                const resizedImage = await resizeImageSpan.traceAsyncFn(()=>(0, _imageOptimizer).resizeImage(content, dimension, BLUR_IMG_SIZE, extension, BLUR_QUALITY)
                );
                const blurDataURLSpan = imageLoaderSpan.traceChild('image-base64-tostring');
                blurDataURL = blurDataURLSpan.traceFn(()=>`data:image/${extension};base64,${resizedImage.toString('base64')}`
                );
            }
        }
        const stringifiedData = imageLoaderSpan.traceChild('image-data-stringify').traceFn(()=>JSON.stringify({
                src: outputPath,
                height: imageSize.height,
                width: imageSize.width,
                blurDataURL
            })
        );
        if (!isServer) {
            this.emitFile(interpolatedName, content, null);
        }
        return `export default ${stringifiedData};`;
    });
}
const raw = true;
exports.raw = raw;
var _default = nextImageLoader;
exports.default = _default;

//# sourceMappingURL=next-image-loader.js.map