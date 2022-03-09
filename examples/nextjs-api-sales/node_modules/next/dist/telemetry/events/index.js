"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _exportNames = {
};
var _version = _interopRequireWildcard(require("./version"));
var _build = _interopRequireWildcard(require("./build"));
var _plugins = _interopRequireWildcard(require("./plugins"));
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
Object.keys(_version).forEach(function(key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    if (key in exports && exports[key] === _version[key]) return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function() {
            return _version[key];
        }
    });
});
Object.keys(_build).forEach(function(key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    if (key in exports && exports[key] === _build[key]) return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function() {
            return _build[key];
        }
    });
});
Object.keys(_plugins).forEach(function(key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    if (key in exports && exports[key] === _plugins[key]) return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function() {
            return _plugins[key];
        }
    });
});

//# sourceMappingURL=index.js.map