"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.runLintCheck = runLintCheck;
var _fs = require("fs");
var _chalk = _interopRequireDefault(require("next/dist/compiled/chalk"));
var _path = _interopRequireDefault(require("path"));
var _findUp = _interopRequireDefault(require("next/dist/compiled/find-up"));
var _semver = _interopRequireDefault(require("next/dist/compiled/semver"));
var CommentJson = _interopRequireWildcard(require("next/dist/compiled/comment-json"));
var _customFormatter = require("./customFormatter");
var _writeDefaultConfig = require("./writeDefaultConfig");
var _hasEslintConfiguration = require("./hasEslintConfiguration");
var _constants = require("../constants");
var _findPagesDir = require("../find-pages-dir");
var _installDependencies = require("../install-dependencies");
var _hasNecessaryDependencies = require("../has-necessary-dependencies");
var _isYarn = require("../is-yarn");
var Log = _interopRequireWildcard(require("../../build/output/log"));
var _isError = _interopRequireWildcard(require("../is-error"));
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
const requiredPackages = [
    {
        file: 'eslint',
        pkg: 'eslint'
    },
    {
        file: 'eslint-config-next',
        pkg: 'eslint-config-next'
    }, 
];
async function cliPrompt() {
    console.log(_chalk.default.bold(`${_chalk.default.cyan('?')} How would you like to configure ESLint? https://nextjs.org/docs/basic-features/eslint`));
    try {
        const cliSelect = (await Promise.resolve(require('next/dist/compiled/cli-select'))).default;
        const { value  } = await cliSelect({
            values: _constants.ESLINT_PROMPT_VALUES,
            valueRenderer: ({ title , recommended  }, selected)=>{
                const name = selected ? _chalk.default.bold.underline.cyan(title) : title;
                return name + (recommended ? _chalk.default.bold.yellow(' (recommended)') : '');
            },
            selected: _chalk.default.cyan('❯ '),
            unselected: '  '
        });
        return {
            config: value === null || value === void 0 ? void 0 : value.config
        };
    } catch  {
        return {
            config: null
        };
    }
}
async function lint(baseDir, lintDirs, eslintrcFile, pkgJsonPath, lintDuringBuild = false, eslintOptions = null, reportErrorsOnly = false, maxWarnings = -1, formatter = null) {
    try {
        var ref11, ref1;
        // Load ESLint after we're sure it exists:
        const deps = await (0, _hasNecessaryDependencies).hasNecessaryDependencies(baseDir, requiredPackages);
        if (deps.missing.some((dep)=>dep.pkg === 'eslint'
        )) {
            Log.error(`ESLint must be installed${lintDuringBuild ? ' in order to run during builds:' : ':'} ${_chalk.default.bold.cyan(await (0, _isYarn).isYarn(baseDir) ? 'yarn add --dev eslint' : 'npm install --save-dev eslint')}`);
            return null;
        }
        const mod = await Promise.resolve(require(deps.resolved.get('eslint')));
        const { ESLint  } = mod;
        var ref2;
        let eslintVersion = (ref2 = ESLint === null || ESLint === void 0 ? void 0 : ESLint.version) !== null && ref2 !== void 0 ? ref2 : mod === null || mod === void 0 ? void 0 : (ref11 = mod.CLIEngine) === null || ref11 === void 0 ? void 0 : ref11.version;
        if (!eslintVersion || _semver.default.lt(eslintVersion, '7.0.0')) {
            return `${_chalk.default.red('error')} - Your project has an older version of ESLint installed${eslintVersion ? ' (' + eslintVersion + ')' : ''}. Please upgrade to ESLint version 7 or above`;
        }
        let options = {
            useEslintrc: true,
            baseConfig: {
            },
            errorOnUnmatchedPattern: false,
            extensions: [
                '.js',
                '.jsx',
                '.ts',
                '.tsx'
            ],
            cache: true,
            ...eslintOptions
        };
        let eslint = new ESLint(options);
        let nextEslintPluginIsEnabled = false;
        const pagesDirRules = [
            '@next/next/no-html-link-for-pages'
        ];
        for (const configFile of [
            eslintrcFile,
            pkgJsonPath
        ]){
            var ref9;
            if (!configFile) continue;
            const completeConfig = await eslint.calculateConfigForFile(configFile);
            if ((ref9 = completeConfig.plugins) === null || ref9 === void 0 ? void 0 : ref9.includes('@next/next')) {
                nextEslintPluginIsEnabled = true;
                break;
            }
        }
        const pagesDir = (0, _findPagesDir).findPagesDir(baseDir);
        if (nextEslintPluginIsEnabled) {
            let updatedPagesDir = false;
            for (const rule of pagesDirRules){
                var ref, ref9;
                if (!((ref = options.baseConfig.rules) === null || ref === void 0 ? void 0 : ref[rule]) && !((ref9 = options.baseConfig.rules) === null || ref9 === void 0 ? void 0 : ref9[rule.replace('@next/next', '@next/babel-plugin-next')])) {
                    if (!options.baseConfig.rules) {
                        options.baseConfig.rules = {
                        };
                    }
                    options.baseConfig.rules[rule] = [
                        1,
                        pagesDir
                    ];
                    updatedPagesDir = true;
                }
            }
            if (updatedPagesDir) {
                eslint = new ESLint(options);
            }
        } else {
            Log.warn('The Next.js plugin was not detected in your ESLint configuration. See https://nextjs.org/docs/basic-features/eslint#migrating-existing-config');
        }
        const lintStart = process.hrtime();
        let results = await eslint.lintFiles(lintDirs);
        let selectedFormatter = null;
        if (options.fix) await ESLint.outputFixes(results);
        if (reportErrorsOnly) results = await ESLint.getErrorResults(results) // Only return errors if --quiet flag is used
        ;
        if (formatter) selectedFormatter = await eslint.loadFormatter(formatter);
        const formattedResult = (0, _customFormatter).formatResults(baseDir, results, selectedFormatter === null || selectedFormatter === void 0 ? void 0 : selectedFormatter.format);
        const lintEnd = process.hrtime(lintStart);
        const totalWarnings = results.reduce((sum, file)=>sum + file.warningCount
        , 0);
        return {
            output: formattedResult.output,
            isError: ((ref1 = ESLint.getErrorResults(results)) === null || ref1 === void 0 ? void 0 : ref1.length) > 0 || maxWarnings >= 0 && totalWarnings > maxWarnings,
            eventInfo: {
                durationInSeconds: lintEnd[0],
                eslintVersion: eslintVersion,
                lintedFilesCount: results.length,
                lintFix: !!options.fix,
                nextEslintPluginVersion: nextEslintPluginIsEnabled && deps.resolved.has('eslint-config-next') ? require(_path.default.join(_path.default.dirname(deps.resolved.get('eslint-config-next')), 'package.json')).version : null,
                nextEslintPluginErrorsCount: formattedResult.totalNextPluginErrorCount,
                nextEslintPluginWarningsCount: formattedResult.totalNextPluginWarningCount
            }
        };
    } catch (err) {
        if (lintDuringBuild) {
            Log.error(`ESLint: ${(0, _isError).default(err) && err.message ? err.message.replace(/\n/g, ' ') : err}`);
            return null;
        } else {
            throw (0, _isError).getProperError(err);
        }
    }
}
async function runLintCheck(baseDir, lintDirs, lintDuringBuild = false, eslintOptions = null, reportErrorsOnly = false, maxWarnings = -1, formatter = null, strict = false) {
    try {
        var ref;
        // Find user's .eslintrc file
        const eslintrcFile = (ref = await (0, _findUp).default([
            '.eslintrc.js',
            '.eslintrc.yaml',
            '.eslintrc.yml',
            '.eslintrc.json',
            '.eslintrc', 
        ], {
            cwd: baseDir
        })) !== null && ref !== void 0 ? ref : null;
        var ref3;
        const pkgJsonPath = (ref3 = await (0, _findUp).default('package.json', {
            cwd: baseDir
        })) !== null && ref3 !== void 0 ? ref3 : null;
        let packageJsonConfig = null;
        if (pkgJsonPath) {
            const pkgJsonContent = await _fs.promises.readFile(pkgJsonPath, {
                encoding: 'utf8'
            });
            packageJsonConfig = CommentJson.parse(pkgJsonContent);
        }
        const config = await (0, _hasEslintConfiguration).hasEslintConfiguration(eslintrcFile, packageJsonConfig);
        let deps;
        if (config.exists) {
            // Run if ESLint config exists
            return await lint(baseDir, lintDirs, eslintrcFile, pkgJsonPath, lintDuringBuild, eslintOptions, reportErrorsOnly, maxWarnings, formatter);
        } else {
            // Display warning if no ESLint configuration is present during "next build"
            if (lintDuringBuild) {
                Log.warn(`No ESLint configuration detected. Run ${_chalk.default.bold.cyan('next lint')} to begin setup`);
                return null;
            } else {
                // Ask user what config they would like to start with for first time "next lint" setup
                const { config: selectedConfig  } = strict ? _constants.ESLINT_PROMPT_VALUES.find((opt)=>opt.title === 'Strict'
                ) : await cliPrompt();
                if (selectedConfig == null) {
                    // Show a warning if no option is selected in prompt
                    Log.warn('If you set up ESLint yourself, we recommend adding the Next.js ESLint plugin. See https://nextjs.org/docs/basic-features/eslint#migrating-existing-config');
                    return null;
                } else {
                    // Check if necessary deps installed, and install any that are missing
                    deps = await (0, _hasNecessaryDependencies).hasNecessaryDependencies(baseDir, requiredPackages);
                    if (deps.missing.length > 0) await (0, _installDependencies).installDependencies(baseDir, deps.missing, true);
                    // Write default ESLint config.
                    // Check for /pages and src/pages is to make sure this happens in Next.js folder
                    if ((0, _findPagesDir).existsSync(_path.default.join(baseDir, 'pages')) || (0, _findPagesDir).existsSync(_path.default.join(baseDir, 'src/pages'))) {
                        await (0, _writeDefaultConfig).writeDefaultConfig(baseDir, config, selectedConfig, eslintrcFile, pkgJsonPath, packageJsonConfig);
                    }
                }
                Log.ready(`ESLint has successfully been configured. Run ${_chalk.default.bold.cyan('next lint')} again to view warnings and errors.`);
                return null;
            }
        }
    } catch (err) {
        throw err;
    }
}

//# sourceMappingURL=runLintCheck.js.map