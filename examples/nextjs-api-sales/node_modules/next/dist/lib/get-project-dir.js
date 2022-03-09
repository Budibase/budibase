"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getProjectDir = getProjectDir;
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
var Log = _interopRequireWildcard(require("../build/output/log"));
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
function getProjectDir(dir) {
    const resolvedDir = _path.default.resolve(dir || '.');
    const realDir = _fs.default.realpathSync.native(resolvedDir);
    if (resolvedDir !== realDir && resolvedDir.toLowerCase() === realDir.toLowerCase()) {
        Log.warn(`Invalid casing detected for project dir, received ${resolvedDir} actual path ${realDir}, see more info here https://nextjs.org/docs/messages/invalid-project-dir-casing`);
    }
    return realDir;
}

//# sourceMappingURL=get-project-dir.js.map