"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = nextJest;
var _env = require("@next/env");
var _path = require("path");
var _config = _interopRequireDefault(require("../../server/config"));
var _constants = require("../../shared/lib/constants");
var _loadJsconfig = _interopRequireDefault(require("../load-jsconfig"));
var Log = _interopRequireWildcard(require("../output/log"));
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
async function getConfig(dir) {
    const conf = await (0, _config).default(_constants.PHASE_TEST, dir);
    return conf;
}
/**
 * Loads closest package.json in the directory hierarchy
 */ function loadClosestPackageJson(dir, attempts = 1) {
    if (attempts > 5) {
        throw new Error("Can't resolve main package.json file");
    }
    var mainPath = attempts === 1 ? './' : Array(attempts).join('../');
    try {
        return require((0, _path).join(dir, mainPath + 'package.json'));
    } catch (e) {
        return loadClosestPackageJson(dir, attempts + 1);
    }
}
function nextJest(options = {
}) {
    // createJestConfig
    return (customJestConfig)=>{
        // Function that is provided as the module.exports of jest.config.js
        // Will be called and awaited by Jest
        return async ()=>{
            let nextConfig;
            let jsConfig;
            let resolvedBaseUrl;
            let isEsmProject = false;
            if (options.dir) {
                const resolvedDir = (0, _path).resolve(options.dir);
                const packageConfig = loadClosestPackageJson(resolvedDir);
                isEsmProject = packageConfig.type === 'module';
                nextConfig = await getConfig(resolvedDir);
                (0, _env).loadEnvConfig(resolvedDir, false, Log);
                // TODO: revisit when bug in SWC is fixed that strips `.css`
                const result = await (0, _loadJsconfig).default(resolvedDir, nextConfig);
                jsConfig = result.jsConfig;
                resolvedBaseUrl = result.resolvedBaseUrl;
            }
            var ref;
            // Ensure provided async config is supported
            const resolvedJestConfig = (ref = typeof customJestConfig === 'function' ? await customJestConfig() : customJestConfig) !== null && ref !== void 0 ? ref : {
            };
            return {
                ...resolvedJestConfig,
                moduleNameMapper: {
                    // Handle CSS imports (with CSS modules)
                    // https://jestjs.io/docs/webpack#mocking-css-modules
                    '^.+\\.module\\.(css|sass|scss)$': require.resolve('./object-proxy.js'),
                    // Handle CSS imports (without CSS modules)
                    '^.+\\.(css|sass|scss)$': require.resolve('./__mocks__/styleMock.js'),
                    // Handle image imports
                    '^.+\\.(jpg|jpeg|png|gif|webp|avif|svg)$': require.resolve(`./__mocks__/fileMock.js`),
                    // Custom config will be able to override the default mappings
                    ...resolvedJestConfig.moduleNameMapper || {
                    }
                },
                testPathIgnorePatterns: [
                    // Don't look for tests in node_modules
                    '/node_modules/',
                    // Don't look for tests in the Next.js build output
                    '/.next/',
                    // Custom config can append to testPathIgnorePatterns but not modify it
                    // This is to ensure `.next` and `node_modules` are always excluded
                    ...resolvedJestConfig.testPathIgnorePatterns || [], 
                ],
                transform: {
                    // Use SWC to compile tests
                    '^.+\\.(js|jsx|ts|tsx)$': [
                        require.resolve('../swc/jest-transformer'),
                        {
                            nextConfig,
                            jsConfig,
                            resolvedBaseUrl,
                            isEsmProject
                        }, 
                    ],
                    // Allow for appending/overriding the default transforms
                    ...resolvedJestConfig.transform || {
                    }
                },
                transformIgnorePatterns: [
                    // To match Next.js behavior node_modules is not transformed
                    '/node_modules/',
                    // CSS modules are mocked so they don't need to be transformed
                    '^.+\\.module\\.(css|sass|scss)$',
                    // Custom config can append to transformIgnorePatterns but not modify it
                    // This is to ensure `node_modules` and .module.css/sass/scss are always excluded
                    ...resolvedJestConfig.transformIgnorePatterns || [], 
                ],
                watchPathIgnorePatterns: [
                    // Don't re-run tests when the Next.js build output changes
                    '/.next/',
                    ...resolvedJestConfig.watchPathIgnorePatterns || [], 
                ]
            };
        };
    };
}

//# sourceMappingURL=jest.js.map