"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports._postPayload = _postPayload;
var _asyncRetry = _interopRequireDefault(require("next/dist/compiled/async-retry"));
var _nodeFetch = _interopRequireDefault(require("next/dist/compiled/node-fetch"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _postPayload(endpoint, body) {
    return (0, _asyncRetry).default(()=>(0, _nodeFetch).default(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'content-type': 'application/json'
            },
            timeout: 5000
        }).then((res)=>{
            if (!res.ok) {
                const err = new Error(res.statusText);
                err.response = res;
                throw err;
            }
        })
    , {
        minTimeout: 500,
        retries: 1,
        factor: 1
    }).catch(()=>{
    // We swallow errors when telemetry cannot be sent
    })// Ensure promise is voided
    .then(()=>{
    }, ()=>{
    });
}

//# sourceMappingURL=post-payload.js.map