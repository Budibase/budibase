#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.nextLint = void 0;
var _fs = require("fs");
var _indexJs = _interopRequireDefault(require("next/dist/compiled/arg/index.js"));
var _path = require("path");
var _chalk = _interopRequireDefault(require("next/dist/compiled/chalk"));
var _constants = require("../lib/constants");
var _runLintCheck = require("../lib/eslint/runLintCheck");
var _utils = require("../server/lib/utils");
var _storage = require("../telemetry/storage");
var _config = _interopRequireDefault(require("../server/config"));
var _constants1 = require("../shared/lib/constants");
var _events = require("../telemetry/events");
var _compileError = require("../lib/compile-error");
var _isError = _interopRequireDefault(require("../lib/is-error"));
var _getProjectDir = require("../lib/get-project-dir");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var ref11, ref1, ref2, ref3;
const eslintOptions = (args, defaultCacheLocation)=>({
        overrideConfigFile: args['--config'] || null,
        extensions: (ref11 = args['--ext']) !== null && ref11 !== void 0 ? ref11 : [
            '.js',
            '.jsx',
            '.ts',
            '.tsx'
        ],
        resolvePluginsRelativeTo: args['--resolve-plugins-relative-to'] || null,
        rulePaths: (ref1 = args['--rulesdir']) !== null && ref1 !== void 0 ? ref1 : [],
        fix: (ref2 = args['--fix']) !== null && ref2 !== void 0 ? ref2 : false,
        fixTypes: (ref3 = args['--fix-type']) !== null && ref3 !== void 0 ? ref3 : null,
        ignorePath: args['--ignore-path'] || null,
        ignore: !Boolean(args['--no-ignore']),
        allowInlineConfig: !Boolean(args['--no-inline-config']),
        reportUnusedDisableDirectives: args['--report-unused-disable-directives'] || null,
        cache: !Boolean(args['--no-cache']),
        cacheLocation: args['--cache-location'] || defaultCacheLocation,
        cacheStrategy: args['--cache-strategy'] || 'metadata',
        errorOnUnmatchedPattern: args['--error-on-unmatched-pattern'] ? Boolean(args['--error-on-unmatched-pattern']) : false
    })
;
const nextLint = async (argv)=>{
    var ref;
    const validArgs = {
        // Types
        '--help': Boolean,
        '--base-dir': String,
        '--dir': [
            String
        ],
        '--file': [
            String
        ],
        '--strict': Boolean,
        // Aliases
        '-h': '--help',
        '-b': '--base-dir',
        '-d': '--dir'
    };
    const validEslintArgs = {
        // Types
        '--config': String,
        '--ext': [
            String
        ],
        '--resolve-plugins-relative-to': String,
        '--rulesdir': [
            String
        ],
        '--fix': Boolean,
        '--fix-type': [
            String
        ],
        '--ignore-path': String,
        '--no-ignore': Boolean,
        '--quiet': Boolean,
        '--max-warnings': Number,
        '--no-inline-config': Boolean,
        '--report-unused-disable-directives': String,
        '--cache': Boolean,
        '--no-cache': Boolean,
        '--cache-location': String,
        '--cache-strategy': String,
        '--error-on-unmatched-pattern': Boolean,
        '--format': String,
        // Aliases
        '-c': '--config',
        '-f': '--format'
    };
    let args;
    try {
        args = (0, _indexJs).default({
            ...validArgs,
            ...validEslintArgs
        }, {
            argv
        });
    } catch (error) {
        if ((0, _isError).default(error) && error.code === 'ARG_UNKNOWN_OPTION') {
            return (0, _utils).printAndExit(error.message, 1);
        }
        throw error;
    }
    if (args['--help']) {
        (0, _utils).printAndExit(`
      Description
        Run ESLint on every file in specified directories. 
        If not configured, ESLint will be set up for the first time.

      Usage
        $ next lint <baseDir> [options]      

      <baseDir> represents the directory of the Next.js application.
      If no directory is provided, the current directory will be used.

      Options
        Basic configuration:
          -h, --help                     List this help
          -d, --dir Array                Include directory, or directories, to run ESLint - default: 'pages', 'components', and 'lib'
          --file Array                   Include file, or files, to run ESLint
          -c, --config path::String      Use this configuration file, overriding all other config options
          --ext [String]                 Specify JavaScript file extensions - default: .js, .jsx, .ts, .tsx
          --resolve-plugins-relative-to path::String  A folder where plugins should be resolved from, CWD by default

        Initial setup:
          --strict                       Creates an .eslintrc.json file using the Next.js strict configuration (only possible if no .eslintrc.json file is present)

        Specifying rules:
          --rulesdir [path::String]      Use additional rules from this directory

        Fixing problems:
          --fix                          Automatically fix problems
          --fix-type Array               Specify the types of fixes to apply (problem, suggestion, layout)

        Ignoring files:
          --ignore-path path::String     Specify path of ignore file
          --no-ignore                    Disable use of ignore files and patterns

        Handling warnings:
          --quiet                        Report errors only - default: false
          --max-warnings Int             Number of warnings to trigger nonzero exit code - default: -1
        
        Output:
          -f, --format String            Use a specific output format - default: Next.js custom formatter

        Inline configuration comments:
          --no-inline-config             Prevent comments from changing config or rules
          --report-unused-disable-directives  Adds reported errors for unused eslint-disable directives ("error" | "warn" | "off")

        Caching:
          --no-cache                     Disable caching
          --cache-location path::String  Path to the cache file or directory - default: .eslintcache
          --cache-strategy String        Strategy to use for detecting changed files in the cache, either metadata or content - default: metadata
        
        Miscellaneous:
          --error-on-unmatched-pattern   Show errors when any file patterns are unmatched - default: false
          `, 0);
    }
    const baseDir = (0, _getProjectDir).getProjectDir(args._[0]);
    // Check if the provided directory exists
    if (!(0, _fs).existsSync(baseDir)) {
        (0, _utils).printAndExit(`> No such directory exists as the project root: ${baseDir}`);
    }
    const nextConfig = await (0, _config).default(_constants1.PHASE_PRODUCTION_BUILD, baseDir);
    var ref7;
    const files = (ref7 = args['--file']) !== null && ref7 !== void 0 ? ref7 : [];
    var ref8;
    const dirs = (ref8 = args['--dir']) !== null && ref8 !== void 0 ? ref8 : (ref = nextConfig.eslint) === null || ref === void 0 ? void 0 : ref.dirs;
    const filesToLint = [
        ...dirs !== null && dirs !== void 0 ? dirs : [],
        ...files
    ];
    const pathsToLint = (filesToLint.length ? filesToLint : _constants.ESLINT_DEFAULT_DIRS).reduce((res, d)=>{
        const currDir = (0, _path).join(baseDir, d);
        if (!(0, _fs).existsSync(currDir)) return res;
        res.push(currDir);
        return res;
    }, []);
    const reportErrorsOnly = Boolean(args['--quiet']);
    var ref27;
    const maxWarnings = (ref27 = args['--max-warnings']) !== null && ref27 !== void 0 ? ref27 : -1;
    const formatter = args['--format'] || null;
    const strict = Boolean(args['--strict']);
    const distDir = (0, _path).join(baseDir, nextConfig.distDir);
    const defaultCacheLocation = (0, _path).join(distDir, 'cache', 'eslint/');
    (0, _runLintCheck).runLintCheck(baseDir, pathsToLint, false, eslintOptions(args, defaultCacheLocation), reportErrorsOnly, maxWarnings, formatter, strict).then(async (lintResults)=>{
        const lintOutput = typeof lintResults === 'string' ? lintResults : lintResults === null || lintResults === void 0 ? void 0 : lintResults.output;
        if (typeof lintResults !== 'string' && (lintResults === null || lintResults === void 0 ? void 0 : lintResults.eventInfo)) {
            const telemetry = new _storage.Telemetry({
                distDir
            });
            telemetry.record((0, _events).eventLintCheckCompleted({
                ...lintResults.eventInfo,
                buildLint: false
            }));
            await telemetry.flush();
        }
        if (typeof lintResults !== 'string' && (lintResults === null || lintResults === void 0 ? void 0 : lintResults.isError) && lintOutput) {
            throw new _compileError.CompileError(lintOutput);
        }
        if (lintOutput) {
            (0, _utils).printAndExit(lintOutput, 0);
        } else if (lintResults && !lintOutput) {
            (0, _utils).printAndExit(_chalk.default.green('✔ No ESLint warnings or errors'), 0);
        }
    }).catch((err)=>{
        (0, _utils).printAndExit(err.message);
    });
};
exports.nextLint = nextLint;

//# sourceMappingURL=next-lint.js.map