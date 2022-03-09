#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.nextInfo = void 0;
var _os = _interopRequireDefault(require("os"));
var _childProcess = _interopRequireDefault(require("child_process"));
var _chalk = _interopRequireDefault(require("next/dist/compiled/chalk"));
var _indexJs = _interopRequireDefault(require("next/dist/compiled/arg/index.js"));
var _nodeFetch = _interopRequireDefault(require("next/dist/compiled/node-fetch"));
var _utils = require("../server/lib/utils");
var _isError = _interopRequireDefault(require("../lib/is-error"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const nextInfo = async (argv)=>{
    const validArgs = {
        // Types
        '--help': Boolean,
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
        Prints relevant details about the current system which can be used to report Next.js bugs
        
      Usage
        $ next info

      Learn more: ${_chalk.default.cyan('https://nextjs.org/docs/api-reference/cli#info')}`);
        return;
    }
    const installedRelease = getPackageVersion('next');
    console.log(`
    Operating System:
      Platform: ${_os.default.platform()}
      Arch: ${_os.default.arch()}
      Version: ${_os.default.version()}
    Binaries:
      Node: ${process.versions.node}
      npm: ${getBinaryVersion('npm')}
      Yarn: ${getBinaryVersion('yarn')}
      pnpm: ${getBinaryVersion('pnpm')}
    Relevant packages:
      next: ${installedRelease}
      react: ${getPackageVersion('react')}
      react-dom: ${getPackageVersion('react-dom')}
`);
    try {
        const res = await (0, _nodeFetch).default('https://api.github.com/repos/vercel/next.js/releases');
        const releases = await res.json();
        const newestRelease = releases[0].tag_name.replace(/^v/, '');
        if (installedRelease !== newestRelease) {
            console.warn(`${_chalk.default.yellow(_chalk.default.bold('warn'))}  - Latest canary version not detected, detected: "${installedRelease}", newest: "${newestRelease}".
        Please try the latest canary version (\`npm install next@canary\`) to confirm the issue still exists before creating a new issue.
        Read more - https://nextjs.org/docs/messages/opening-an-issue`);
        }
    } catch  {
        console.warn(`${_chalk.default.yellow(_chalk.default.bold('warn'))}  - Failed to fetch latest canary version. Visit https://github.com/vercel/next.js/releases. Detected "${installedRelease}".
      Make sure to try the latest canary version (\`npm install next@canary\`) to confirm the issue still exists before creating a new issue.
      Read more - https://nextjs.org/docs/messages/opening-an-issue`);
    }
};
exports.nextInfo = nextInfo;
function getPackageVersion(packageName) {
    try {
        return require(`${packageName}/package.json`).version;
    } catch  {
        return 'N/A';
    }
}
function getBinaryVersion(binaryName) {
    try {
        return _childProcess.default.execSync(`${binaryName} --version`).toString().trim();
    } catch  {
        return 'N/A';
    }
}

//# sourceMappingURL=next-info.js.map