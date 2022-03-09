"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getRequiredConfiguration = getRequiredConfiguration;
exports.writeConfigurationDefaults = writeConfigurationDefaults;
var _fs = require("fs");
var _chalk = _interopRequireDefault(require("next/dist/compiled/chalk"));
var CommentJson = _interopRequireWildcard(require("next/dist/compiled/comment-json"));
var _semver = _interopRequireDefault(require("next/dist/compiled/semver"));
var _os = _interopRequireDefault(require("os"));
var _getTypeScriptConfiguration = require("./getTypeScriptConfiguration");
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
function getDesiredCompilerOptions(ts) {
    const o = {
        // These are suggested values and will be set when not present in the
        // tsconfig.json
        target: {
            suggested: 'es5'
        },
        lib: {
            suggested: [
                'dom',
                'dom.iterable',
                'esnext'
            ]
        },
        allowJs: {
            suggested: true
        },
        skipLibCheck: {
            suggested: true
        },
        strict: {
            suggested: false
        },
        forceConsistentCasingInFileNames: {
            suggested: true
        },
        noEmit: {
            suggested: true
        },
        ..._semver.default.gte(ts.version, '4.4.2') ? {
            incremental: {
                suggested: true
            }
        } : undefined,
        // These values are required and cannot be changed by the user
        // Keep this in sync with the webpack config
        // 'parsedValue' matches the output value from ts.parseJsonConfigFileContent()
        esModuleInterop: {
            value: true,
            reason: 'requirement for SWC / babel'
        },
        module: {
            parsedValue: ts.ModuleKind.ESNext,
            // All of these values work:
            parsedValues: [
                ts.ModuleKind.ES2020,
                ts.ModuleKind.ESNext,
                ts.ModuleKind.CommonJS,
                ts.ModuleKind.AMD, 
            ],
            value: 'esnext',
            reason: 'for dynamic import() support'
        },
        moduleResolution: {
            parsedValue: ts.ModuleResolutionKind.NodeJs,
            value: 'node',
            reason: 'to match webpack resolution'
        },
        resolveJsonModule: {
            value: true,
            reason: 'to match webpack resolution'
        },
        isolatedModules: {
            value: true,
            reason: 'requirement for SWC / Babel'
        },
        jsx: {
            parsedValue: ts.JsxEmit.Preserve,
            value: 'preserve',
            reason: 'next.js implements its own optimized jsx transform'
        }
    };
    return o;
}
function getRequiredConfiguration(ts) {
    const res = {
    };
    const desiredCompilerOptions = getDesiredCompilerOptions(ts);
    for (const optionKey of Object.keys(desiredCompilerOptions)){
        const ev = desiredCompilerOptions[optionKey];
        if (!('value' in ev)) {
            continue;
        }
        var _parsedValue;
        res[optionKey] = (_parsedValue = ev.parsedValue) !== null && _parsedValue !== void 0 ? _parsedValue : ev.value;
    }
    return res;
}
async function writeConfigurationDefaults(ts, tsConfigPath, isFirstTimeSetup) {
    if (isFirstTimeSetup) {
        await _fs.promises.writeFile(tsConfigPath, '{}' + _os.default.EOL);
    }
    const desiredCompilerOptions = getDesiredCompilerOptions(ts);
    const { options: tsOptions , raw: rawConfig  } = await (0, _getTypeScriptConfiguration).getTypeScriptConfiguration(ts, tsConfigPath, true);
    const userTsConfigContent = await _fs.promises.readFile(tsConfigPath, {
        encoding: 'utf8'
    });
    const userTsConfig = CommentJson.parse(userTsConfigContent);
    if (userTsConfig.compilerOptions == null && !('extends' in rawConfig)) {
        userTsConfig.compilerOptions = {
        };
        isFirstTimeSetup = true;
    }
    const suggestedActions = [];
    const requiredActions = [];
    for (const optionKey of Object.keys(desiredCompilerOptions)){
        const check = desiredCompilerOptions[optionKey];
        if ('suggested' in check) {
            if (!(optionKey in tsOptions)) {
                if (!userTsConfig.compilerOptions) {
                    userTsConfig.compilerOptions = {
                    };
                }
                userTsConfig.compilerOptions[optionKey] = check.suggested;
                suggestedActions.push(_chalk.default.cyan(optionKey) + ' was set to ' + _chalk.default.bold(check.suggested));
            }
        } else if ('value' in check) {
            var ref;
            const ev = tsOptions[optionKey];
            if (!('parsedValues' in check ? (ref = check.parsedValues) === null || ref === void 0 ? void 0 : ref.includes(ev) : 'parsedValue' in check ? check.parsedValue === ev : check.value === ev)) {
                if (!userTsConfig.compilerOptions) {
                    userTsConfig.compilerOptions = {
                    };
                }
                userTsConfig.compilerOptions[optionKey] = check.value;
                requiredActions.push(_chalk.default.cyan(optionKey) + ' was set to ' + _chalk.default.bold(check.value) + ` (${check.reason})`);
            }
        } else {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const _ = check;
        }
    }
    if (!('include' in rawConfig)) {
        userTsConfig.include = [
            'next-env.d.ts',
            '**/*.ts',
            '**/*.tsx'
        ];
        suggestedActions.push(_chalk.default.cyan('include') + ' was set to ' + _chalk.default.bold(`['next-env.d.ts', '**/*.ts', '**/*.tsx']`));
    }
    if (!('exclude' in rawConfig)) {
        userTsConfig.exclude = [
            'node_modules'
        ];
        suggestedActions.push(_chalk.default.cyan('exclude') + ' was set to ' + _chalk.default.bold(`['node_modules']`));
    }
    if (suggestedActions.length < 1 && requiredActions.length < 1) {
        return;
    }
    await _fs.promises.writeFile(tsConfigPath, CommentJson.stringify(userTsConfig, null, 2) + _os.default.EOL);
    if (isFirstTimeSetup) {
        console.log(_chalk.default.green(`We detected TypeScript in your project and created a ${_chalk.default.bold('tsconfig.json')} file for you.`) + '\n');
        return;
    }
    console.log(_chalk.default.green(`We detected TypeScript in your project and reconfigured your ${_chalk.default.bold('tsconfig.json')} file for you. Strict-mode is set to ${_chalk.default.bold('false')} by default.`) + '\n');
    if (suggestedActions.length) {
        console.log(`The following suggested values were added to your ${_chalk.default.cyan('tsconfig.json')}. These values ${_chalk.default.bold('can be changed')} to fit your project's needs:\n`);
        suggestedActions.forEach((action)=>console.log(`\t- ${action}`)
        );
        console.log('');
    }
    if (requiredActions.length) {
        console.log(`The following ${_chalk.default.bold('mandatory changes')} were made to your ${_chalk.default.cyan('tsconfig.json')}:\n`);
        requiredActions.forEach((action)=>console.log(`\t- ${action}`)
        );
        console.log('');
    }
}

//# sourceMappingURL=writeConfigurationDefaults.js.map