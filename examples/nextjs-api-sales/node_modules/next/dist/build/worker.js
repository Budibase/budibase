"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "exportPage", {
    enumerable: true,
    get: function() {
        return _worker.default;
    }
});
var _utils = _interopRequireWildcard(require("./utils"));
var _worker = _interopRequireDefault(require("../export/worker"));
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
Object.keys(_utils).forEach(function(key) {
    if (key === "default" || key === "__esModule") return;
    if (key in exports && exports[key] === _utils[key]) return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function() {
            return _utils[key];
        }
    });
});

//# sourceMappingURL=worker.js.map