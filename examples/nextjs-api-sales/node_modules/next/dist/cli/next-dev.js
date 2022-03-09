#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.nextDev = void 0;
var _indexJs = _interopRequireDefault(require("next/dist/compiled/arg/index.js"));
var _fs = require("fs");
var _startServer = require("../server/lib/start-server");
var _utils = require("../server/lib/utils");
var Log = _interopRequireWildcard(require("../build/output/log"));
var _output = require("../build/output");
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
const nextDev = (argv)=>{
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
        Starts the application in development mode (hot-code reloading, error
        reporting, etc.)

      Usage
        $ next dev <dir> -p <port number>

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
    // Check if pages dir exists and warn if not
    if (!(0, _fs).existsSync(dir)) {
        (0, _utils).printAndExit(`> No such directory exists as the project root: ${dir}`);
    }
    async function preflight() {
        const { getPackageVersion  } = await Promise.resolve(require('../lib/get-package-version'));
        const [sassVersion, nodeSassVersion] = await Promise.all([
            getPackageVersion({
                cwd: dir,
                name: 'sass'
            }),
            getPackageVersion({
                cwd: dir,
                name: 'node-sass'
            }), 
        ]);
        if (sassVersion && nodeSassVersion) {
            Log.warn('Your project has both `sass` and `node-sass` installed as dependencies, but should only use one or the other. ' + 'Please remove the `node-sass` dependency from your project. ' + ' Read more: https://nextjs.org/docs/messages/duplicate-sass');
        }
    }
    const allowRetry = !args['--port'];
    let port = args['--port'] || process.env.PORT && parseInt(process.env.PORT) || 3000;
    // we allow the server to use a random port while testing
    // instead of attempting to find a random port and then hope
    // it doesn't become occupied before we leverage it
    if (process.env.__NEXT_RAND_PORT) {
        port = 0;
    }
    // We do not set a default host value here to prevent breaking
    // some set-ups that rely on listening on other interfaces
    const host = args['--hostname'];
    (0, _startServer).startServer({
        allowRetry,
        dev: true,
        dir,
        hostname: host,
        isNextDevCommand: true,
        port
    }).then(async (app)=>{
        const appUrl = `http://${app.hostname}:${app.port}`;
        (0, _output).startedDevelopmentServer(appUrl, `${host || '0.0.0.0'}:${app.port}`);
        // Start preflight after server is listening and ignore errors:
        preflight().catch(()=>{
        });
        // Finalize server bootup:
        await app.prepare();
    }).catch((err)=>{
        if (err.code === 'EADDRINUSE') {
            let errorMessage = `Port ${port} is already in use.`;
            const pkgAppPath = require('next/dist/compiled/find-up').sync('package.json', {
                cwd: dir
            });
            const appPackage = require(pkgAppPath);
            if (appPackage.scripts) {
                const nextScript = Object.entries(appPackage.scripts).find((scriptLine)=>scriptLine[1] === 'next'
                );
                if (nextScript) {
                    errorMessage += `\nUse \`npm run ${nextScript[0]} -- -p <some other port>\`.`;
                }
            }
            console.error(errorMessage);
        } else {
            console.error(err);
        }
        process.nextTick(()=>process.exit(1)
        );
    });
};
exports.nextDev = nextDev;

//# sourceMappingURL=next-dev.js.map