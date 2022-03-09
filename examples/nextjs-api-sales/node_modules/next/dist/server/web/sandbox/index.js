"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "clearModuleContext", {
    enumerable: true,
    get: function() {
        return _context.clearModuleContext;
    }
});
var _sandbox = _interopRequireWildcard(require("./sandbox"));
var _context = require("./context");
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
Object.keys(_sandbox).forEach(function(key) {
    if (key === "default" || key === "__esModule") return;
    if (key in exports && exports[key] === _sandbox[key]) return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function() {
            return _sandbox[key];
        }
    });
});

//# sourceMappingURL=index.js.map