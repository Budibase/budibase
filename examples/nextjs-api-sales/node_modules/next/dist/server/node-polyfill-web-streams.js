"use strict";
var _webStreamsPolyfill = require("next/dist/compiled/web-streams-polyfill");
var _readableStream = require("./web/sandbox/readable-stream");
// Polyfill Web Streams in the Node.js environment
if (!global.ReadableStream) {
    global.ReadableStream = _readableStream.ReadableStream;
    global.TransformStream = _webStreamsPolyfill.TransformStream;
}

//# sourceMappingURL=node-polyfill-web-streams.js.map