"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _head = _interopRequireDefault(require("../shared/lib/head"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const statusCodes = {
    400: 'Bad Request',
    404: 'This page could not be found',
    405: 'Method Not Allowed',
    500: 'Internal Server Error'
};
function _getInitialProps({ res , err  }) {
    const statusCode = res && res.statusCode ? res.statusCode : err ? err.statusCode : 404;
    return {
        statusCode
    };
}
class Error extends _react.default.Component {
    render() {
        const { statusCode  } = this.props;
        const title = this.props.title || statusCodes[statusCode] || 'An unexpected error has occurred';
        return(/*#__PURE__*/ _react.default.createElement("div", {
            style: styles.error
        }, !process.env.__NEXT_RSC && /*#__PURE__*/ _react.default.createElement(_head.default, null, /*#__PURE__*/ _react.default.createElement("title", null, statusCode ? `${statusCode}: ${title}` : 'Application error: a client-side exception has occurred')), /*#__PURE__*/ _react.default.createElement("div", null, /*#__PURE__*/ _react.default.createElement("style", {
            dangerouslySetInnerHTML: {
                __html: 'body { margin: 0 }'
            }
        }), statusCode ? /*#__PURE__*/ _react.default.createElement("h1", {
            style: styles.h1
        }, statusCode) : null, /*#__PURE__*/ _react.default.createElement("div", {
            style: styles.desc
        }, /*#__PURE__*/ _react.default.createElement("h2", {
            style: styles.h2
        }, this.props.title || statusCode ? title : /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, "Application error: a client-side exception has occurred (see the browser console for more information)"), ".")))));
    }
}
Error.displayName = 'ErrorPage';
Error.getInitialProps = _getInitialProps;
Error.origGetInitialProps = _getInitialProps;
exports.default = Error;
const styles = {
    error: {
        color: '#000',
        background: '#fff',
        fontFamily: '-apple-system, BlinkMacSystemFont, Roboto, "Segoe UI", "Fira Sans", Avenir, "Helvetica Neue", "Lucida Grande", sans-serif',
        height: '100vh',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    desc: {
        display: 'inline-block',
        textAlign: 'left',
        lineHeight: '49px',
        height: '49px',
        verticalAlign: 'middle'
    },
    h1: {
        display: 'inline-block',
        borderRight: '1px solid rgba(0, 0, 0,.3)',
        margin: 0,
        marginRight: '20px',
        padding: '10px 23px 10px 0',
        fontSize: '24px',
        fontWeight: 500,
        verticalAlign: 'top'
    },
    h2: {
        fontSize: '14px',
        fontWeight: 'normal',
        lineHeight: 'inherit',
        margin: 0,
        padding: 0
    }
};

//# sourceMappingURL=_error.js.map