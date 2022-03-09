"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.verifyTypeScriptSetup = verifyTypeScriptSetup;
var _chalk = _interopRequireDefault(require("next/dist/compiled/chalk"));
var _path = _interopRequireDefault(require("path"));
var _hasNecessaryDependencies = require("./has-necessary-dependencies");
var _semver = _interopRequireDefault(require("next/dist/compiled/semver"));
var _compileError = require("./compile-error");
var _fatalError = require("./fatal-error");
var log = _interopRequireWildcard(require("../build/output/log"));
var _getTypeScriptIntent = require("./typescript/getTypeScriptIntent");
var _writeAppTypeDeclarations = require("./typescript/writeAppTypeDeclarations");
var _writeConfigurationDefaults = require("./typescript/writeConfigurationDefaults");
var _missingDependencyError = require("./typescript/missingDependencyError");
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
        file: 'typescript',
        pkg: 'typescript'
    },
    {
        file: '@types/react/index.d.ts',
        pkg: '@types/react'
    },
    {
        file: '@types/node/index.d.ts',
        pkg: '@types/node'
    }, 
];
async function verifyTypeScriptSetup(dir, pagesDir, typeCheckPreflight, config, cacheDir) {
    const tsConfigPath = _path.default.join(dir, config.typescript.tsconfigPath);
    try {
        var ref;
        // Check if the project uses TypeScript:
        const intent = await (0, _getTypeScriptIntent).getTypeScriptIntent(dir, pagesDir, config);
        if (!intent) {
            return {
                version: null
            };
        }
        // Ensure TypeScript and necessary `@types/*` are installed:
        const deps = await (0, _hasNecessaryDependencies).hasNecessaryDependencies(dir, requiredPackages);
        if (((ref = deps.missing) === null || ref === void 0 ? void 0 : ref.length) > 0) {
            await (0, _missingDependencyError).missingDepsError(dir, deps.missing);
        }
        // Load TypeScript after we're sure it exists:
        const ts = await Promise.resolve(require(deps.resolved.get('typescript')));
        if (_semver.default.lt(ts.version, '4.3.2')) {
            log.warn(`Minimum recommended TypeScript version is v4.3.2, older versions can potentially be incompatible with Next.js. Detected: ${ts.version}`);
        }
        // Reconfigure (or create) the user's `tsconfig.json` for them:
        await (0, _writeConfigurationDefaults).writeConfigurationDefaults(ts, tsConfigPath, intent.firstTimeSetup);
        // Write out the necessary `next-env.d.ts` file to correctly register
        // Next.js' types:
        await (0, _writeAppTypeDeclarations).writeAppTypeDeclarations(dir, !config.images.disableStaticImages);
        let result;
        if (typeCheckPreflight) {
            const { runTypeCheck  } = require('./typescript/runTypeCheck');
            // Verify the project passes type-checking before we go to webpack phase:
            result = await runTypeCheck(ts, dir, tsConfigPath, cacheDir);
        }
        return {
            result,
            version: ts.version
        };
    } catch (err) {
        // These are special errors that should not show a stack trace:
        if (err instanceof _compileError.CompileError) {
            console.error(_chalk.default.red('Failed to compile.\n'));
            console.error(err.message);
            process.exit(1);
        } else if (err instanceof _fatalError.FatalError) {
            console.error(err.message);
            process.exit(1);
        }
        throw err;
    }
}

//# sourceMappingURL=verifyTypeScriptSetup.js.map