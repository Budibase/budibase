"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadStaticPaths = loadStaticPaths;
require("../node-polyfill-fetch");
var _utils = require("../../build/utils");
var _loadComponents = require("../load-components");
var _config = require("../config");
let workerWasUsed = false;
async function loadStaticPaths(distDir, pathname, serverless, config, httpAgentOptions, locales, defaultLocale) {
    // we only want to use each worker once to prevent any invalid
    // caches
    if (workerWasUsed) {
        process.exit(1);
    }
    // update work memory runtime-config
    require('../../shared/lib/runtime-config').setConfig(config);
    (0, _config).setHttpAgentOptions(httpAgentOptions);
    const components = await (0, _loadComponents).loadComponents(distDir, pathname, serverless);
    if (!components.getStaticPaths) {
        // we shouldn't get to this point since the worker should
        // only be called for SSG pages with getStaticPaths
        throw new Error(`Invariant: failed to load page with getStaticPaths for ${pathname}`);
    }
    workerWasUsed = true;
    return (0, _utils).buildStaticPaths(pathname, components.getStaticPaths, config.configFileName, locales, defaultLocale);
}

//# sourceMappingURL=static-paths-worker.js.map