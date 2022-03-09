"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _shared = require("../shared");
const TRACE_EVENT_ACCESSLIST = new Map(Object.entries({
    'webpack-invalidated': 'WEBPACK_INVALIDATED'
}));
const reportToTelemetry = (spanName, duration)=>{
    const eventName = TRACE_EVENT_ACCESSLIST.get(spanName);
    if (!eventName) {
        return;
    }
    const telemetry = _shared.traceGlobals.get('telemetry');
    if (!telemetry) {
        return;
    }
    telemetry.record({
        eventName,
        payload: {
            durationInMicroseconds: duration
        }
    });
};
var _default = {
    flushAll: ()=>{
    },
    report: reportToTelemetry
};
exports.default = _default;

//# sourceMappingURL=to-telemetry.js.map