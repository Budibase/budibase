"use strict";
var _vm = _interopRequireDefault(require("vm"));
var _index = require("./index");
var _options = require("./options");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
// Jest use the `vm` [Module API](https://nodejs.org/api/vm.html#vm_class_vm_module) for ESM.
// see https://github.com/facebook/jest/issues/9430
const isSupportEsm = 'Module' in _vm.default;
module.exports = {
    createTransformer: (inputOptions)=>({
            process (src, filename, jestOptions) {
                if (!/\.[jt]sx?$/.test(filename)) {
                    return src;
                }
                const jestConfig = getJestConfig(jestOptions);
                let swcTransformOpts = (0, _options).getJestSWCOptions({
                    // When target is node it's similar to the server option set in SWC.
                    isServer: jestConfig.testEnvironment && jestConfig.testEnvironment === 'node',
                    filename,
                    nextConfig: inputOptions.nextConfig,
                    jsConfig: inputOptions.jsConfig,
                    resolvedBaseUrl: inputOptions.resolvedBaseUrl,
                    esm: isSupportEsm && isEsm(Boolean(inputOptions.isEsmProject), filename, jestConfig)
                });
                return((0, _index).transformSync(src, {
                    ...swcTransformOpts,
                    filename
                }));
            }
        })
};
function getJestConfig(jestConfig) {
    return 'config' in jestConfig ? jestConfig.config : jestConfig;
}
function isEsm(isEsmProject, filename, jestConfig) {
    var ref;
    return /\.jsx?$/.test(filename) && isEsmProject || ((ref = jestConfig.extensionsToTreatAsEsm) === null || ref === void 0 ? void 0 : ref.find((ext)=>filename.endsWith(ext)
    ));
}

//# sourceMappingURL=jest-transformer.js.map