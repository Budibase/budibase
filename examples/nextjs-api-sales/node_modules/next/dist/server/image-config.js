"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.imageConfigDefault = exports.VALID_LOADERS = void 0;
const VALID_LOADERS = [
    'default',
    'imgix',
    'cloudinary',
    'akamai',
    'custom', 
];
exports.VALID_LOADERS = VALID_LOADERS;
const imageConfigDefault = {
    deviceSizes: [
        640,
        750,
        828,
        1080,
        1200,
        1920,
        2048,
        3840
    ],
    imageSizes: [
        16,
        32,
        48,
        64,
        96,
        128,
        256,
        384
    ],
    path: '/_next/image',
    loader: 'default',
    domains: [],
    disableStaticImages: false,
    minimumCacheTTL: 60,
    formats: [
        'image/webp'
    ],
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: `script-src 'none'; frame-src 'none'; sandbox;`
};
exports.imageConfigDefault = imageConfigDefault;

//# sourceMappingURL=image-config.js.map