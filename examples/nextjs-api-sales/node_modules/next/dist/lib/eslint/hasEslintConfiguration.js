"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.hasEslintConfiguration = hasEslintConfiguration;
var _fs = require("fs");
async function hasEslintConfiguration(eslintrcFile, packageJsonConfig) {
    const configObject = {
        exists: false,
        emptyEslintrc: false,
        emptyPkgJsonConfig: false
    };
    if (eslintrcFile) {
        const content = await _fs.promises.readFile(eslintrcFile, {
            encoding: 'utf8'
        }).then((txt)=>txt.trim().replace(/\n/g, '')
        , ()=>null
        );
        if (content === '' || content === '{}' || content === '---' || content === 'module.exports = {}') {
            return {
                ...configObject,
                emptyEslintrc: true
            };
        }
    } else if (packageJsonConfig === null || packageJsonConfig === void 0 ? void 0 : packageJsonConfig.eslintConfig) {
        if (Object.entries(packageJsonConfig === null || packageJsonConfig === void 0 ? void 0 : packageJsonConfig.eslintConfig).length === 0) {
            return {
                ...configObject,
                emptyPkgJsonConfig: true
            };
        }
    } else {
        return configObject;
    }
    return {
        ...configObject,
        exists: true
    };
}

//# sourceMappingURL=hasEslintConfiguration.js.map