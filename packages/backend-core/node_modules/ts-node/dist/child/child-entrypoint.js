"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bin_1 = require("../bin");
const zlib_1 = require("zlib");
const base64ConfigArg = process.argv[2];
const argPrefix = '--brotli-base64-config=';
if (!base64ConfigArg.startsWith(argPrefix))
    throw new Error('unexpected argv');
const base64Payload = base64ConfigArg.slice(argPrefix.length);
const payload = JSON.parse((0, zlib_1.brotliDecompressSync)(Buffer.from(base64Payload, 'base64')).toString());
payload.isInChildProcess = true;
payload.entrypoint = __filename;
payload.parseArgvResult.argv = process.argv;
payload.parseArgvResult.restArgs = process.argv.slice(3);
(0, bin_1.bootstrap)(payload);
//# sourceMappingURL=child-entrypoint.js.map