"use strict";
var _ = require("./");
var _onDemandEntriesClient = _interopRequireDefault(require("./dev/on-demand-entries-client"));
var _webpackHotMiddlewareClient = _interopRequireDefault(require("./dev/webpack-hot-middleware-client"));
var _devBuildWatcher = _interopRequireDefault(require("./dev/dev-build-watcher"));
var _fouc = require("./dev/fouc");
var _websocket = require("./dev/error-overlay/websocket");
var _querystring = require("../shared/lib/router/utils/querystring");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const { __NEXT_DATA__: { assetPrefix  } ,  } = window;
const prefix = assetPrefix || '';
const webpackHMR = (0, _webpackHotMiddlewareClient).default();
(0, _websocket).connectHMR({
    assetPrefix: prefix,
    path: '/_next/webpack-hmr'
});
if (!window._nextSetupHydrationWarning) {
    const origConsoleError = window.console.error;
    window.console.error = (...args)=>{
        const isHydrateError = args.some((arg)=>typeof arg === 'string' && arg.match(/Warning:.*?did not match.*?Server:/)
        );
        if (isHydrateError) {
            args = [
                ...args,
                `\n\nSee more info here: https://nextjs.org/docs/messages/react-hydration-error`, 
            ];
        }
        origConsoleError.apply(window.console, args);
    };
    window._nextSetupHydrationWarning = true;
}
window.next = {
    version: _.version,
    // router is initialized later so it has to be live-binded
    get router () {
        return _.router;
    },
    emitter: _.emitter
};
(0, _).initNext({
    webpackHMR,
    beforeRender: _fouc.displayContent
}).then(()=>{
    (0, _onDemandEntriesClient).default();
    let buildIndicatorHandler = ()=>{
    };
    function devPagesManifestListener(event) {
        if (event.data.indexOf('devPagesManifest') !== -1) {
            fetch(`${prefix}/_next/static/development/_devPagesManifest.json`).then((res)=>res.json()
            ).then((manifest)=>{
                window.__DEV_PAGES_MANIFEST = manifest;
            }).catch((err)=>{
                console.log(`Failed to fetch devPagesManifest`, err);
            });
        } else if (event.data.indexOf('middlewareChanges') !== -1) {
            return window.location.reload();
        } else if (event.data.indexOf('serverOnlyChanges') !== -1) {
            const { pages  } = JSON.parse(event.data);
            // Make sure to reload when the dev-overlay is showing for an
            // API route
            if (pages.includes(_.router.query.__NEXT_PAGE)) {
                return window.location.reload();
            }
            if (!_.router.clc && pages.includes(_.router.pathname)) {
                console.log('Refreshing page data due to server-side change');
                buildIndicatorHandler('building');
                const clearIndicator = ()=>buildIndicatorHandler('built')
                ;
                _.router.replace(_.router.pathname + '?' + String((0, _querystring).assign((0, _querystring).urlQueryToSearchParams(_.router.query), new URLSearchParams(location.search))), _.router.asPath).finally(clearIndicator);
            }
        }
    }
    (0, _websocket).addMessageListener(devPagesManifestListener);
    if (process.env.__NEXT_BUILD_INDICATOR) {
        (0, _devBuildWatcher).default((handler)=>{
            buildIndicatorHandler = handler;
        }, process.env.__NEXT_BUILD_INDICATOR_POSITION);
    }
}).catch((err)=>{
    console.error('Error was not caught', err);
});

//# sourceMappingURL=next-dev.js.map