"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.printAndExit = printAndExit;
exports.getNodeOptionsWithoutInspect = getNodeOptionsWithoutInspect;
function printAndExit(message, code = 1) {
    if (code === 0) {
        console.log(message);
    } else {
        console.error(message);
    }
    process.exit(code);
}
function getNodeOptionsWithoutInspect() {
    const NODE_INSPECT_RE = /--inspect(-brk)?(=\S+)?( |$)/;
    return (process.env.NODE_OPTIONS || '').replace(NODE_INSPECT_RE, '');
}

//# sourceMappingURL=utils.js.map