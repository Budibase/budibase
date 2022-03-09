"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isDynamicRoute = isDynamicRoute;
// Identify /[param]/ in route string
const TEST_ROUTE = /\/\[[^/]+?\](?=\/|$)/;
function isDynamicRoute(route) {
    return TEST_ROUTE.test(route);
}

//# sourceMappingURL=is-dynamic.js.map