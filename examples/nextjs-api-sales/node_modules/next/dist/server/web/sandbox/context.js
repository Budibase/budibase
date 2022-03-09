"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.clearModuleContext = clearModuleContext;
exports.getModuleContext = getModuleContext;
var _formdataNode = require("next/dist/compiled/formdata-node");
var _fs = require("fs");
var _require = require("./require");
var _webStreamsPolyfill = require("next/dist/compiled/web-streams-polyfill");
var _cookie = _interopRequireDefault(require("next/dist/compiled/cookie"));
var polyfills = _interopRequireWildcard(require("./polyfills"));
var _abortController = require("next/dist/compiled/abort-controller");
var _vm = _interopRequireDefault(require("vm"));
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
const WEBPACK_HASH_REGEX = /__webpack_require__\.h = function\(\) \{ return "[0-9a-f]+"; \}/g;
function clearModuleContext(path, content) {
    for (const [key, cache] of caches){
        var ref;
        const prev = (ref = cache === null || cache === void 0 ? void 0 : cache.paths.get(path)) === null || ref === void 0 ? void 0 : ref.replace(WEBPACK_HASH_REGEX, '');
        if (typeof prev !== 'undefined' && prev !== content.toString().replace(WEBPACK_HASH_REGEX, '')) {
            caches.delete(key);
        }
    }
}
/**
 * A Map of cached module contexts indexed by the module name. It allows
 * to have a different cache scoped per module name or depending on the
 * provided module key on creation.
 */ const caches = new Map();
function getModuleContext(options) {
    let moduleCache = options.useCache ? caches.get(options.module) : createModuleContext(options);
    if (!moduleCache) {
        moduleCache = createModuleContext(options);
        caches.set(options.module, moduleCache);
    }
    return {
        context: moduleCache.context,
        runInContext: (paramPath)=>{
            if (!moduleCache.paths.has(paramPath)) {
                const content = (0, _fs).readFileSync(paramPath, 'utf-8');
                try {
                    _vm.default.runInNewContext(content, moduleCache.context, {
                        filename: paramPath
                    });
                    moduleCache.paths.set(paramPath, content);
                } catch (error) {
                    if (options.useCache) {
                        caches.delete(options.module);
                    }
                    throw error;
                }
            }
        }
    };
}
/**
 * Create a module cache specific for the provided parameters. It includes
 * a context, require cache and paths cache and loads three types:
 * 1. Dependencies that hold no runtime dependencies.
 * 2. Dependencies that require runtime globals such as Blob.
 * 3. Dependencies that are scoped for the provided parameters.
 */ function createModuleContext(options) {
    const requireCache = new Map([
        [
            require.resolve('next/dist/compiled/cookie'),
            {
                exports: _cookie.default
            }
        ], 
    ]);
    const context = createContext(options);
    (0, _require).requireDependencies({
        requireCache: requireCache,
        context: context,
        dependencies: [
            {
                path: require.resolve('../spec-compliant/headers'),
                mapExports: {
                    Headers: 'Headers'
                }
            },
            {
                path: require.resolve('../spec-compliant/response'),
                mapExports: {
                    Response: 'Response'
                }
            },
            {
                path: require.resolve('../spec-compliant/request'),
                mapExports: {
                    Request: 'Request'
                }
            }, 
        ]
    });
    const moduleCache = {
        context: context,
        paths: new Map(),
        require: requireCache,
        warnedEvals: new Set()
    };
    context.__next_eval__ = function __next_eval__(fn) {
        const key = fn.toString();
        if (!moduleCache.warnedEvals.has(key)) {
            const warning = new Error(`Dynamic Code Evaluation (e. g. 'eval', 'new Function') not allowed in Middleware`);
            warning.name = 'DynamicCodeEvaluationWarning';
            Error.captureStackTrace(warning, __next_eval__);
            moduleCache.warnedEvals.add(key);
            options.onWarning(warning);
        }
        return fn();
    };
    context.fetch = (input, init = {
    })=>{
        var ref;
        var _headers;
        init.headers = new Headers((_headers = init.headers) !== null && _headers !== void 0 ? _headers : {
        });
        const prevs = ((ref = init.headers.get(`x-middleware-subrequest`)) === null || ref === void 0 ? void 0 : ref.split(':')) || [];
        const value = prevs.concat(options.module).join(':');
        init.headers.set('x-middleware-subrequest', value);
        init.headers.set(`user-agent`, `Next.js Middleware`);
        if (typeof input === 'object' && 'url' in input) {
            return fetch(input.url, {
                ...init,
                headers: {
                    ...Object.fromEntries(input.headers),
                    ...Object.fromEntries(init.headers)
                }
            });
        }
        return fetch(String(input), init);
    };
    return moduleCache;
}
/**
 * Create a base context with all required globals for the runtime that
 * won't depend on any externally provided dependency.
 */ function createContext(options) {
    const context = {
        _ENTRIES: {
        },
        atob: polyfills.atob,
        Blob: _formdataNode.Blob,
        btoa: polyfills.btoa,
        clearInterval,
        clearTimeout,
        console: {
            assert: console.assert.bind(console),
            error: console.error.bind(console),
            info: console.info.bind(console),
            log: console.log.bind(console),
            time: console.time.bind(console),
            timeEnd: console.timeEnd.bind(console),
            timeLog: console.timeLog.bind(console),
            warn: console.warn.bind(console)
        },
        AbortController: _abortController.AbortController,
        AbortSignal: _abortController.AbortSignal,
        CryptoKey: polyfills.CryptoKey,
        Crypto: polyfills.Crypto,
        crypto: new polyfills.Crypto(),
        File: _formdataNode.File,
        FormData: _formdataNode.FormData,
        process: {
            env: buildEnvironmentVariablesFrom(options.env)
        },
        ReadableStream: polyfills.ReadableStream,
        setInterval,
        setTimeout,
        TextDecoder,
        TextEncoder,
        TransformStream: _webStreamsPolyfill.TransformStream,
        URL,
        URLSearchParams,
        // Indexed collections
        Array,
        Int8Array,
        Uint8Array,
        Uint8ClampedArray,
        Int16Array,
        Uint16Array,
        Int32Array,
        Uint32Array,
        Float32Array,
        Float64Array,
        BigInt64Array,
        BigUint64Array,
        // Keyed collections
        Map,
        Set,
        WeakMap,
        WeakSet,
        // Structured data
        ArrayBuffer,
        SharedArrayBuffer
    };
    // Self references
    context.self = context;
    context.globalThis = context;
    return _vm.default.createContext(context, {
        codeGeneration: process.env.NODE_ENV === 'production' ? {
            strings: false,
            wasm: false
        } : undefined
    });
}
function buildEnvironmentVariablesFrom(keys) {
    const pairs = keys.map((key)=>[
            key,
            process.env[key]
        ]
    );
    return Object.fromEntries(pairs);
}

//# sourceMappingURL=context.js.map