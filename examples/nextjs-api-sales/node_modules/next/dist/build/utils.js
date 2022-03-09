"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.collectPages = collectPages;
exports.printTreeView = printTreeView;
exports.printCustomRoutes = printCustomRoutes;
exports.computeFromManifest = computeFromManifest;
exports.difference = difference;
exports.getJsPageSizeInKb = getJsPageSizeInKb;
exports.buildStaticPaths = buildStaticPaths;
exports.isPageStatic = isPageStatic;
exports.hasCustomGetInitialProps = hasCustomGetInitialProps;
exports.getNamedExports = getNamedExports;
exports.detectConflictingPaths = detectConflictingPaths;
exports.getRawPageExtensions = getRawPageExtensions;
exports.isFlightPage = isFlightPage;
exports.getUnresolvedModuleFromError = getUnresolvedModuleFromError;
exports.copyTracedFiles = copyTracedFiles;
exports.isReservedPage = isReservedPage;
exports.isCustomErrorPage = isCustomErrorPage;
require("../server/node-polyfill-fetch");
var _chalk = _interopRequireDefault(require("next/dist/compiled/chalk"));
var _gzipSize = _interopRequireDefault(require("next/dist/compiled/gzip-size"));
var _textTable = _interopRequireDefault(require("next/dist/compiled/text-table"));
var _path = _interopRequireDefault(require("path"));
var _fs = require("fs");
var _reactIs = require("next/dist/compiled/react-is");
var _stripAnsi = _interopRequireDefault(require("next/dist/compiled/strip-ansi"));
var _constants = require("../lib/constants");
var _prettyBytes = _interopRequireDefault(require("../lib/pretty-bytes"));
var _recursiveReaddir = require("../lib/recursive-readdir");
var _utils = require("../shared/lib/router/utils");
var _isDynamic = require("../shared/lib/router/utils/is-dynamic");
var _escapePathDelimiters = _interopRequireDefault(require("../shared/lib/router/utils/escape-path-delimiters"));
var _findPageFile = require("../server/lib/find-page-file");
var _normalizePagePath = require("../server/normalize-page-path");
var _normalizeTrailingSlash = require("../client/normalize-trailing-slash");
var _normalizeLocalePath = require("../shared/lib/i18n/normalize-locale-path");
var Log = _interopRequireWildcard(require("./output/log"));
var _loadComponents = require("../server/load-components");
var _trace = require("../trace");
var _config = require("../server/config");
var _isError = _interopRequireDefault(require("../lib/is-error"));
var _recursiveDelete = require("../lib/recursive-delete");
var _asyncSema = require("next/dist/compiled/async-sema");
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
const { builtinModules  } = require('module');
const RESERVED_PAGE = /^\/(_app|_error|_document|api(\/|$))/;
const fileGzipStats = {
};
const fsStatGzip = (file)=>{
    const cached = fileGzipStats[file];
    if (cached) return cached;
    return fileGzipStats[file] = _gzipSize.default.file(file);
};
const fileSize = async (file)=>(await _fs.promises.stat(file)).size
;
const fileStats = {
};
const fsStat = (file)=>{
    const cached = fileStats[file];
    if (cached) return cached;
    return fileStats[file] = fileSize(file);
};
function collectPages(directory, pageExtensions) {
    return (0, _recursiveReaddir).recursiveReadDir(directory, new RegExp(`\\.(?:${pageExtensions.join('|')})$`));
}
async function printTreeView(list, pageInfos, serverless, { distPath , buildId , pagesDir , pageExtensions , buildManifest , useStatic404 , gzipSize =true  }) {
    const getPrettySize = (_size)=>{
        const size = (0, _prettyBytes).default(_size);
        // green for 0-130kb
        if (_size < 130 * 1000) return _chalk.default.green(size);
        // yellow for 130-170kb
        if (_size < 170 * 1000) return _chalk.default.yellow(size);
        // red for >= 170kb
        return _chalk.default.red.bold(size);
    };
    const MIN_DURATION = 300;
    const getPrettyDuration = (_duration)=>{
        const duration = `${_duration} ms`;
        // green for 300-1000ms
        if (_duration < 1000) return _chalk.default.green(duration);
        // yellow for 1000-2000ms
        if (_duration < 2000) return _chalk.default.yellow(duration);
        // red for >= 2000ms
        return _chalk.default.red.bold(duration);
    };
    const getCleanName = (fileName)=>fileName// Trim off `static/`
        .replace(/^static\//, '')// Re-add `static/` for root files
        .replace(/^<buildId>/, 'static')// Remove file hash
        .replace(/(?:^|[.-])([0-9a-z]{6})[0-9a-z]{14}(?=\.)/, '.$1')
    ;
    const messages = [
        [
            'Page',
            'Size',
            'First Load JS'
        ].map((entry)=>_chalk.default.underline(entry)
        ), 
    ];
    const hasCustomApp = await (0, _findPageFile).findPageFile(pagesDir, '/_app', pageExtensions);
    pageInfos.set('/404', {
        ...pageInfos.get('/404') || pageInfos.get('/_error'),
        static: useStatic404
    });
    if (!list.includes('/404')) {
        list = [
            ...list,
            '/404'
        ];
    }
    const sizeData = await computeFromManifest(buildManifest, distPath, gzipSize, pageInfos);
    const usedSymbols = new Set();
    const pageList = list.slice().filter((e)=>!(e === '/_document' || e === '/_error' || !hasCustomApp && e === '/_app')
    ).sort((a, b)=>a.localeCompare(b)
    );
    pageList.forEach((item, i, arr)=>{
        var ref, ref1, ref2;
        const border = i === 0 ? arr.length === 1 ? '─' : '┌' : i === arr.length - 1 ? '└' : '├';
        const pageInfo = pageInfos.get(item);
        const ampFirst = buildManifest.ampFirstPages.includes(item);
        const totalDuration = ((pageInfo === null || pageInfo === void 0 ? void 0 : pageInfo.pageDuration) || 0) + ((pageInfo === null || pageInfo === void 0 ? void 0 : (ref = pageInfo.ssgPageDurations) === null || ref === void 0 ? void 0 : ref.reduce((a, b)=>a + (b || 0)
        , 0)) || 0);
        const symbol = item === '/_app' ? ' ' : item.endsWith('/_middleware') ? 'ƒ' : (pageInfo === null || pageInfo === void 0 ? void 0 : pageInfo.isWebSsr) ? 'ℇ' : (pageInfo === null || pageInfo === void 0 ? void 0 : pageInfo.static) ? '○' : (pageInfo === null || pageInfo === void 0 ? void 0 : pageInfo.isSsg) ? '●' : 'λ';
        usedSymbols.add(symbol);
        if (pageInfo === null || pageInfo === void 0 ? void 0 : pageInfo.initialRevalidateSeconds) usedSymbols.add('ISR');
        messages.push([
            `${border} ${symbol} ${(pageInfo === null || pageInfo === void 0 ? void 0 : pageInfo.initialRevalidateSeconds) ? `${item} (ISR: ${pageInfo === null || pageInfo === void 0 ? void 0 : pageInfo.initialRevalidateSeconds} Seconds)` : item}${totalDuration > MIN_DURATION ? ` (${getPrettyDuration(totalDuration)})` : ''}`,
            pageInfo ? ampFirst ? _chalk.default.cyan('AMP') : pageInfo.size >= 0 ? (0, _prettyBytes).default(pageInfo.size) : '' : '',
            pageInfo ? ampFirst ? _chalk.default.cyan('AMP') : pageInfo.size >= 0 ? getPrettySize(pageInfo.totalSize) : '' : '', 
        ]);
        const uniqueCssFiles = ((ref1 = buildManifest.pages[item]) === null || ref1 === void 0 ? void 0 : ref1.filter((file)=>file.endsWith('.css') && sizeData.uniqueFiles.includes(file)
        )) || [];
        if (uniqueCssFiles.length > 0) {
            const contSymbol = i === arr.length - 1 ? ' ' : '├';
            uniqueCssFiles.forEach((file, index, { length  })=>{
                const innerSymbol = index === length - 1 ? '└' : '├';
                messages.push([
                    `${contSymbol}   ${innerSymbol} ${getCleanName(file)}`,
                    (0, _prettyBytes).default(sizeData.sizeUniqueFiles[file]),
                    '', 
                ]);
            });
        }
        if (pageInfo === null || pageInfo === void 0 ? void 0 : (ref2 = pageInfo.ssgPageRoutes) === null || ref2 === void 0 ? void 0 : ref2.length) {
            const totalRoutes = pageInfo.ssgPageRoutes.length;
            const contSymbol = i === arr.length - 1 ? ' ' : '├';
            let routes;
            if (pageInfo.ssgPageDurations && pageInfo.ssgPageDurations.some((d)=>d > MIN_DURATION
            )) {
                const previewPages = totalRoutes === 8 ? 8 : Math.min(totalRoutes, 7);
                const routesWithDuration = pageInfo.ssgPageRoutes.map((route, idx)=>({
                        route,
                        duration: pageInfo.ssgPageDurations[idx] || 0
                    })
                ).sort(({ duration: a  }, { duration: b  })=>// Sort by duration
                    // keep too small durations in original order at the end
                    a <= MIN_DURATION && b <= MIN_DURATION ? 0 : b - a
                );
                routes = routesWithDuration.slice(0, previewPages);
                const remainingRoutes = routesWithDuration.slice(previewPages);
                if (remainingRoutes.length) {
                    const remaining = remainingRoutes.length;
                    const avgDuration = Math.round(remainingRoutes.reduce((total, { duration  })=>total + duration
                    , 0) / remainingRoutes.length);
                    routes.push({
                        route: `[+${remaining} more paths]`,
                        duration: 0,
                        avgDuration
                    });
                }
            } else {
                const previewPages = totalRoutes === 4 ? 4 : Math.min(totalRoutes, 3);
                routes = pageInfo.ssgPageRoutes.slice(0, previewPages).map((route)=>({
                        route,
                        duration: 0
                    })
                );
                if (totalRoutes > previewPages) {
                    const remaining = totalRoutes - previewPages;
                    routes.push({
                        route: `[+${remaining} more paths]`,
                        duration: 0
                    });
                }
            }
            routes.forEach(({ route , duration , avgDuration  }, index, { length  })=>{
                const innerSymbol = index === length - 1 ? '└' : '├';
                messages.push([
                    `${contSymbol}   ${innerSymbol} ${route}${duration > MIN_DURATION ? ` (${getPrettyDuration(duration)})` : ''}${avgDuration && avgDuration > MIN_DURATION ? ` (avg ${getPrettyDuration(avgDuration)})` : ''}`,
                    '',
                    '', 
                ]);
            });
        }
    });
    const sharedFilesSize = sizeData.sizeCommonFiles;
    const sharedFiles = sizeData.sizeCommonFile;
    messages.push([
        '+ First Load JS shared by all',
        getPrettySize(sharedFilesSize),
        '', 
    ]);
    const sharedFileKeys = Object.keys(sharedFiles);
    const sharedCssFiles = [];
    [
        ...sharedFileKeys.filter((file)=>{
            if (file.endsWith('.css')) {
                sharedCssFiles.push(file);
                return false;
            }
            return true;
        }).map((e)=>e.replace(buildId, '<buildId>')
        ).sort(),
        ...sharedCssFiles.map((e)=>e.replace(buildId, '<buildId>')
        ).sort(), 
    ].forEach((fileName, index, { length  })=>{
        const innerSymbol = index === length - 1 ? '└' : '├';
        const originalName = fileName.replace('<buildId>', buildId);
        const cleanName = getCleanName(fileName);
        messages.push([
            `  ${innerSymbol} ${cleanName}`,
            (0, _prettyBytes).default(sharedFiles[originalName]),
            '', 
        ]);
    });
    console.log((0, _textTable).default(messages, {
        align: [
            'l',
            'l',
            'r'
        ],
        stringLength: (str)=>(0, _stripAnsi).default(str).length
    }));
    console.log();
    console.log((0, _textTable).default([
        usedSymbols.has('ƒ') && [
            'ƒ',
            '(Middleware)',
            `intercepts requests (uses ${_chalk.default.cyan('_middleware')})`, 
        ],
        usedSymbols.has('ℇ') && [
            'ℇ',
            '(Streaming)',
            `server-side renders with streaming (uses React 18 SSR streaming or Server Components)`, 
        ],
        usedSymbols.has('λ') && [
            'λ',
            serverless ? '(Lambda)' : '(Server)',
            `server-side renders at runtime (uses ${_chalk.default.cyan('getInitialProps')} or ${_chalk.default.cyan('getServerSideProps')})`, 
        ],
        usedSymbols.has('○') && [
            '○',
            '(Static)',
            'automatically rendered as static HTML (uses no initial props)', 
        ],
        usedSymbols.has('●') && [
            '●',
            '(SSG)',
            `automatically generated as static HTML + JSON (uses ${_chalk.default.cyan('getStaticProps')})`, 
        ],
        usedSymbols.has('ISR') && [
            '',
            '(ISR)',
            `incremental static regeneration (uses revalidate in ${_chalk.default.cyan('getStaticProps')})`, 
        ], 
    ].filter((x)=>x
    ), {
        align: [
            'l',
            'l',
            'l'
        ],
        stringLength: (str)=>(0, _stripAnsi).default(str).length
    }));
    console.log();
}
function printCustomRoutes({ redirects , rewrites , headers  }) {
    const printRoutes = (routes, type)=>{
        const isRedirects = type === 'Redirects';
        const isHeaders = type === 'Headers';
        console.log(_chalk.default.underline(type));
        console.log();
        /*
        ┌ source
        ├ permanent/statusCode
        └ destination
     */ const routesStr = routes.map((route)=>{
            let routeStr = `┌ source: ${route.source}\n`;
            if (!isHeaders) {
                const r = route;
                routeStr += `${isRedirects ? '├' : '└'} destination: ${r.destination}\n`;
            }
            if (isRedirects) {
                const r = route;
                routeStr += `└ ${r.statusCode ? `status: ${r.statusCode}` : `permanent: ${r.permanent}`}\n`;
            }
            if (isHeaders) {
                const r = route;
                routeStr += `└ headers:\n`;
                for(let i = 0; i < r.headers.length; i++){
                    const header = r.headers[i];
                    const last = i === headers.length - 1;
                    routeStr += `  ${last ? '└' : '├'} ${header.key}: ${header.value}\n`;
                }
            }
            return routeStr;
        }).join('\n');
        console.log(routesStr, '\n');
    };
    if (redirects.length) {
        printRoutes(redirects, 'Redirects');
    }
    if (headers.length) {
        printRoutes(headers, 'Headers');
    }
    const combinedRewrites = [
        ...rewrites.beforeFiles,
        ...rewrites.afterFiles,
        ...rewrites.fallback, 
    ];
    if (combinedRewrites.length) {
        printRoutes(combinedRewrites, 'Rewrites');
    }
}
let cachedBuildManifest;
let lastCompute;
let lastComputePageInfo;
async function computeFromManifest(manifest, distPath, gzipSize = true, pageInfos) {
    if (Object.is(cachedBuildManifest, manifest) && lastComputePageInfo === !!pageInfos) {
        return lastCompute;
    }
    let expected = 0;
    const files = new Map();
    Object.keys(manifest.pages).forEach((key)=>{
        if (pageInfos) {
            const pageInfo = pageInfos.get(key);
            // don't include AMP pages since they don't rely on shared bundles
            // AMP First pages are not under the pageInfos key
            if (pageInfo === null || pageInfo === void 0 ? void 0 : pageInfo.isHybridAmp) {
                return;
            }
        }
        ++expected;
        manifest.pages[key].forEach((file)=>{
            if (key === '/_app') {
                files.set(file, Infinity);
            } else if (files.has(file)) {
                files.set(file, files.get(file) + 1);
            } else {
                files.set(file, 1);
            }
        });
    });
    const getSize = gzipSize ? fsStatGzip : fsStat;
    const commonFiles = [
        ...files.entries()
    ].filter(([, len])=>len === expected || len === Infinity
    ).map(([f])=>f
    );
    const uniqueFiles = [
        ...files.entries()
    ].filter(([, len])=>len === 1
    ).map(([f])=>f
    );
    let stats;
    try {
        stats = await Promise.all(commonFiles.map(async (f)=>[
                f,
                await getSize(_path.default.join(distPath, f))
            ]
        ));
    } catch (_) {
        stats = [];
    }
    let uniqueStats;
    try {
        uniqueStats = await Promise.all(uniqueFiles.map(async (f)=>[
                f,
                await getSize(_path.default.join(distPath, f))
            ]
        ));
    } catch (_1) {
        uniqueStats = [];
    }
    lastCompute = {
        commonFiles,
        uniqueFiles,
        sizeUniqueFiles: uniqueStats.reduce((obj, n)=>Object.assign(obj, {
                [n[0]]: n[1]
            })
        , {
        }),
        sizeCommonFile: stats.reduce((obj, n)=>Object.assign(obj, {
                [n[0]]: n[1]
            })
        , {
        }),
        sizeCommonFiles: stats.reduce((size, [f, stat])=>{
            if (f.endsWith('.css')) return size;
            return size + stat;
        }, 0)
    };
    cachedBuildManifest = manifest;
    lastComputePageInfo = !!pageInfos;
    return lastCompute;
}
function difference(main, sub) {
    const a = new Set(main);
    const b = new Set(sub);
    return [
        ...a
    ].filter((x)=>!b.has(x)
    );
}
function intersect(main, sub) {
    const a = new Set(main);
    const b = new Set(sub);
    return [
        ...new Set([
            ...a
        ].filter((x)=>b.has(x)
        ))
    ];
}
function sum(a) {
    return a.reduce((size, stat)=>size + stat
    , 0);
}
async function getJsPageSizeInKb(page, distPath, buildManifest, gzipSize = true, computedManifestData) {
    const data = computedManifestData || await computeFromManifest(buildManifest, distPath, gzipSize);
    const fnFilterJs = (entry)=>entry.endsWith('.js')
    ;
    const pageFiles = (buildManifest.pages[(0, _normalizePagePath).denormalizePagePath(page)] || []).filter(fnFilterJs);
    const appFiles = (buildManifest.pages['/_app'] || []).filter(fnFilterJs);
    const fnMapRealPath = (dep)=>`${distPath}/${dep}`
    ;
    const allFilesReal = [
        ...new Set([
            ...pageFiles,
            ...appFiles
        ])
    ].map(fnMapRealPath);
    const selfFilesReal = difference(intersect(pageFiles, data.uniqueFiles), data.commonFiles).map(fnMapRealPath);
    const getSize = gzipSize ? fsStatGzip : fsStat;
    try {
        // Doesn't use `Promise.all`, as we'd double compute duplicate files. This
        // function is memoized, so the second one will instantly resolve.
        const allFilesSize = sum(await Promise.all(allFilesReal.map(getSize)));
        const selfFilesSize = sum(await Promise.all(selfFilesReal.map(getSize)));
        return [
            selfFilesSize,
            allFilesSize
        ];
    } catch (_) {
    }
    return [
        -1,
        -1
    ];
}
async function buildStaticPaths(page, getStaticPaths, configFileName, locales, defaultLocale) {
    const prerenderPaths = new Set();
    const encodedPrerenderPaths = new Set();
    const _routeRegex = (0, _utils).getRouteRegex(page);
    const _routeMatcher = (0, _utils).getRouteMatcher(_routeRegex);
    // Get the default list of allowed params.
    const _validParamKeys = Object.keys(_routeMatcher(page));
    const staticPathsResult = await getStaticPaths({
        locales,
        defaultLocale
    });
    const expectedReturnVal = `Expected: { paths: [], fallback: boolean }\n` + `See here for more info: https://nextjs.org/docs/messages/invalid-getstaticpaths-value`;
    if (!staticPathsResult || typeof staticPathsResult !== 'object' || Array.isArray(staticPathsResult)) {
        throw new Error(`Invalid value returned from getStaticPaths in ${page}. Received ${typeof staticPathsResult} ${expectedReturnVal}`);
    }
    const invalidStaticPathKeys = Object.keys(staticPathsResult).filter((key)=>!(key === 'paths' || key === 'fallback')
    );
    if (invalidStaticPathKeys.length > 0) {
        throw new Error(`Extra keys returned from getStaticPaths in ${page} (${invalidStaticPathKeys.join(', ')}) ${expectedReturnVal}`);
    }
    if (!(typeof staticPathsResult.fallback === 'boolean' || staticPathsResult.fallback === 'blocking')) {
        throw new Error(`The \`fallback\` key must be returned from getStaticPaths in ${page}.\n` + expectedReturnVal);
    }
    const toPrerender = staticPathsResult.paths;
    if (!Array.isArray(toPrerender)) {
        throw new Error(`Invalid \`paths\` value returned from getStaticPaths in ${page}.\n` + `\`paths\` must be an array of strings or objects of shape { params: [key: string]: string }`);
    }
    toPrerender.forEach((entry)=>{
        // For a string-provided path, we must make sure it matches the dynamic
        // route.
        if (typeof entry === 'string') {
            entry = (0, _normalizeTrailingSlash).removePathTrailingSlash(entry);
            const localePathResult = (0, _normalizeLocalePath).normalizeLocalePath(entry, locales);
            let cleanedEntry = entry;
            if (localePathResult.detectedLocale) {
                cleanedEntry = entry.substr(localePathResult.detectedLocale.length + 1);
            } else if (defaultLocale) {
                entry = `/${defaultLocale}${entry}`;
            }
            const result = _routeMatcher(cleanedEntry);
            if (!result) {
                throw new Error(`The provided path \`${cleanedEntry}\` does not match the page: \`${page}\`.`);
            }
            // If leveraging the string paths variant the entry should already be
            // encoded so we decode the segments ensuring we only escape path
            // delimiters
            prerenderPaths.add(entry.split('/').map((segment)=>(0, _escapePathDelimiters).default(decodeURIComponent(segment), true)
            ).join('/'));
            encodedPrerenderPaths.add(entry);
        } else {
            const invalidKeys = Object.keys(entry).filter((key)=>key !== 'params' && key !== 'locale'
            );
            if (invalidKeys.length) {
                throw new Error(`Additional keys were returned from \`getStaticPaths\` in page "${page}". ` + `URL Parameters intended for this dynamic route must be nested under the \`params\` key, i.e.:` + `\n\n\treturn { params: { ${_validParamKeys.map((k)=>`${k}: ...`
                ).join(', ')} } }` + `\n\nKeys that need to be moved: ${invalidKeys.join(', ')}.\n`);
            }
            const { params ={
            }  } = entry;
            let builtPage = page;
            let encodedBuiltPage = page;
            _validParamKeys.forEach((validParamKey)=>{
                const { repeat , optional  } = _routeRegex.groups[validParamKey];
                let paramValue = params[validParamKey];
                if (optional && params.hasOwnProperty(validParamKey) && (paramValue === null || paramValue === undefined || paramValue === false)) {
                    paramValue = [];
                }
                if (repeat && !Array.isArray(paramValue) || !repeat && typeof paramValue !== 'string') {
                    throw new Error(`A required parameter (${validParamKey}) was not provided as ${repeat ? 'an array' : 'a string'} in getStaticPaths for ${page}`);
                }
                let replaced = `[${repeat ? '...' : ''}${validParamKey}]`;
                if (optional) {
                    replaced = `[${replaced}]`;
                }
                builtPage = builtPage.replace(replaced, repeat ? paramValue.map((segment)=>(0, _escapePathDelimiters).default(segment, true)
                ).join('/') : (0, _escapePathDelimiters).default(paramValue, true)).replace(/(?!^)\/$/, '');
                encodedBuiltPage = encodedBuiltPage.replace(replaced, repeat ? paramValue.map(encodeURIComponent).join('/') : encodeURIComponent(paramValue)).replace(/(?!^)\/$/, '');
            });
            if (entry.locale && !(locales === null || locales === void 0 ? void 0 : locales.includes(entry.locale))) {
                throw new Error(`Invalid locale returned from getStaticPaths for ${page}, the locale ${entry.locale} is not specified in ${configFileName}`);
            }
            const curLocale = entry.locale || defaultLocale || '';
            prerenderPaths.add(`${curLocale ? `/${curLocale}` : ''}${curLocale && builtPage === '/' ? '' : builtPage}`);
            encodedPrerenderPaths.add(`${curLocale ? `/${curLocale}` : ''}${curLocale && encodedBuiltPage === '/' ? '' : encodedBuiltPage}`);
        }
    });
    return {
        paths: [
            ...prerenderPaths
        ],
        fallback: staticPathsResult.fallback,
        encodedPaths: [
            ...encodedPrerenderPaths
        ]
    };
}
async function isPageStatic(page, distDir, serverless, configFileName, runtimeEnvConfig, httpAgentOptions, locales, defaultLocale, parentId) {
    const isPageStaticSpan = (0, _trace).trace('is-page-static-utils', parentId);
    return isPageStaticSpan.traceAsyncFn(async ()=>{
        try {
            require('../shared/lib/runtime-config').setConfig(runtimeEnvConfig);
            (0, _config).setHttpAgentOptions(httpAgentOptions);
            const mod = await (0, _loadComponents).loadComponents(distDir, page, serverless);
            const Comp = mod.Component;
            if (!Comp || !(0, _reactIs).isValidElementType(Comp) || typeof Comp === 'string') {
                throw new Error('INVALID_DEFAULT_EXPORT');
            }
            const hasFlightData = !!Comp.__next_rsc__;
            const hasGetInitialProps = !!Comp.getInitialProps;
            const hasStaticProps = !!mod.getStaticProps;
            const hasStaticPaths = !!mod.getStaticPaths;
            const hasServerProps = !!mod.getServerSideProps;
            const hasLegacyServerProps = !!await mod.ComponentMod.unstable_getServerProps;
            const hasLegacyStaticProps = !!await mod.ComponentMod.unstable_getStaticProps;
            const hasLegacyStaticPaths = !!await mod.ComponentMod.unstable_getStaticPaths;
            const hasLegacyStaticParams = !!await mod.ComponentMod.unstable_getStaticParams;
            if (hasLegacyStaticParams) {
                throw new Error(`unstable_getStaticParams was replaced with getStaticPaths. Please update your code.`);
            }
            if (hasLegacyStaticPaths) {
                throw new Error(`unstable_getStaticPaths was replaced with getStaticPaths. Please update your code.`);
            }
            if (hasLegacyStaticProps) {
                throw new Error(`unstable_getStaticProps was replaced with getStaticProps. Please update your code.`);
            }
            if (hasLegacyServerProps) {
                throw new Error(`unstable_getServerProps was replaced with getServerSideProps. Please update your code.`);
            }
            // A page cannot be prerendered _and_ define a data requirement. That's
            // contradictory!
            if (hasGetInitialProps && hasStaticProps) {
                throw new Error(_constants.SSG_GET_INITIAL_PROPS_CONFLICT);
            }
            if (hasGetInitialProps && hasServerProps) {
                throw new Error(_constants.SERVER_PROPS_GET_INIT_PROPS_CONFLICT);
            }
            if (hasStaticProps && hasServerProps) {
                throw new Error(_constants.SERVER_PROPS_SSG_CONFLICT);
            }
            const pageIsDynamic = (0, _isDynamic).isDynamicRoute(page);
            // A page cannot have static parameters if it is not a dynamic page.
            if (hasStaticProps && hasStaticPaths && !pageIsDynamic) {
                throw new Error(`getStaticPaths can only be used with dynamic pages, not '${page}'.` + `\nLearn more: https://nextjs.org/docs/routing/dynamic-routes`);
            }
            if (hasStaticProps && pageIsDynamic && !hasStaticPaths) {
                throw new Error(`getStaticPaths is required for dynamic SSG pages and is missing for '${page}'.` + `\nRead more: https://nextjs.org/docs/messages/invalid-getstaticpaths-value`);
            }
            let prerenderRoutes;
            let encodedPrerenderRoutes;
            let prerenderFallback;
            if (hasStaticProps && hasStaticPaths) {
                ({ paths: prerenderRoutes , fallback: prerenderFallback , encodedPaths: encodedPrerenderRoutes ,  } = await buildStaticPaths(page, mod.getStaticPaths, configFileName, locales, defaultLocale));
            }
            const isNextImageImported = global.__NEXT_IMAGE_IMPORTED;
            const config = mod.pageConfig;
            return {
                isStatic: !hasStaticProps && !hasGetInitialProps && !hasServerProps && !hasFlightData,
                isHybridAmp: config.amp === 'hybrid',
                isAmpOnly: config.amp === true,
                prerenderRoutes,
                prerenderFallback,
                encodedPrerenderRoutes,
                hasStaticProps,
                hasServerProps,
                hasFlightData,
                isNextImageImported,
                traceIncludes: config.unstable_includeFiles || [],
                traceExcludes: config.unstable_excludeFiles || []
            };
        } catch (err) {
            if ((0, _isError).default(err) && err.code === 'MODULE_NOT_FOUND') return {
            };
            throw err;
        }
    });
}
async function hasCustomGetInitialProps(page, distDir, isLikeServerless, runtimeEnvConfig, checkingApp) {
    require('../shared/lib/runtime-config').setConfig(runtimeEnvConfig);
    const components = await (0, _loadComponents).loadComponents(distDir, page, isLikeServerless);
    let mod = components.ComponentMod;
    if (checkingApp) {
        mod = await mod._app || mod.default || mod;
    } else {
        mod = mod.default || mod;
    }
    mod = await mod;
    return mod.getInitialProps !== mod.origGetInitialProps;
}
async function getNamedExports(page, distDir, isLikeServerless, runtimeEnvConfig) {
    require('../shared/lib/runtime-config').setConfig(runtimeEnvConfig);
    const components = await (0, _loadComponents).loadComponents(distDir, page, isLikeServerless);
    let mod = components.ComponentMod;
    return Object.keys(mod);
}
function detectConflictingPaths(combinedPages, ssgPages, additionalSsgPaths) {
    const conflictingPaths = new Map();
    const dynamicSsgPages = [
        ...ssgPages
    ].filter((page)=>(0, _isDynamic).isDynamicRoute(page)
    );
    additionalSsgPaths.forEach((paths, pathsPage)=>{
        paths.forEach((curPath)=>{
            const lowerPath = curPath.toLowerCase();
            let conflictingPage = combinedPages.find((page)=>page.toLowerCase() === lowerPath
            );
            if (conflictingPage) {
                conflictingPaths.set(lowerPath, [
                    {
                        path: curPath,
                        page: pathsPage
                    },
                    {
                        path: conflictingPage,
                        page: conflictingPage
                    }, 
                ]);
            } else {
                let conflictingPath;
                conflictingPage = dynamicSsgPages.find((page)=>{
                    var ref;
                    if (page === pathsPage) return false;
                    conflictingPath = (ref = additionalSsgPaths.get(page)) === null || ref === void 0 ? void 0 : ref.find((compPath)=>compPath.toLowerCase() === lowerPath
                    );
                    return conflictingPath;
                });
                if (conflictingPage && conflictingPath) {
                    conflictingPaths.set(lowerPath, [
                        {
                            path: curPath,
                            page: pathsPage
                        },
                        {
                            path: conflictingPath,
                            page: conflictingPage
                        }, 
                    ]);
                }
            }
        });
    });
    if (conflictingPaths.size > 0) {
        let conflictingPathsOutput = '';
        conflictingPaths.forEach((pathItems)=>{
            pathItems.forEach((pathItem, idx)=>{
                const isDynamic = pathItem.page !== pathItem.path;
                if (idx > 0) {
                    conflictingPathsOutput += 'conflicts with ';
                }
                conflictingPathsOutput += `path: "${pathItem.path}"${isDynamic ? ` from page: "${pathItem.page}" ` : ' '}`;
            });
            conflictingPathsOutput += '\n';
        });
        Log.error('Conflicting paths returned from getStaticPaths, paths must be unique per page.\n' + 'See more info here: https://nextjs.org/docs/messages/conflicting-ssg-paths\n\n' + conflictingPathsOutput);
        process.exit(1);
    }
}
function getRawPageExtensions(pageExtensions) {
    return pageExtensions.filter((ext)=>!ext.startsWith('client.') && !ext.startsWith('server.')
    );
}
function isFlightPage(nextConfig, pagePath) {
    if (!(nextConfig.experimental.serverComponents && nextConfig.experimental.runtime)) return false;
    const rawPageExtensions = getRawPageExtensions(nextConfig.pageExtensions || []);
    const isRscPage = rawPageExtensions.some((ext)=>{
        return new RegExp(`\\.server\\.${ext}$`).test(pagePath);
    });
    return isRscPage;
}
function getUnresolvedModuleFromError(error) {
    const moduleErrorRegex = new RegExp(`Module not found: Can't resolve '(\\w+)'`);
    const [, moduleName] = error.match(moduleErrorRegex) || [];
    return builtinModules.find((item)=>item === moduleName
    );
}
async function copyTracedFiles(dir, distDir, pageKeys, tracingRoot, serverConfig, middlewareManifest) {
    const outputPath = _path.default.join(distDir, 'standalone');
    const copiedFiles = new Set();
    await (0, _recursiveDelete).recursiveDelete(outputPath);
    async function handleTraceFiles(traceFilePath) {
        const traceData = JSON.parse(await _fs.promises.readFile(traceFilePath, 'utf8'));
        const copySema = new _asyncSema.Sema(10, {
            capacity: traceData.files.length
        });
        const traceFileDir = _path.default.dirname(traceFilePath);
        await Promise.all(traceData.files.map(async (relativeFile)=>{
            await copySema.acquire();
            const tracedFilePath = _path.default.join(traceFileDir, relativeFile);
            const fileOutputPath = _path.default.join(outputPath, _path.default.relative(tracingRoot, tracedFilePath));
            if (!copiedFiles.has(fileOutputPath)) {
                copiedFiles.add(fileOutputPath);
                await _fs.promises.mkdir(_path.default.dirname(fileOutputPath), {
                    recursive: true
                });
                const symlink = await _fs.promises.readlink(tracedFilePath).catch(()=>null
                );
                if (symlink) {
                    console.log('symlink', _path.default.relative(tracingRoot, symlink));
                    await _fs.promises.symlink(_path.default.relative(tracingRoot, symlink), fileOutputPath);
                } else {
                    await _fs.promises.copyFile(tracedFilePath, fileOutputPath);
                }
            }
            await copySema.release();
        }));
    }
    for (const page of pageKeys){
        if (_constants.MIDDLEWARE_ROUTE.test(page)) {
            const { files  } = middlewareManifest.middleware[page.replace(/\/_middleware$/, '') || '/'];
            for (const file of files){
                const originalPath = _path.default.join(distDir, file);
                const fileOutputPath = _path.default.join(outputPath, _path.default.relative(tracingRoot, distDir), file);
                await _fs.promises.mkdir(_path.default.dirname(fileOutputPath), {
                    recursive: true
                });
                await _fs.promises.copyFile(originalPath, fileOutputPath);
            }
            continue;
        }
        const pageFile = _path.default.join(distDir, 'server', 'pages', `${(0, _normalizePagePath).normalizePagePath(page)}.js`);
        const pageTraceFile = `${pageFile}.nft.json`;
        await handleTraceFiles(pageTraceFile);
    }
    await handleTraceFiles(_path.default.join(distDir, 'next-server.js.nft.json'));
    const serverOutputPath = _path.default.join(outputPath, _path.default.relative(tracingRoot, dir), 'server.js');
    await _fs.promises.writeFile(serverOutputPath, `
process.env.NODE_ENV = 'production'
process.chdir(__dirname)
const NextServer = require('next/dist/server/next-server').default
const http = require('http')
const path = require('path')

// Make sure commands gracefully respect termination signals (e.g. from Docker)
process.on('SIGTERM', () => process.exit(0))
process.on('SIGINT', () => process.exit(0))

let handler

const server = http.createServer(async (req, res) => {
  try {
    await handler(req, res)
  } catch (err) {
    console.error(err);
    res.statusCode = 500
    res.end('internal server error')
  }
})
const currentPort = parseInt(process.env.PORT, 10) || 3000

server.listen(currentPort, (err) => {
  if (err) {
    console.error("Failed to start server", err)
    process.exit(1)
  }
  const addr = server.address()
  const nextServer = new NextServer({
    hostname: 'localhost',
    port: currentPort,
    dir: path.join(__dirname),
    dev: false,
    conf: ${JSON.stringify({
        ...serverConfig,
        distDir: `./${_path.default.relative(dir, distDir)}`
    })},
  })
  handler = nextServer.getRequestHandler()

  console.log("Listening on port", currentPort)
})
    `);
}
function isReservedPage(page) {
    return RESERVED_PAGE.test(page);
}
function isCustomErrorPage(page) {
    return page === '/404' || page === '/500';
}

//# sourceMappingURL=utils.js.map