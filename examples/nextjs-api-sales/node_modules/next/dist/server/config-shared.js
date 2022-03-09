"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.normalizeConfig = normalizeConfig;
exports.defaultConfig = void 0;
var _os = _interopRequireDefault(require("os"));
var _imageConfig = require("./image-config");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const defaultConfig = {
    env: {
    },
    webpack: null,
    webpackDevMiddleware: null,
    eslint: {
        ignoreDuringBuilds: false
    },
    typescript: {
        ignoreBuildErrors: false,
        tsconfigPath: 'tsconfig.json'
    },
    distDir: '.next',
    cleanDistDir: true,
    assetPrefix: '',
    configOrigin: 'default',
    useFileSystemPublicRoutes: true,
    generateBuildId: ()=>null
    ,
    generateEtags: true,
    pageExtensions: [
        'tsx',
        'ts',
        'jsx',
        'js'
    ],
    target: 'server',
    poweredByHeader: true,
    compress: true,
    analyticsId: process.env.VERCEL_ANALYTICS_ID || '',
    images: _imageConfig.imageConfigDefault,
    devIndicators: {
        buildActivity: true,
        buildActivityPosition: 'bottom-right'
    },
    onDemandEntries: {
        maxInactiveAge: 15 * 1000,
        pagesBufferLength: 2
    },
    amp: {
        canonicalBase: ''
    },
    basePath: '',
    sassOptions: {
    },
    trailingSlash: false,
    i18n: null,
    productionBrowserSourceMaps: false,
    optimizeFonts: true,
    webpack5: undefined,
    excludeDefaultMomentLocales: true,
    serverRuntimeConfig: {
    },
    publicRuntimeConfig: {
    },
    reactStrictMode: false,
    httpAgentOptions: {
        keepAlive: true
    },
    outputFileTracing: true,
    staticPageGenerationTimeout: 60,
    swcMinify: false,
    experimental: {
        cpus: Math.max(1, (Number(process.env.CIRCLE_NODE_TOTAL) || (_os.default.cpus() || {
            length: 1
        }).length) - 1),
        sharedPool: true,
        plugins: false,
        profiling: false,
        isrFlushToDisk: true,
        workerThreads: false,
        pageEnv: false,
        optimizeCss: false,
        scrollRestoration: false,
        externalDir: false,
        reactRoot: Number(process.env.NEXT_PRIVATE_REACT_ROOT) > 0,
        disableOptimizedLoading: false,
        gzipSize: true,
        swcFileReading: true,
        craCompat: false,
        esmExternals: true,
        // default to 50MB limit
        isrMemoryCacheSize: 50 * 1024 * 1024,
        serverComponents: false,
        fullySpecified: false,
        outputFileTracingRoot: process.env.NEXT_PRIVATE_OUTPUT_TRACE_ROOT || '',
        outputStandalone: !!process.env.NEXT_PRIVATE_STANDALONE
    }
};
exports.defaultConfig = defaultConfig;
async function normalizeConfig(phase, config) {
    if (typeof config === 'function') {
        config = config(phase, {
            defaultConfig
        });
    }
    // Support `new Promise` and `async () =>` as return values of the config export
    return await config;
}

//# sourceMappingURL=config-shared.js.map