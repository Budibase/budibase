"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = createSpinner;
var _ora = _interopRequireDefault(require("next/dist/compiled/ora"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const dotsSpinner = {
    frames: [
        '.',
        '..',
        '...'
    ],
    interval: 200
};
function createSpinner(text, options = {
}, logFn = console.log) {
    let spinner;
    let prefixText = text && typeof text === 'object' && text.prefixText;
    if (process.stdout.isTTY) {
        spinner = (0, _ora).default({
            text: typeof text === 'string' ? text : undefined,
            prefixText: typeof prefixText === 'string' ? prefixText : undefined,
            spinner: dotsSpinner,
            stream: process.stdout,
            ...options
        }).start();
        // Add capturing of console.log/warn/error to allow pausing
        // the spinner before logging and then restarting spinner after
        const origLog = console.log;
        const origWarn = console.warn;
        const origError = console.error;
        const origStop = spinner.stop.bind(spinner);
        const origStopAndPersist = spinner.stopAndPersist.bind(spinner);
        const logHandle = (method, args)=>{
            origStop();
            method(...args);
            spinner.start();
        };
        console.log = (...args)=>logHandle(origLog, args)
        ;
        console.warn = (...args)=>logHandle(origWarn, args)
        ;
        console.error = (...args)=>logHandle(origError, args)
        ;
        const resetLog = ()=>{
            console.log = origLog;
            console.warn = origWarn;
            console.error = origError;
        };
        spinner.stop = ()=>{
            origStop();
            resetLog();
            return spinner;
        };
        spinner.stopAndPersist = ()=>{
            origStopAndPersist();
            resetLog();
            return spinner;
        };
    } else if (prefixText || text) {
        logFn(prefixText ? prefixText + '...' : text);
    }
    return spinner;
}

//# sourceMappingURL=spinner.js.map