#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.nextStart = void 0;
var _indexJs = _interopRequireDefault(require("next/dist/compiled/arg/index.js"));
var _startServer = require("../server/lib/start-server");
var _utils = require("../server/lib/utils");
var Log = _interopRequireWildcard(require("../build/output/log"));
var _isError = _interopRequireDefault(require("../lib/is-error"));
var _getProjectDir = require("../lib/get-project-dir");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {
        };
        if (obj != null) {
            for(var key in obj){
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {
                    };
                    if (desc.get || desc.set) {
                        Object.defineProperty(newObj, key, desc);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
        }
        newObj.default = obj;
        return newObj;
    }
}
const nextStart = (argv)=>{
    const validArgs = {
        // Types
        '--help': Boolean,
        '--port': Number,
        '--hostname': String,
        // Aliases
        '-h': '--help',
        '-p': '--port',
        '-H': '--hostname'
    };
    let args;
    try {
        args = (0, _indexJs).default(validArgs, {
            argv
        });
    } catch (error) {
        if ((0, _isError).default(error) && error.code === 'ARG_UNKNOWN_OPTION') {
            return (0, _utils).printAndExit(error.message, 1);
        }
        throw error;
    }
    if (args['--help']) {
        console.log(`
      Description
        Starts the application in production mode.
        The application should be compiled with \`next build\` first.

      Usage
        $ next start <dir> -p <port>

      <dir> represents the directory of the Next.js application.
      If no directory is provided, the current directory will be used.

      Options
        --port, -p      A port number on which to start the application
        --hostname, -H  Hostname on which to start the application (default: 0.0.0.0)
        --help, -h      Displays this message
    `);
        process.exit(0);
    }
    const dir = (0, _getProjectDir).getProjectDir(args._[0]);
    let port = args['--port'] || process.env.PORT && parseInt(process.env.PORT) || 3000;
    const host = args['--hostname'] || '0.0.0.0';
    if (process.env.__NEXT_RAND_PORT) {
        port = 0;
    }
    (0, _startServer).startServer({
        dir,
        hostname: host,
        port
    }).then(async (app)=>{
        const appUrl = `http://${app.hostname}:${app.port}`;
        Log.ready(`started server on ${host}:${app.port}, url: ${appUrl}`);
        await app.prepare();
    }).catch((err)=>{
        console.error(err);
        process.exit(1);
    });
};
exports.nextStart = nextStart;

//# sourceMappingURL=next-start.js.map