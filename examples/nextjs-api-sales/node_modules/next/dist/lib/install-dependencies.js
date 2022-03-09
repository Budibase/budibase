"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.installDependencies = installDependencies;
var _chalk = _interopRequireDefault(require("next/dist/compiled/chalk"));
var _path = _interopRequireDefault(require("path"));
var _shouldUseYarn = require("./helpers/should-use-yarn");
var _install = require("./helpers/install");
var _getOnline = require("./helpers/get-online");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function installDependencies(baseDir, deps, dev = false) {
    const useYarn = (0, _shouldUseYarn).shouldUseYarn(baseDir);
    const isOnline = !useYarn || await (0, _getOnline).getOnline();
    if (deps.length) {
        console.log();
        console.log(`Installing ${dev ? 'devDependencies' : 'dependencies'}:`);
        for (const dep of deps){
            console.log(`- ${_chalk.default.cyan(dep.pkg)}`);
        }
        console.log();
        const devInstallFlags = {
            devDependencies: dev,
            ...{
                useYarn,
                isOnline
            }
        };
        await (0, _install).install(_path.default.resolve(baseDir), deps.map((dep)=>dep.pkg
        ), devInstallFlags);
        console.log();
    }
}

//# sourceMappingURL=install-dependencies.js.map