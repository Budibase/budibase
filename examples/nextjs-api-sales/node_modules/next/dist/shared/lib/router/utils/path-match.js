"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = exports.customRouteMatcherOptions = exports.matcherOptions = exports.pathToRegexp = void 0;
var pathToRegexp = _interopRequireWildcard(require("next/dist/compiled/path-to-regexp"));
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
exports.pathToRegexp = pathToRegexp;
const matcherOptions = {
    sensitive: false,
    delimiter: '/'
};
exports.matcherOptions = matcherOptions;
const customRouteMatcherOptions = {
    ...matcherOptions,
    strict: true
};
exports.customRouteMatcherOptions = customRouteMatcherOptions;
var _default = (customRoute = false)=>{
    return (path, regexModifier)=>{
        const keys = [];
        let matcherRegex = pathToRegexp.pathToRegexp(path, keys, customRoute ? customRouteMatcherOptions : matcherOptions);
        if (regexModifier) {
            const regexSource = regexModifier(matcherRegex.source);
            matcherRegex = new RegExp(regexSource, matcherRegex.flags);
        }
        const matcher = pathToRegexp.regexpToFunction(matcherRegex, keys);
        return (pathname, params)=>{
            const res = pathname == null ? false : matcher(pathname);
            if (!res) {
                return false;
            }
            if (customRoute) {
                for (const key of keys){
                    // unnamed params should be removed as they
                    // are not allowed to be used in the destination
                    if (typeof key.name === 'number') {
                        delete res.params[key.name];
                    }
                }
            }
            return {
                ...params,
                ...res.params
            };
        };
    };
};
exports.default = _default;

//# sourceMappingURL=path-match.js.map