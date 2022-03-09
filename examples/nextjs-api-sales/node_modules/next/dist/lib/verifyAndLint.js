"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.verifyAndLint = verifyAndLint;
var _chalk = _interopRequireDefault(require("next/dist/compiled/chalk"));
var _jestWorker = require("next/dist/compiled/jest-worker");
var _fs = require("fs");
var _path = require("path");
var _constants = require("./constants");
var _events = require("../telemetry/events");
var _compileError = require("./compile-error");
var _isError = _interopRequireDefault(require("./is-error"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function verifyAndLint(dir, cacheLocation, configLintDirs, numWorkers, enableWorkerThreads, telemetry) {
    try {
        const lintWorkers = new _jestWorker.Worker(require.resolve('./eslint/runLintCheck'), {
            numWorkers,
            enableWorkerThreads
        });
        lintWorkers.getStdout().pipe(process.stdout);
        lintWorkers.getStderr().pipe(process.stderr);
        const lintDirs = (configLintDirs !== null && configLintDirs !== void 0 ? configLintDirs : _constants.ESLINT_DEFAULT_DIRS).reduce((res, d)=>{
            const currDir = (0, _path).join(dir, d);
            if (!(0, _fs).existsSync(currDir)) return res;
            res.push(currDir);
            return res;
        }, []);
        const lintResults = await lintWorkers.runLintCheck(dir, lintDirs, true, {
            cacheLocation
        });
        const lintOutput = typeof lintResults === 'string' ? lintResults : lintResults === null || lintResults === void 0 ? void 0 : lintResults.output;
        if (typeof lintResults !== 'string' && (lintResults === null || lintResults === void 0 ? void 0 : lintResults.eventInfo)) {
            telemetry.record((0, _events).eventLintCheckCompleted({
                ...lintResults.eventInfo,
                buildLint: true
            }));
        }
        if (typeof lintResults !== 'string' && (lintResults === null || lintResults === void 0 ? void 0 : lintResults.isError) && lintOutput) {
            await telemetry.flush();
            throw new _compileError.CompileError(lintOutput);
        }
        if (lintOutput) {
            console.log(lintOutput);
        }
        lintWorkers.end();
    } catch (err) {
        if ((0, _isError).default(err)) {
            if (err.type === 'CompileError' || err instanceof _compileError.CompileError) {
                console.error(_chalk.default.red('\nFailed to compile.'));
                console.error(err.message);
                process.exit(1);
            } else if (err.type === 'FatalError') {
                console.error(err.message);
                process.exit(1);
            }
        }
        throw err;
    }
}

//# sourceMappingURL=verifyAndLint.js.map