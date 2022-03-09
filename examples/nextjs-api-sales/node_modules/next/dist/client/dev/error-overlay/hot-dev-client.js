"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = connect;
var _client = require("next/dist/compiled/@next/react-dev-overlay/client");
var _stripAnsi = _interopRequireDefault(require("next/dist/compiled/strip-ansi"));
var _websocket = require("./websocket");
var _formatWebpackMessages = _interopRequireDefault(require("./format-webpack-messages"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
// This alternative WebpackDevServer combines the functionality of:
// https://github.com/webpack/webpack-dev-server/blob/webpack-1/client/index.js
// https://github.com/webpack/webpack/blob/webpack-1/hot/dev-server.js
// It only supports their simplest configuration (hot updates on same server).
// It makes some opinionated choices on top, like adding a syntax error overlay
// that looks similar to our console output. The error overlay is inspired by:
// https://github.com/glenjamin/webpack-hot-middleware
let hadRuntimeError = false;
let customHmrEventHandler;
function connect() {
    (0, _client).register();
    (0, _websocket).addMessageListener((event)=>{
        if (event.data.indexOf('action') === -1) return;
        try {
            processMessage(event);
        } catch (ex) {
            console.warn('Invalid HMR message: ' + event.data + '\n', ex);
        }
    });
    return {
        subscribeToHmrEvent (handler) {
            customHmrEventHandler = handler;
        },
        onUnrecoverableError () {
            hadRuntimeError = true;
        }
    };
}
// Remember some state related to hot module replacement.
var isFirstCompilation = true;
var mostRecentCompilationHash = null;
var hasCompileErrors = false;
function clearOutdatedErrors() {
    // Clean up outdated compile errors, if any.
    if (typeof console !== 'undefined' && typeof console.clear === 'function') {
        if (hasCompileErrors) {
            console.clear();
        }
    }
}
// Successful compilation.
function handleSuccess() {
    clearOutdatedErrors();
    const isHotUpdate = !isFirstCompilation || window.__NEXT_DATA__.page !== '/_error' && isUpdateAvailable();
    isFirstCompilation = false;
    hasCompileErrors = false;
    // Attempt to apply hot updates or reload.
    if (isHotUpdate) {
        tryApplyUpdates(function onSuccessfulHotUpdate(hasUpdates) {
            // Only dismiss it when we're sure it's a hot update.
            // Otherwise it would flicker right before the reload.
            onFastRefresh(hasUpdates);
        });
    }
}
// Compilation with warnings (e.g. ESLint).
function handleWarnings(warnings) {
    clearOutdatedErrors();
    const isHotUpdate = !isFirstCompilation;
    isFirstCompilation = false;
    hasCompileErrors = false;
    function printWarnings() {
        // Print warnings to the console.
        const formatted = (0, _formatWebpackMessages).default({
            warnings: warnings,
            errors: []
        });
        if (typeof console !== 'undefined' && typeof console.warn === 'function') {
            for(let i = 0; i < formatted.warnings.length; i++){
                if (i === 5) {
                    console.warn('There were more warnings in other files.\n' + 'You can find a complete log in the terminal.');
                    break;
                }
                console.warn((0, _stripAnsi).default(formatted.warnings[i]));
            }
        }
    }
    printWarnings();
    // Attempt to apply hot updates or reload.
    if (isHotUpdate) {
        tryApplyUpdates(function onSuccessfulHotUpdate(hasUpdates) {
            // Only dismiss it when we're sure it's a hot update.
            // Otherwise it would flicker right before the reload.
            onFastRefresh(hasUpdates);
        });
    }
}
// Compilation with errors (e.g. syntax error or missing modules).
function handleErrors(errors) {
    clearOutdatedErrors();
    isFirstCompilation = false;
    hasCompileErrors = true;
    // "Massage" webpack messages.
    var formatted = (0, _formatWebpackMessages).default({
        errors: errors,
        warnings: []
    });
    // Only show the first error.
    (0, _client).onBuildError(formatted.errors[0]);
    // Also log them to the console.
    if (typeof console !== 'undefined' && typeof console.error === 'function') {
        for(var i = 0; i < formatted.errors.length; i++){
            console.error((0, _stripAnsi).default(formatted.errors[i]));
        }
    }
    // Do not attempt to reload now.
    // We will reload on next success instead.
    if (process.env.__NEXT_TEST_MODE) {
        if (self.__NEXT_HMR_CB) {
            self.__NEXT_HMR_CB(formatted.errors[0]);
            self.__NEXT_HMR_CB = null;
        }
    }
}
let startLatency = undefined;
function onFastRefresh(hasUpdates) {
    (0, _client).onBuildOk();
    if (hasUpdates) {
        (0, _client).onRefresh();
    }
    if (startLatency) {
        const latency = Date.now() - startLatency;
        console.log(`[Fast Refresh] done in ${latency}ms`);
        if (self.__NEXT_HMR_LATENCY_CB) {
            self.__NEXT_HMR_LATENCY_CB(latency);
        }
    }
}
// There is a newer version of the code available.
function handleAvailableHash(hash) {
    // Update last known compilation hash.
    mostRecentCompilationHash = hash;
}
// Handle messages from the server.
function processMessage(e) {
    const obj = JSON.parse(e.data);
    switch(obj.action){
        case 'building':
            {
                startLatency = Date.now();
                console.log('[Fast Refresh] rebuilding');
                break;
            }
        case 'built':
        case 'sync':
            {
                if (obj.hash) {
                    handleAvailableHash(obj.hash);
                }
                const { errors , warnings  } = obj;
                const hasErrors = Boolean(errors && errors.length);
                if (hasErrors) {
                    return handleErrors(errors);
                }
                const hasWarnings = Boolean(warnings && warnings.length);
                if (hasWarnings) {
                    return handleWarnings(warnings);
                }
                return handleSuccess();
            }
        default:
            {
                if (customHmrEventHandler) {
                    customHmrEventHandler(obj);
                    break;
                }
                break;
            }
    }
}
// Is there a newer version of this code available?
function isUpdateAvailable() {
    /* globals __webpack_hash__ */ // __webpack_hash__ is the hash of the current compilation.
    // It's a global variable injected by Webpack.
    return mostRecentCompilationHash !== __webpack_hash__;
}
// Webpack disallows updates in other states.
function canApplyUpdates() {
    return module.hot.status() === 'idle';
}
function afterApplyUpdates(fn) {
    if (canApplyUpdates()) {
        fn();
    } else {
        function handler(status) {
            if (status === 'idle') {
                module.hot.removeStatusHandler(handler);
                fn();
            }
        }
        module.hot.addStatusHandler(handler);
    }
}
// Attempt to update code on the fly, fall back to a hard reload.
function tryApplyUpdates(onHotUpdateSuccess) {
    if (!module.hot) {
        // HotModuleReplacementPlugin is not in Webpack configuration.
        console.error('HotModuleReplacementPlugin is not in Webpack configuration.');
        // window.location.reload();
        return;
    }
    if (!isUpdateAvailable() || !canApplyUpdates()) {
        (0, _client).onBuildOk();
        return;
    }
    function handleApplyUpdates(err, updatedModules) {
        if (err || hadRuntimeError || !updatedModules) {
            if (err) {
                performFullRefresh(err);
            } else if (hadRuntimeError) {
                performFullRefresh();
            }
            return;
        }
        clearFullRefreshStorage();
        const hasUpdates = Boolean(updatedModules.length);
        if (typeof onHotUpdateSuccess === 'function') {
            // Maybe we want to do something.
            onHotUpdateSuccess(hasUpdates);
        }
        if (isUpdateAvailable()) {
            // While we were updating, there was a new update! Do it again.
            tryApplyUpdates(hasUpdates ? _client.onBuildOk : onHotUpdateSuccess);
        } else {
            (0, _client).onBuildOk();
            if (process.env.__NEXT_TEST_MODE) {
                afterApplyUpdates(()=>{
                    if (self.__NEXT_HMR_CB) {
                        self.__NEXT_HMR_CB();
                        self.__NEXT_HMR_CB = null;
                    }
                });
            }
        }
    }
    // https://webpack.js.org/api/hot-module-replacement/#check
    module.hot.check(/* autoApply */ true).then((updatedModules)=>{
        handleApplyUpdates(null, updatedModules);
    }, (err)=>{
        handleApplyUpdates(err, null);
    });
}
const FULL_REFRESH_STORAGE_KEY = '_has_warned_about_full_refresh';
function performFullRefresh(err) {
    if (shouldWarnAboutFullRefresh()) {
        sessionStorage.setItem(FULL_REFRESH_STORAGE_KEY, 'true');
        const reason = err && (err.stack && err.stack.split('\n').slice(0, 5).join('\n') || err.message || err + '');
        (0, _client).onFullRefreshNeeded(reason);
    } else {
        window.location.reload();
    }
}
function shouldWarnAboutFullRefresh() {
    return !process.env.__NEXT_TEST_MODE && !hasAlreadyWarnedAboutFullRefresh();
}
function hasAlreadyWarnedAboutFullRefresh() {
    return sessionStorage.getItem(FULL_REFRESH_STORAGE_KEY) !== null;
}
function clearFullRefreshStorage() {
    if (sessionStorage.getItem(FULL_REFRESH_STORAGE_KEY) !== 'ignore') sessionStorage.removeItem(FULL_REFRESH_STORAGE_KEY);
}

//# sourceMappingURL=hot-dev-client.js.map