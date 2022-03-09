"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.flushAllTraces = exports.trace = exports.SpanStatus = void 0;
var _report = require("./report");
const NUM_OF_MICROSEC_IN_SEC = BigInt('1000');
let count = 0;
const getId = ()=>{
    count++;
    return count;
};
var SpanStatus;
exports.SpanStatus = SpanStatus;
(function(SpanStatus) {
    SpanStatus[SpanStatus["Started"] = 0] = "Started";
    SpanStatus[SpanStatus["Stopped"] = 1] = "Stopped";
})(SpanStatus || (exports.SpanStatus = SpanStatus = {
}));
class Span {
    constructor({ name , parentId , attrs , startTime  }){
        this.name = name;
        this.parentId = parentId;
        this.duration = null;
        this.attrs = attrs ? {
            ...attrs
        } : {
        };
        this.status = SpanStatus.Started;
        this.id = getId();
        this._start = startTime || process.hrtime.bigint();
    }
    // Durations are reported as microseconds. This gives 1000x the precision
    // of something like Date.now(), which reports in milliseconds.
    // Additionally, ~285 years can be safely represented as microseconds as
    // a float64 in both JSON and JavaScript.
    stop(stopTime) {
        const end = stopTime || process.hrtime.bigint();
        const duration = (end - this._start) / NUM_OF_MICROSEC_IN_SEC;
        this.status = SpanStatus.Stopped;
        if (duration > Number.MAX_SAFE_INTEGER) {
            throw new Error(`Duration is too long to express as float64: ${duration}`);
        }
        const timestamp = this._start / NUM_OF_MICROSEC_IN_SEC;
        _report.reporter.report(this.name, Number(duration), Number(timestamp), this.id, this.parentId, this.attrs);
    }
    traceChild(name, attrs) {
        return new Span({
            name,
            parentId: this.id,
            attrs
        });
    }
    manualTraceChild(name, startTime, stopTime, attrs) {
        const span = new Span({
            name,
            parentId: this.id,
            attrs,
            startTime
        });
        span.stop(stopTime);
    }
    setAttribute(key, value) {
        this.attrs[key] = String(value);
    }
    traceFn(fn) {
        try {
            return fn();
        } finally{
            this.stop();
        }
    }
    async traceAsyncFn(fn) {
        try {
            return await fn();
        } finally{
            this.stop();
        }
    }
}
exports.Span = Span;
const trace = (name, parentId, attrs)=>{
    return new Span({
        name,
        parentId,
        attrs
    });
};
exports.trace = trace;
const flushAllTraces = ()=>_report.reporter.flushAll()
;
exports.flushAllTraces = flushAllTraces;

//# sourceMappingURL=trace.js.map