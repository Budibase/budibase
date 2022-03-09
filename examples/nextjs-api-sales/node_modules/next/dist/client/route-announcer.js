"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RouteAnnouncer = RouteAnnouncer;
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _router = require("./router");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function RouteAnnouncer() {
    const { asPath  } = (0, _router).useRouter();
    const [routeAnnouncement, setRouteAnnouncement] = _react.default.useState('');
    // Only announce the path change, but not for the first load because screen
    // reader will do that automatically.
    const previouslyLoadedPath = _react.default.useRef(asPath);
    // Every time the path changes, announce the new page’s title following this
    // priority: first the document title (from head), otherwise the first h1, or
    // if none of these exist, then the pathname from the URL. This methodology is
    // inspired by Marcy Sutton’s accessible client routing user testing. More
    // information can be found here:
    // https://www.gatsbyjs.com/blog/2019-07-11-user-testing-accessible-client-routing/
    _react.default.useEffect(()=>{
        // If the path hasn't change, we do nothing.
        if (previouslyLoadedPath.current === asPath) return;
        previouslyLoadedPath.current = asPath;
        if (document.title) {
            setRouteAnnouncement(document.title);
        } else {
            const pageHeader = document.querySelector('h1');
            var ref;
            const content = (ref = pageHeader === null || pageHeader === void 0 ? void 0 : pageHeader.innerText) !== null && ref !== void 0 ? ref : pageHeader === null || pageHeader === void 0 ? void 0 : pageHeader.textContent;
            setRouteAnnouncement(content || asPath);
        }
    }, // TODO: switch to pathname + query object of dynamic route requirements
    [
        asPath
    ]);
    return(/*#__PURE__*/ _react.default.createElement("p", {
        "aria-live": "assertive" // Make the announcement immediately.
        ,
        id: "__next-route-announcer__",
        role: "alert",
        style: {
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: '1px',
            margin: '-1px',
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            width: '1px',
            // https://medium.com/@jessebeach/beware-smushed-off-screen-accessible-text-5952a4c2cbfe
            whiteSpace: 'nowrap',
            wordWrap: 'normal'
        }
    }, routeAnnouncement));
}
var _default = RouteAnnouncer;
exports.default = _default;

//# sourceMappingURL=route-announcer.js.map