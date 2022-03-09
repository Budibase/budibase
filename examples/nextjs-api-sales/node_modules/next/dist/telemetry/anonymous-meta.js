"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getAnonymousMeta = getAnonymousMeta;
var _isDocker = _interopRequireDefault(require("next/dist/compiled/is-docker"));
var _isWsl = _interopRequireDefault(require("next/dist/compiled/is-wsl"));
var _os = _interopRequireDefault(require("os"));
var ciEnvironment = _interopRequireWildcard(require("./ci-info"));
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
let traits;
function getAnonymousMeta() {
    if (traits) {
        return traits;
    }
    const cpus = _os.default.cpus() || [];
    const { NOW_REGION  } = process.env;
    traits = {
        // Software information
        systemPlatform: _os.default.platform(),
        systemRelease: _os.default.release(),
        systemArchitecture: _os.default.arch(),
        // Machine information
        cpuCount: cpus.length,
        cpuModel: cpus.length ? cpus[0].model : null,
        cpuSpeed: cpus.length ? cpus[0].speed : null,
        memoryInMb: Math.trunc(_os.default.totalmem() / Math.pow(1024, 2)),
        // Environment information
        isDocker: (0, _isDocker).default(),
        isNowDev: NOW_REGION === 'dev1',
        isWsl: _isWsl.default,
        isCI: ciEnvironment.isCI,
        ciName: ciEnvironment.isCI && ciEnvironment.name || null,
        nextVersion: "12.1.0"
    };
    return traits;
}

//# sourceMappingURL=anonymous-meta.js.map