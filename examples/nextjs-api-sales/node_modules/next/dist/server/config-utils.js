"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadWebpackHook = loadWebpackHook;
var _webpack = require("next/dist/compiled/webpack/webpack");
let installed = false;
function loadWebpackHook() {
    if (installed) {
        return;
    }
    installed = true;
    (0, _webpack).init();
    // hook the Node.js require so that webpack requires are
    // routed to the bundled and now initialized webpack version
    require('../build/webpack/require-hook');
}

//# sourceMappingURL=config-utils.js.map