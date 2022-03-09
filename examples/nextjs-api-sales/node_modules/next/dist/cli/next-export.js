#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.nextExport = void 0;
var _path = require("path");
var _fs = require("fs");
var _indexJs = _interopRequireDefault(require("next/dist/compiled/arg/index.js"));
var _export = _interopRequireDefault(require("../export"));
var _utils = require("../server/lib/utils");
var _trace = require("../trace");
var _isError = _interopRequireDefault(require("../lib/is-error"));
var _getProjectDir = require("../lib/get-project-dir");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const nextExport = (argv)=>{
    const nextExportCliSpan = (0, _trace).trace('next-export-cli');
    const validArgs = {
        // Types
        '--help': Boolean,
        '--silent': Boolean,
        '--outdir': String,
        '--threads': Number,
        // Aliases
        '-h': '--help',
        '-s': '--silent',
        '-o': '--outdir'
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
        Exports the application for production deployment

      Usage
        $ next export [options] <dir>

      <dir> represents the directory of the Next.js application.
      If no directory is provided, the current directory will be used.

      Options
        -h - list this help
        -o - set the output dir (defaults to 'out')
        -s - do not print any messages to console
    `);
        process.exit(0);
    }
    const dir = (0, _getProjectDir).getProjectDir(args._[0]);
    // Check if pages dir exists and warn if not
    if (!(0, _fs).existsSync(dir)) {
        (0, _utils).printAndExit(`> No such directory exists as the project root: ${dir}`);
    }
    const options = {
        silent: args['--silent'] || false,
        threads: args['--threads'],
        outdir: args['--outdir'] ? (0, _path).resolve(args['--outdir']) : (0, _path).join(dir, 'out')
    };
    (0, _export).default(dir, options, nextExportCliSpan).then(()=>{
        nextExportCliSpan.stop();
        (0, _utils).printAndExit(`Export successful. Files written to ${options.outdir}`, 0);
    }).catch((err)=>{
        nextExportCliSpan.stop();
        (0, _utils).printAndExit(err);
    });
};
exports.nextExport = nextExport;

//# sourceMappingURL=next-export.js.map