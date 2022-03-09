"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _router = _interopRequireDefault(require("next/router"));
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
var _default = _asyncToGenerator(function*(page) {
    if (page) {
        // in AMP the router isn't initialized on the client and
        // client-transitions don't occur so ping initial page
        setInterval(()=>{
            (0, _websocket).sendMessage(JSON.stringify({
                event: 'ping',
                page
            }));
        }, 2500);
    } else {
        _router.default.ready(()=>{
            setInterval(()=>{
                // when notFound: true is returned we should use the notFoundPage
                // as the Router.pathname will point to the 404 page but we want
                // to ping the source page that returned notFound: true instead
                const notFoundSrcPage = self.__NEXT_DATA__.notFoundSrcPage;
                const pathname = (_router.default.pathname === '/404' || _router.default.pathname === '/_error') && notFoundSrcPage ? notFoundSrcPage : _router.default.pathname;
                (0, _websocket).sendMessage(JSON.stringify({
                    event: 'ping',
                    page: pathname
                }));
            }, 2500);
        });
    }
    (0, _websocket).addMessageListener((event)=>{
        if (event.data.indexOf('{') === -1) return;
        try {
            const payload = JSON.parse(event.data);
            // don't attempt fetching the page if we're already showing
            // the dev overlay as this can cause the error to be triggered
            // repeatedly
            if (payload.event === 'pong' && payload.invalid && !self.__NEXT_DATA__.err) {
                // Payload can be invalid even if the page does exist.
                // So, we check if it can be created.
                fetch(location.href, {
                    credentials: 'same-origin'
                }).then((pageRes)=>{
                    if (pageRes.status === 200) {
                        // Page exists now, reload
                        location.reload();
                    } else {
                        // Page doesn't exist
                        if (self.__NEXT_DATA__.page === _router.default.pathname && _router.default.pathname !== '/_error') {
                            // We are still on the page,
                            // reload to show 404 error page
                            location.reload();
                        }
                    }
                });
            }
        } catch (err) {
            console.error('on-demand-entries failed to parse response', err);
        }
    });
});
exports.default = _default;

//# sourceMappingURL=on-demand-entries-client.js.map