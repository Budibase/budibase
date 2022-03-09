"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getPackageVersion = getPackageVersion;
var _fs = require("fs");
var _findUp = _interopRequireDefault(require("next/dist/compiled/find-up"));
var _json5 = _interopRequireDefault(require("next/dist/compiled/json5"));
var path = _interopRequireWildcard(require("path"));
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
let cachedDeps;
async function getDependencies({ cwd  }) {
    if (cachedDeps) {
        return cachedDeps;
    }
    const configurationPath = await (0, _findUp).default('package.json', {
        cwd
    });
    if (!configurationPath) {
        return cachedDeps = {
            dependencies: {
            },
            devDependencies: {
            }
        };
    }
    const content = await _fs.promises.readFile(configurationPath, 'utf-8');
    const packageJson = _json5.default.parse(content);
    const { dependencies ={
    } , devDependencies ={
    }  } = packageJson || {
    };
    return cachedDeps = {
        dependencies,
        devDependencies
    };
}
async function getPackageVersion({ cwd , name  }) {
    const { dependencies , devDependencies  } = await getDependencies({
        cwd
    });
    if (!(dependencies[name] || devDependencies[name])) {
        return null;
    }
    const cwd2 = cwd.endsWith(path.posix.sep) || cwd.endsWith(path.win32.sep) ? cwd : `${cwd}/`;
    try {
        const targetPath = require.resolve(`${name}/package.json`, {
            paths: [
                cwd2
            ]
        });
        const targetContent = await _fs.promises.readFile(targetPath, 'utf-8');
        var _version;
        return (_version = _json5.default.parse(targetContent).version) !== null && _version !== void 0 ? _version : null;
    } catch  {
        return null;
    }
}

//# sourceMappingURL=get-package-version.js.map