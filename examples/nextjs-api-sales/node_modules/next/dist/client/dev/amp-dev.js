"use strict";
var _fouc = require("./fouc");
var _onDemandEntriesClient = _interopRequireDefault(require("./on-demand-entries-client"));
var _websocket = require("./error-overlay/websocket");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const data = JSON.parse(document.getElementById('__NEXT_DATA__').textContent);
window.__NEXT_DATA__ = data;
let { assetPrefix , page  } = data;
assetPrefix = assetPrefix || '';
let mostRecentHash = null;
/* eslint-disable-next-line */ let curHash = __webpack_hash__;
const hotUpdatePath = assetPrefix + (assetPrefix.endsWith('/') ? '' : '/') + '_next/static/webpack/';
// Is there a newer version of this code available?
function isUpdateAvailable() {
    // __webpack_hash__ is the hash of the current compilation.
    // It's a global variable injected by Webpack.
    /* eslint-disable-next-line */ return mostRecentHash !== __webpack_hash__;
}
// Webpack disallows updates in other states.
function canApplyUpdates() {
    return module.hot.status() === 'idle';
}
function _tryApplyUpdates() {
    _tryApplyUpdates = // This function reads code updates on the fly and hard
    // reloads the page when it has changed.
    _asyncToGenerator(function*() {
        if (!isUpdateAvailable() || !canApplyUpdates()) {
            return;
        }
        try {
            const res = yield fetch(typeof __webpack_runtime_id__ !== 'undefined' ? `${hotUpdatePath}${curHash}.${__webpack_runtime_id__}.hot-update.json` : `${hotUpdatePath}${curHash}.hot-update.json`);
            const jsonData = yield res.json();
            const curPage = page === '/' ? 'index' : page;
            // webpack 5 uses an array instead
            const pageUpdated = (Array.isArray(jsonData.c) ? jsonData.c : Object.keys(jsonData.c)).some((mod)=>{
                return mod.indexOf(`pages${curPage.substr(0, 1) === '/' ? curPage : `/${curPage}`}`) !== -1 || mod.indexOf(`pages${curPage.substr(0, 1) === '/' ? curPage : `/${curPage}`}`.replace(/\//g, '\\')) !== -1;
            });
            if (pageUpdated) {
                document.location.reload(true);
            } else {
                curHash = mostRecentHash;
            }
        } catch (err) {
            console.error('Error occurred checking for update', err);
            document.location.reload(true);
        }
    });
    return _tryApplyUpdates.apply(this, arguments);
}
function tryApplyUpdates() {
    return _tryApplyUpdates.apply(this, arguments);
}
(0, _websocket).addMessageListener((event)=>{
    if (event.data === '\uD83D\uDC93') {
        return;
    }
    try {
        const message = JSON.parse(event.data);
        if (message.action === 'sync' || message.action === 'built') {
            if (!message.hash) {
                return;
            }
            mostRecentHash = message.hash;
            tryApplyUpdates();
        } else if (message.action === 'reloadPage') {
            document.location.reload(true);
        }
    } catch (ex) {
        console.warn('Invalid HMR message: ' + event.data + '\n' + ex);
    }
});
(0, _websocket).connectHMR({
    assetPrefix,
    path: '/_next/webpack-hmr'
});
(0, _fouc).displayContent();
(0, _onDemandEntriesClient).default(data.page);

//# sourceMappingURL=amp-dev.js.map