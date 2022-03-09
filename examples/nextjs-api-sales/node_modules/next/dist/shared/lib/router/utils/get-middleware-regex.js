"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getMiddlewareRegex = getMiddlewareRegex;
var _routeRegex = require("./route-regex");
function getMiddlewareRegex(normalizedRoute, catchAll = true) {
    const result = (0, _routeRegex).getParametrizedRoute(normalizedRoute);
    let catchAllRegex = catchAll ? '(?!_next).*' : '';
    let catchAllGroupedRegex = catchAll ? '(?:(/.*)?)' : '';
    if ('routeKeys' in result) {
        if (result.parameterizedRoute === '/') {
            return {
                groups: {
                },
                namedRegex: `^/${catchAllRegex}$`,
                re: new RegExp(`^/${catchAllRegex}$`),
                routeKeys: {
                }
            };
        }
        return {
            groups: result.groups,
            namedRegex: `^${result.namedParameterizedRoute}${catchAllGroupedRegex}$`,
            re: new RegExp(`^${result.parameterizedRoute}${catchAllGroupedRegex}$`),
            routeKeys: result.routeKeys
        };
    }
    if (result.parameterizedRoute === '/') {
        return {
            groups: {
            },
            re: new RegExp(`^/${catchAllRegex}$`)
        };
    }
    return {
        groups: {
        },
        re: new RegExp(`^${result.parameterizedRoute}${catchAllGroupedRegex}$`)
    };
}

//# sourceMappingURL=get-middleware-regex.js.map