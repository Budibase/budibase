export { b as build, q as createFilter, v as createLogger, c as createServer, e as defineConfig, f as formatPostcssSourceMap, i as getDepOptimizationConfig, j as isDepsOptimizerEnabled, l as loadConfigFromFile, x as loadEnv, k as mergeAlias, m as mergeConfig, n as normalizePath, o as optimizeDeps, a as preprocessCSS, p as preview, h as resolveBaseUrl, g as resolveConfig, y as resolveEnvPrefix, d as resolvePackageData, r as resolvePackageEntry, w as searchForWorkspaceRoot, u as send, s as sortUserPlugins, t as transformWithEsbuild } from './chunks/dep-2faf2534.js';
export { VERSION as version } from './constants.js';
export { version as esbuildVersion } from 'esbuild';
export { VERSION as rollupVersion } from 'rollup';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'node:perf_hooks';
import 'node:module';
import 'tty';
import 'path';
import 'fs';
import 'events';
import 'assert';
import 'util';
import 'net';
import 'url';
import 'http';
import 'stream';
import 'os';
import 'child_process';
import 'node:os';
import 'node:crypto';
import 'node:util';
import 'node:dns';
import 'resolve';
import 'crypto';
import 'node:buffer';
import 'module';
import 'worker_threads';
import 'zlib';
import 'https';
import 'tls';
import 'node:http';
import 'node:https';
import 'querystring';
import 'node:readline';
import 'node:child_process';
import 'node:zlib';

// This file will be built for both ESM and CJS. Avoid relying on other modules as possible.
const cssLangs = `\\.(css|less|sass|scss|styl|stylus|pcss|postcss)($|\\?)`;
const cssLangRE = new RegExp(cssLangs);
const isCSSRequest = (request) => cssLangRE.test(request);
// Use splitVendorChunkPlugin() to get the same manualChunks strategy as Vite 2.7
// We don't recommend using this strategy as a general solution moving forward
// splitVendorChunk is a simple index/vendor strategy that was used in Vite
// until v2.8. It is exposed to let people continue to use it in case it was
// working well for their setups.
// The cache needs to be reset on buildStart for watch mode to work correctly
// Don't use this manualChunks strategy for ssr, lib mode, and 'umd' or 'iife'
class SplitVendorChunkCache {
    constructor() {
        this.cache = new Map();
    }
    reset() {
        this.cache = new Map();
    }
}
function splitVendorChunk(options = {}) {
    const cache = options.cache ?? new SplitVendorChunkCache();
    return (id, { getModuleInfo }) => {
        if (id.includes('node_modules') &&
            !isCSSRequest(id) &&
            staticImportedByEntry(id, getModuleInfo, cache.cache)) {
            return 'vendor';
        }
    };
}
function staticImportedByEntry(id, getModuleInfo, cache, importStack = []) {
    if (cache.has(id)) {
        return cache.get(id);
    }
    if (importStack.includes(id)) {
        // circular deps!
        cache.set(id, false);
        return false;
    }
    const mod = getModuleInfo(id);
    if (!mod) {
        cache.set(id, false);
        return false;
    }
    if (mod.isEntry) {
        cache.set(id, true);
        return true;
    }
    const someImporterIs = mod.importers.some((importer) => staticImportedByEntry(importer, getModuleInfo, cache, importStack.concat(id)));
    cache.set(id, someImporterIs);
    return someImporterIs;
}
function splitVendorChunkPlugin() {
    const caches = [];
    function createSplitVendorChunk(output, config) {
        const cache = new SplitVendorChunkCache();
        caches.push(cache);
        const build = config.build ?? {};
        const format = output?.format;
        if (!build.ssr && !build.lib && format !== 'umd' && format !== 'iife') {
            return splitVendorChunk({ cache });
        }
    }
    return {
        name: 'vite:split-vendor-chunk',
        config(config) {
            let outputs = config?.build?.rollupOptions?.output;
            if (outputs) {
                outputs = Array.isArray(outputs) ? outputs : [outputs];
                for (const output of outputs) {
                    const viteManualChunks = createSplitVendorChunk(output, config);
                    if (viteManualChunks) {
                        if (output.manualChunks) {
                            if (typeof output.manualChunks === 'function') {
                                const userManualChunks = output.manualChunks;
                                output.manualChunks = (id, api) => {
                                    return userManualChunks(id, api) ?? viteManualChunks(id, api);
                                };
                            }
                            // else, leave the object form of manualChunks untouched, as
                            // we can't safely replicate rollup handling.
                        }
                        else {
                            output.manualChunks = viteManualChunks;
                        }
                    }
                }
            }
            else {
                return {
                    build: {
                        rollupOptions: {
                            output: {
                                manualChunks: createSplitVendorChunk({}, config)
                            }
                        }
                    }
                };
            }
        },
        buildStart() {
            caches.forEach((cache) => cache.reset());
        }
    };
}

export { splitVendorChunk, splitVendorChunkPlugin };
