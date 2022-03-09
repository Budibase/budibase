"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.runTypeCheck = runTypeCheck;
var _path = _interopRequireDefault(require("path"));
var _diagnosticFormatter = require("./diagnosticFormatter");
var _getTypeScriptConfiguration = require("./getTypeScriptConfiguration");
var _writeConfigurationDefaults = require("./writeConfigurationDefaults");
var _compileError = require("../compile-error");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function runTypeCheck(ts, baseDir, tsConfigPath, cacheDir) {
    const effectiveConfiguration = await (0, _getTypeScriptConfiguration).getTypeScriptConfiguration(ts, tsConfigPath);
    if (effectiveConfiguration.fileNames.length < 1) {
        return {
            hasWarnings: false,
            inputFilesCount: 0,
            totalFilesCount: 0,
            incremental: false
        };
    }
    const requiredConfig = (0, _writeConfigurationDefaults).getRequiredConfiguration(ts);
    const options = {
        ...effectiveConfiguration.options,
        ...requiredConfig,
        noEmit: true
    };
    let program;
    let incremental = false;
    if (options.incremental && cacheDir) {
        incremental = true;
        program = ts.createIncrementalProgram({
            rootNames: effectiveConfiguration.fileNames,
            options: {
                ...options,
                incremental: true,
                tsBuildInfoFile: _path.default.join(cacheDir, '.tsbuildinfo')
            }
        });
    } else {
        program = ts.createProgram(effectiveConfiguration.fileNames, options);
    }
    const result = program.emit();
    // Intended to match:
    // - pages/test.js
    // - pages/apples.test.js
    // - pages/__tests__/a.js
    //
    // But not:
    // - pages/contest.js
    // - pages/other.js
    // - pages/test/a.js
    //
    const regexIgnoredFile = /[\\/]__(?:tests|mocks)__[\\/]|(?<=[\\/.])(?:spec|test)\.[^\\/]+$/;
    const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(result.diagnostics).filter((d)=>!(d.file && regexIgnoredFile.test(d.file.fileName))
    );
    var ref;
    const firstError = (ref = allDiagnostics.find((d)=>d.category === _diagnosticFormatter.DiagnosticCategory.Error && Boolean(d.file)
    )) !== null && ref !== void 0 ? ref : allDiagnostics.find((d)=>d.category === _diagnosticFormatter.DiagnosticCategory.Error
    );
    if (firstError) {
        throw new _compileError.CompileError(await (0, _diagnosticFormatter).getFormattedDiagnostic(ts, baseDir, firstError));
    }
    const warnings = await Promise.all(allDiagnostics.filter((d)=>d.category === _diagnosticFormatter.DiagnosticCategory.Warning
    ).map((d)=>(0, _diagnosticFormatter).getFormattedDiagnostic(ts, baseDir, d)
    ));
    return {
        hasWarnings: true,
        warnings,
        inputFilesCount: effectiveConfiguration.fileNames.length,
        totalFilesCount: program.getSourceFiles().length,
        incremental
    };
}

//# sourceMappingURL=runTypeCheck.js.map