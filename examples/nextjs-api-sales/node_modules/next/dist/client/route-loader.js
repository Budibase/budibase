"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.markAssetError = markAssetError;
exports.isAssetError = isAssetError;
exports.getClientBuildManifest = getClientBuildManifest;
exports.getMiddlewareManifest = getMiddlewareManifest;
exports.createRouteLoader = createRouteLoader;
var _getAssetPathFromRoute = _interopRequireDefault(require("../shared/lib/router/utils/get-asset-path-from-route"));
var _requestIdleCallback = require("./request-idle-callback");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
// 3.8s was arbitrarily chosen as it's what https://web.dev/interactive
// considers as "Good" time-to-interactive. We must assume something went
// wrong beyond this point, and then fall-back to a full page transition to
// show the user something of value.
const MS_MAX_IDLE_DELAY = 3800;
function withFuture(key, map, generator) {
    let entry = map.get(key);
    if (entry) {
        if ('future' in entry) {
            return entry.future;
        }
        return Promise.resolve(entry);
    }
    let resolver;
    const prom = new Promise((resolve)=>{
        resolver = resolve;
    });
    map.set(key, entry = {
        resolve: resolver,
        future: prom
    });
    return generator ? generator()// eslint-disable-next-line no-sequences
    .then((value)=>(resolver(value), value)
    ).catch((err)=>{
        map.delete(key);
        throw err;
    }) : prom;
}
function hasPrefetch(link) {
    try {
        link = document.createElement('link');
        return(// detect IE11 since it supports prefetch but isn't detected
        // with relList.support
        (!!window.MSInputMethodContext && !!document.documentMode) || link.relList.supports('prefetch'));
    } catch (e) {
        return false;
    }
}
const canPrefetch = hasPrefetch();
function prefetchViaDom(href, as, link) {
    return new Promise((res, rej)=>{
        const selector = `
      link[rel="prefetch"][href^="${href}"],
      link[rel="preload"][href^="${href}"],
      script[src^="${href}"]`;
        if (document.querySelector(selector)) {
            return res();
        }
        link = document.createElement('link');
        // The order of property assignment here is intentional:
        if (as) link.as = as;
        link.rel = `prefetch`;
        link.crossOrigin = process.env.__NEXT_CROSS_ORIGIN;
        link.onload = res;
        link.onerror = rej;
        // `href` should always be last:
        link.href = href;
        document.head.appendChild(link);
    });
}
const ASSET_LOAD_ERROR = Symbol('ASSET_LOAD_ERROR');
function markAssetError(err) {
    return Object.defineProperty(err, ASSET_LOAD_ERROR, {
    });
}
function isAssetError(err) {
    return err && ASSET_LOAD_ERROR in err;
}
function appendScript(src, script) {
    return new Promise((resolve, reject)=>{
        script = document.createElement('script');
        // The order of property assignment here is intentional.
        // 1. Setup success/failure hooks in case the browser synchronously
        //    executes when `src` is set.
        script.onload = resolve;
        script.onerror = ()=>reject(markAssetError(new Error(`Failed to load script: ${src}`)))
        ;
        // 2. Configure the cross-origin attribute before setting `src` in case the
        //    browser begins to fetch.
        script.crossOrigin = process.env.__NEXT_CROSS_ORIGIN;
        // 3. Finally, set the source and inject into the DOM in case the child
        //    must be appended for fetching to start.
        script.src = src;
        document.body.appendChild(script);
    });
}
// We wait for pages to be built in dev before we start the route transition
// timeout to prevent an un-necessary hard navigation in development.
let devBuildPromise;
// Resolve a promise that times out after given amount of milliseconds.
function resolvePromiseWithTimeout(p, ms, err) {
    return new Promise((resolve, reject)=>{
        let cancelled = false;
        p.then((r)=>{
            // Resolved, cancel the timeout
            cancelled = true;
            resolve(r);
        }).catch(reject);
        // We wrap these checks separately for better dead-code elimination in
        // production bundles.
        if (process.env.NODE_ENV === 'development') {
            (devBuildPromise || Promise.resolve()).then(()=>{
                (0, _requestIdleCallback).requestIdleCallback(()=>setTimeout(()=>{
                        if (!cancelled) {
                            reject(err);
                        }
                    }, ms)
                );
            });
        }
        if (process.env.NODE_ENV !== 'development') {
            (0, _requestIdleCallback).requestIdleCallback(()=>setTimeout(()=>{
                    if (!cancelled) {
                        reject(err);
                    }
                }, ms)
            );
        }
    });
}
function getClientBuildManifest() {
    if (self.__BUILD_MANIFEST) {
        return Promise.resolve(self.__BUILD_MANIFEST);
    }
    const onBuildManifest = new Promise((resolve)=>{
        // Mandatory because this is not concurrent safe:
        const cb = self.__BUILD_MANIFEST_CB;
        self.__BUILD_MANIFEST_CB = ()=>{
            resolve(self.__BUILD_MANIFEST);
            cb && cb();
        };
    });
    return resolvePromiseWithTimeout(onBuildManifest, MS_MAX_IDLE_DELAY, markAssetError(new Error('Failed to load client build manifest')));
}
function getMiddlewareManifest() {
    if (self.__MIDDLEWARE_MANIFEST) {
        return Promise.resolve(self.__MIDDLEWARE_MANIFEST);
    }
    const onMiddlewareManifest = new Promise((resolve)=>{
        const cb = self.__MIDDLEWARE_MANIFEST_CB;
        self.__MIDDLEWARE_MANIFEST_CB = ()=>{
            resolve(self.__MIDDLEWARE_MANIFEST);
            cb && cb();
        };
    });
    return resolvePromiseWithTimeout(onMiddlewareManifest, MS_MAX_IDLE_DELAY, markAssetError(new Error('Failed to load client middleware manifest')));
}
function getFilesForRoute(assetPrefix, route) {
    if (process.env.NODE_ENV === 'development') {
        return Promise.resolve({
            scripts: [
                assetPrefix + '/_next/static/chunks/pages' + encodeURI((0, _getAssetPathFromRoute).default(route, '.js')), 
            ],
            // Styles are handled by `style-loader` in development:
            css: []
        });
    }
    return getClientBuildManifest().then((manifest)=>{
        if (!(route in manifest)) {
            throw markAssetError(new Error(`Failed to lookup route: ${route}`));
        }
        const allFiles = manifest[route].map((entry)=>assetPrefix + '/_next/' + encodeURI(entry)
        );
        return {
            scripts: allFiles.filter((v)=>v.endsWith('.js')
            ),
            css: allFiles.filter((v)=>v.endsWith('.css')
            )
        };
    });
}
function createRouteLoader(assetPrefix) {
    const entrypoints = new Map();
    const loadedScripts = new Map();
    const styleSheets = new Map();
    const routes = new Map();
    function maybeExecuteScript(src) {
        // With HMR we might need to "reload" scripts when they are
        // disposed and readded. Executing scripts twice has no functional
        // differences
        if (process.env.NODE_ENV !== 'development') {
            let prom = loadedScripts.get(src);
            if (prom) {
                return prom;
            }
            // Skip executing script if it's already in the DOM:
            if (document.querySelector(`script[src^="${src}"]`)) {
                return Promise.resolve();
            }
            loadedScripts.set(src, prom = appendScript(src));
            return prom;
        } else {
            return appendScript(src);
        }
    }
    function fetchStyleSheet(href) {
        let prom = styleSheets.get(href);
        if (prom) {
            return prom;
        }
        styleSheets.set(href, prom = fetch(href).then((res)=>{
            if (!res.ok) {
                throw new Error(`Failed to load stylesheet: ${href}`);
            }
            return res.text().then((text)=>({
                    href: href,
                    content: text
                })
            );
        }).catch((err)=>{
            throw markAssetError(err);
        }));
        return prom;
    }
    return {
        whenEntrypoint (route) {
            return withFuture(route, entrypoints);
        },
        onEntrypoint (route, execute) {
            (execute ? Promise.resolve().then(()=>execute()
            ).then((exports)=>({
                    component: exports && exports.default || exports,
                    exports: exports
                })
            , (err)=>({
                    error: err
                })
            ) : Promise.resolve(undefined)).then((input)=>{
                const old = entrypoints.get(route);
                if (old && 'resolve' in old) {
                    if (input) {
                        entrypoints.set(route, input);
                        old.resolve(input);
                    }
                } else {
                    if (input) {
                        entrypoints.set(route, input);
                    } else {
                        entrypoints.delete(route);
                    }
                    // when this entrypoint has been resolved before
                    // the route is outdated and we want to invalidate
                    // this cache entry
                    routes.delete(route);
                }
            });
        },
        loadRoute (route, prefetch) {
            return withFuture(route, routes, ()=>{
                let devBuildPromiseResolve;
                if (process.env.NODE_ENV === 'development') {
                    devBuildPromise = new Promise((resolve)=>{
                        devBuildPromiseResolve = resolve;
                    });
                }
                return resolvePromiseWithTimeout(getFilesForRoute(assetPrefix, route).then(({ scripts , css  })=>{
                    return Promise.all([
                        entrypoints.has(route) ? [] : Promise.all(scripts.map(maybeExecuteScript)),
                        Promise.all(css.map(fetchStyleSheet)), 
                    ]);
                }).then((res)=>{
                    return this.whenEntrypoint(route).then((entrypoint)=>({
                            entrypoint,
                            styles: res[1]
                        })
                    );
                }), MS_MAX_IDLE_DELAY, markAssetError(new Error(`Route did not complete loading: ${route}`))).then(({ entrypoint , styles  })=>{
                    const res = Object.assign({
                        styles: styles
                    }, entrypoint);
                    return 'error' in entrypoint ? entrypoint : res;
                }).catch((err)=>{
                    if (prefetch) {
                        // we don't want to cache errors during prefetch
                        throw err;
                    }
                    return {
                        error: err
                    };
                }).finally(()=>{
                    return devBuildPromiseResolve === null || devBuildPromiseResolve === void 0 ? void 0 : devBuildPromiseResolve();
                });
            });
        },
        prefetch (route) {
            // https://github.com/GoogleChromeLabs/quicklink/blob/453a661fa1fa940e2d2e044452398e38c67a98fb/src/index.mjs#L115-L118
            // License: Apache 2.0
            let cn;
            if (cn = navigator.connection) {
                // Don't prefetch if using 2G or if Save-Data is enabled.
                if (cn.saveData || /2g/.test(cn.effectiveType)) return Promise.resolve();
            }
            return getFilesForRoute(assetPrefix, route).then((output)=>Promise.all(canPrefetch ? output.scripts.map((script)=>prefetchViaDom(script, 'script')
                ) : [])
            ).then(()=>{
                (0, _requestIdleCallback).requestIdleCallback(()=>this.loadRoute(route, true).catch(()=>{
                    })
                );
            }).catch(// swallow prefetch errors
            ()=>{
            });
        }
    };
}

//# sourceMappingURL=route-loader.js.map