import path from 'path';
import { createMatchPath, loadConfig, } from 'tsconfig-paths';
import { sync as globSync } from 'glob';
import isGlob from 'is-glob';
import { isCore, sync } from 'resolve';
import debug from 'debug';
const IMPORTER_NAME = 'eslint-import-resolver-typescript';
const log = debug(IMPORTER_NAME);
const defaultExtensions = [
    '.ts',
    '.tsx',
    '.d.ts',
    // eslint-disable-next-line node/no-deprecated-api, sonar/deprecation
    ...Object.keys(require.extensions),
    '.jsx',
];
export const interfaceVersion = 2;
/**
 * @param {string} source the module to resolve; i.e './some-module'
 * @param {string} file the importing file's full path; i.e. '/usr/local/bin/file.js'
 * @param {TsResolverOptions} options
 */
export function resolve(source, file, options) {
    var _a, _b;
    options = options !== null && options !== void 0 ? options : {};
    log('looking for:', source);
    source = removeQuerystring(source);
    // don't worry about core node modules
    if (isCore(source)) {
        log('matched core:', source);
        return {
            found: true,
            path: null,
        };
    }
    initMappers(options);
    const mappedPath = getMappedPath(source);
    if (mappedPath) {
        log('matched ts path:', mappedPath);
    }
    // note that even if we map the path, we still need to do a final resolve
    let foundNodePath;
    try {
        foundNodePath = tsResolve(mappedPath !== null && mappedPath !== void 0 ? mappedPath : source, Object.assign(Object.assign({}, options), { extensions: (_a = options.extensions) !== null && _a !== void 0 ? _a : defaultExtensions, basedir: path.dirname(path.resolve(file)), packageFilter: (_b = options.packageFilter) !== null && _b !== void 0 ? _b : packageFilterDefault }));
    }
    catch (_c) {
        foundNodePath = null;
    }
    // naive attempt at @types/* resolution,
    // if path is neither absolute nor relative
    if ((/\.jsx?$/.test(foundNodePath) ||
        (options.alwaysTryTypes && !foundNodePath)) &&
        !/^@types[/\\]/.test(source) &&
        !path.isAbsolute(source) &&
        !source.startsWith('.')) {
        const definitelyTyped = resolve('@types' + path.sep + mangleScopedPackage(source), file, options);
        if (definitelyTyped.found) {
            return definitelyTyped;
        }
    }
    if (foundNodePath) {
        log('matched node path:', foundNodePath);
        return {
            found: true,
            path: foundNodePath,
        };
    }
    log("didn't find ", source);
    return {
        found: false,
    };
}
function packageFilterDefault(pkg) {
    pkg.main =
        pkg.types || pkg.typings || pkg.module || pkg['jsnext:main'] || pkg.main;
    return pkg;
}
/**
 * Like `sync` from `resolve` package, but considers that the module id
 * could have a .js or .jsx extension.
 */
function tsResolve(id, opts) {
    try {
        return sync(id, opts);
    }
    catch (error) {
        const idWithoutJsExt = removeJsExtension(id);
        if (idWithoutJsExt !== id) {
            return sync(idWithoutJsExt, opts);
        }
        throw error;
    }
}
/** Remove any trailing querystring from module id. */
function removeQuerystring(id) {
    const querystringIndex = id.lastIndexOf('?');
    if (querystringIndex >= 0) {
        return id.slice(0, querystringIndex);
    }
    return id;
}
/** Remove .js or .jsx extension from module id. */
function removeJsExtension(id) {
    return id.replace(/\.jsx?$/, '');
}
let mappersBuildForOptions;
let mappers;
/**
 * @param {string} source the module to resolve; i.e './some-module'
 * @param {string} file the importing file's full path; i.e. '/usr/local/bin/file.js'
 * @returns The mapped path of the module or undefined
 */
function getMappedPath(source) {
    const paths = mappers.map(mapper => mapper(source)).filter(path => !!path);
    if (paths.length > 1) {
        log('found multiple matching ts paths:', paths);
    }
    return paths[0];
}
/**
 * Like `createMatchPath` from `tsconfig-paths` package, but considers
 * that the module id could have a .js or .jsx extension.
 */
const createExtendedMatchPath = (...createArgs) => {
    const matchPath = createMatchPath(...createArgs);
    return (id, ...otherArgs) => {
        const match = matchPath(id, ...otherArgs);
        if (match != null)
            return match;
        const idWithoutJsExt = removeJsExtension(id);
        if (idWithoutJsExt !== id) {
            return matchPath(idWithoutJsExt, ...otherArgs);
        }
    };
};
function initMappers(options) {
    if (mappers && mappersBuildForOptions === options) {
        return;
    }
    // eslint-disable-next-line sonar/deprecation
    if (options.directory) {
        console.warn(`[${IMPORTER_NAME}]: option \`directory\` is deprecated, please use \`project\` instead`);
        if (!options.project) {
            // eslint-disable-next-line sonar/deprecation
            options.project = options.directory;
        }
    }
    const configPaths = typeof options.project === 'string'
        ? [options.project]
        : Array.isArray(options.project)
            ? options.project
            : [process.cwd()];
    mappers = configPaths
        // turn glob patterns into paths
        .reduce((paths, path) => [...paths, ...(isGlob(path) ? globSync(path) : [path])], [])
        .map(loadConfig)
        .filter(isConfigLoaderSuccessResult)
        .map(configLoaderResult => {
        const matchPath = createExtendedMatchPath(configLoaderResult.absoluteBaseUrl, configLoaderResult.paths);
        return (source) => {
            var _a;
            // look for files based on setup tsconfig "paths"
            return matchPath(source, undefined, undefined, (_a = options.extensions) !== null && _a !== void 0 ? _a : defaultExtensions);
        };
    });
    mappersBuildForOptions = options;
}
function isConfigLoaderSuccessResult(configLoaderResult) {
    if (configLoaderResult.resultType !== 'success') {
        // this can happen if the user has problems with their tsconfig
        // or if it's valid, but they don't have baseUrl set
        log('failed to init tsconfig-paths:', configLoaderResult.message);
        return false;
    }
    return true;
}
/**
 * For a scoped package, we must look in `@types/foo__bar` instead of `@types/@foo/bar`.
 */
function mangleScopedPackage(moduleName) {
    if (moduleName.startsWith('@')) {
        const replaceSlash = moduleName.replace(path.sep, '__');
        if (replaceSlash !== moduleName) {
            return replaceSlash.slice(1); // Take off the "@"
        }
    }
    return moduleName;
}
//# sourceMappingURL=index.js.map