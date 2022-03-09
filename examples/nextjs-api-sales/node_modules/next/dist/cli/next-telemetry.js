#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.nextTelemetry = void 0;
var _chalk = _interopRequireDefault(require("next/dist/compiled/chalk"));
var _indexJs = _interopRequireDefault(require("next/dist/compiled/arg/index.js"));
var _utils = require("../server/lib/utils");
var _storage = require("../telemetry/storage");
var _isError = _interopRequireDefault(require("../lib/is-error"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const nextTelemetry = (argv)=>{
    const validArgs = {
        // Types
        '--help': Boolean,
        '--enable': Boolean,
        '--disable': Boolean,
        // Aliases
        '-h': '--help'
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
        Allows you to control Next.js' telemetry collection

      Usage
        $ next telemetry [enable/disable]

      You may pass the 'enable' or 'disable' argument to turn Next.js' telemetry collection on or off.

      Learn more: ${_chalk.default.cyan('https://nextjs.org/telemetry')}
    `);
        return;
    }
    const telemetry = new _storage.Telemetry({
        distDir: process.cwd()
    });
    let isEnabled = telemetry.isEnabled;
    if (args['--enable'] || args._[0] === 'enable') {
        telemetry.setEnabled(true);
        console.log(_chalk.default.cyan('Success!'));
        console.log();
        isEnabled = true;
    } else if (args['--disable'] || args._[0] === 'disable') {
        const path = telemetry.setEnabled(false);
        if (isEnabled) {
            console.log(_chalk.default.cyan(`Your preference has been saved${path ? ` to ${path}` : ''}.`));
        } else {
            console.log(_chalk.default.yellow(`Next.js' telemetry collection is already disabled.`));
        }
        console.log();
        isEnabled = false;
    } else {
        console.log(_chalk.default.bold('Next.js Telemetry'));
        console.log();
    }
    console.log(`Status: ${isEnabled ? _chalk.default.bold.green('Enabled') : _chalk.default.bold.red('Disabled')}`);
    console.log();
    if (isEnabled) {
        console.log(`Next.js telemetry is completely anonymous. Thank you for participating!`);
    } else {
        console.log(`You have opted-out of Next.js' anonymous telemetry program.`);
        console.log(`No data will be collected from your machine.`);
    }
    console.log(`Learn more: https://nextjs.org/telemetry`);
    console.log();
};
exports.nextTelemetry = nextTelemetry;

//# sourceMappingURL=next-telemetry.js.map