"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppInitialProps", {
    enumerable: true,
    get: function() {
        return _utils.AppInitialProps;
    }
});
Object.defineProperty(exports, "NextWebVitalsMetric", {
    enumerable: true,
    get: function() {
        return _utils.NextWebVitalsMetric;
    }
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _utils = require("../shared/lib/utils");
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
function _appGetInitialProps() {
    _appGetInitialProps = /**
 * `App` component is used for initialize of pages. It allows for overwriting and full control of the `page` initialization.
 * This allows for keeping state between navigation, custom error handling, injecting additional data.
 */ _asyncToGenerator(function*({ Component , ctx  }) {
        const pageProps = yield (0, _utils).loadGetInitialProps(Component, ctx);
        return {
            pageProps
        };
    });
    return _appGetInitialProps.apply(this, arguments);
}
function appGetInitialProps(_) {
    return _appGetInitialProps.apply(this, arguments);
}
class App extends _react.default.Component {
    render() {
        const { Component , pageProps  } = this.props;
        return(/*#__PURE__*/ _react.default.createElement(Component, Object.assign({
        }, pageProps)));
    }
}
App.origGetInitialProps = appGetInitialProps;
App.getInitialProps = appGetInitialProps;
exports.default = App;

//# sourceMappingURL=_app.js.map