var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});

// src/index.ts
import fs8 from "fs";

// src/utils/log.ts
import { cyan, yellow, red } from "kleur/colors";
import debug from "debug";
var levels = ["debug", "info", "warn", "error", "silent"];
var prefix = "vite-plugin-svelte";
var loggers = {
  debug: {
    log: debug(`vite:${prefix}`),
    enabled: false,
    isDebug: true
  },
  info: {
    color: cyan,
    log: console.log,
    enabled: true
  },
  warn: {
    color: yellow,
    log: console.warn,
    enabled: true
  },
  error: {
    color: red,
    log: console.error,
    enabled: true
  },
  silent: {
    enabled: false
  }
};
var _level = "info";
function setLevel(level) {
  if (level === _level) {
    return;
  }
  const levelIndex = levels.indexOf(level);
  if (levelIndex > -1) {
    _level = level;
    for (let i = 0; i < levels.length; i++) {
      loggers[levels[i]].enabled = i >= levelIndex;
    }
  } else {
    _log(loggers.error, `invalid log level: ${level} `);
  }
}
function _log(logger, message, payload) {
  if (!logger.enabled) {
    return;
  }
  if (logger.isDebug) {
    payload !== void 0 ? logger.log(message, payload) : logger.log(message);
  } else {
    logger.log(logger.color(`${new Date().toLocaleTimeString()} [${prefix}] ${message}`));
    if (payload) {
      logger.log(payload);
    }
  }
}
function createLogger(level) {
  const logger = loggers[level];
  const logFn = _log.bind(null, logger);
  const logged = /* @__PURE__ */ new Set();
  const once = function(message, payload) {
    if (logged.has(message)) {
      return;
    }
    logged.add(message);
    logFn.apply(null, [message, payload]);
  };
  Object.defineProperty(logFn, "enabled", {
    get() {
      return logger.enabled;
    }
  });
  Object.defineProperty(logFn, "once", {
    get() {
      return once;
    }
  });
  return logFn;
}
var log = {
  debug: createLogger("debug"),
  info: createLogger("info"),
  warn: createLogger("warn"),
  error: createLogger("error"),
  setLevel
};
function logCompilerWarnings(svelteRequest, warnings, options) {
  var _a, _b, _c;
  const { emitCss, onwarn, isBuild } = options;
  const sendViaWS = !isBuild && ((_a = options.experimental) == null ? void 0 : _a.sendWarningsToBrowser);
  let warn = isBuild ? warnBuild : warnDev;
  const handledByDefaultWarn = [];
  const notIgnored = warnings == null ? void 0 : warnings.filter((w) => !ignoreCompilerWarning(w, isBuild, emitCss));
  const extra = buildExtraWarnings(warnings, isBuild);
  const allWarnings = [...notIgnored, ...extra];
  if (sendViaWS) {
    const _warn = warn;
    warn = (w) => {
      handledByDefaultWarn.push(w);
      _warn(w);
    };
  }
  allWarnings.forEach((warning) => {
    if (onwarn) {
      onwarn(warning, warn);
    } else {
      warn(warning);
    }
  });
  if (sendViaWS) {
    const message = {
      id: svelteRequest.id,
      filename: svelteRequest.filename,
      normalizedFilename: svelteRequest.normalizedFilename,
      timestamp: svelteRequest.timestamp,
      warnings: handledByDefaultWarn,
      allWarnings,
      rawWarnings: warnings
    };
    log.debug(`sending svelte:warnings message for ${svelteRequest.normalizedFilename}`);
    (_c = (_b = options.server) == null ? void 0 : _b.ws) == null ? void 0 : _c.send("svelte:warnings", message);
  }
}
function ignoreCompilerWarning(warning, isBuild, emitCss) {
  return !emitCss && warning.code === "css-unused-selector" || !isBuild && isNoScopableElementWarning(warning);
}
function isNoScopableElementWarning(warning) {
  return warning.code === "css-unused-selector" && warning.message.includes('"*"');
}
function buildExtraWarnings(warnings, isBuild) {
  const extraWarnings = [];
  if (!isBuild) {
    const noScopableElementWarnings = warnings.filter((w) => isNoScopableElementWarning(w));
    if (noScopableElementWarnings.length > 0) {
      const noScopableElementWarning = noScopableElementWarnings[noScopableElementWarnings.length - 1];
      extraWarnings.push({
        ...noScopableElementWarning,
        code: "vite-plugin-svelte-css-no-scopable-elements",
        message: `No scopable elements found in template. If you're using global styles in the style tag, you should move it into an external stylesheet file and import it in JS. See https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/faq.md#where-should-i-put-my-global-styles.`
      });
    }
  }
  return extraWarnings;
}
function warnDev(w) {
  log.info.enabled && log.info(buildExtendedLogMessage(w));
}
function warnBuild(w) {
  log.warn.enabled && log.warn(buildExtendedLogMessage(w), w.frame);
}
function buildExtendedLogMessage(w) {
  const parts = [];
  if (w.filename) {
    parts.push(w.filename);
  }
  if (w.start) {
    parts.push(":", w.start.line, ":", w.start.column);
  }
  if (w.message) {
    if (parts.length > 0) {
      parts.push(" ");
    }
    parts.push(w.message);
  }
  return parts.join("");
}

// src/handle-hot-update.ts
async function handleHotUpdate(compileSvelte2, ctx, svelteRequest, cache, options) {
  if (!cache.has(svelteRequest)) {
    log.debug(`handleHotUpdate called before initial transform for ${svelteRequest.id}`);
    return;
  }
  const { read, server } = ctx;
  const cachedJS = cache.getJS(svelteRequest);
  const cachedCss = cache.getCSS(svelteRequest);
  const content = await read();
  let compileData;
  try {
    compileData = await compileSvelte2(svelteRequest, content, options);
    cache.update(compileData);
  } catch (e) {
    cache.setError(svelteRequest, e);
    throw e;
  }
  const affectedModules = /* @__PURE__ */ new Set();
  const cssModule = server.moduleGraph.getModuleById(svelteRequest.cssId);
  const mainModule = server.moduleGraph.getModuleById(svelteRequest.id);
  const cssUpdated = cssModule && cssChanged(cachedCss, compileData.compiled.css);
  if (cssUpdated) {
    log.debug(`handleHotUpdate css changed for ${svelteRequest.cssId}`);
    affectedModules.add(cssModule);
  }
  const jsUpdated = mainModule && jsChanged(cachedJS, compileData.compiled.js, svelteRequest.filename);
  if (jsUpdated) {
    log.debug(`handleHotUpdate js changed for ${svelteRequest.id}`);
    affectedModules.add(mainModule);
  }
  if (!jsUpdated) {
    logCompilerWarnings(svelteRequest, compileData.compiled.warnings, options);
  }
  const result = [...affectedModules].filter(Boolean);
  const ssrModulesToInvalidate = result.filter((m) => !!m.ssrTransformResult);
  if (ssrModulesToInvalidate.length > 0) {
    log.debug(`invalidating modules ${ssrModulesToInvalidate.map((m) => m.id).join(", ")}`);
    ssrModulesToInvalidate.forEach((moduleNode) => server.moduleGraph.invalidateModule(moduleNode));
  }
  if (result.length > 0) {
    log.debug(`handleHotUpdate for ${svelteRequest.id} result: ${result.map((m) => m.id).join(", ")}`);
  }
  return result;
}
function cssChanged(prev, next) {
  return !isCodeEqual(prev == null ? void 0 : prev.code, next == null ? void 0 : next.code);
}
function jsChanged(prev, next, filename) {
  const prevJs = prev == null ? void 0 : prev.code;
  const nextJs = next == null ? void 0 : next.code;
  const isStrictEqual = isCodeEqual(prevJs, nextJs);
  if (isStrictEqual) {
    return false;
  }
  const isLooseEqual = isCodeEqual(normalizeJsCode(prevJs), normalizeJsCode(nextJs));
  if (!isStrictEqual && isLooseEqual) {
    log.warn(`ignoring compiler output js change for ${filename} as it is equal to previous output after normalization`);
  }
  return !isLooseEqual;
}
function isCodeEqual(prev, next) {
  if (!prev && !next) {
    return true;
  }
  if (!prev && next || prev && !next) {
    return false;
  }
  return prev === next;
}
function normalizeJsCode(code) {
  if (!code) {
    return code;
  }
  return code.replace(/\s*\badd_location\s*\([^)]*\)\s*;?/g, "");
}

// src/utils/compile.ts
import { compile, preprocess, walk } from "svelte/compiler";
import { createMakeHot } from "svelte-hmr";

// src/utils/hash.ts
import * as crypto from "crypto";
var hashes = /* @__PURE__ */ Object.create(null);
var hash_length = 12;
function safeBase64Hash(input) {
  if (hashes[input]) {
    return hashes[input];
  }
  const md5 = crypto.createHash("md5");
  md5.update(input);
  const hash = toSafe(md5.digest("base64")).slice(0, hash_length);
  hashes[input] = hash;
  return hash;
}
var replacements = {
  "+": "-",
  "/": "_",
  "=": ""
};
var replaceRE = new RegExp(`[${Object.keys(replacements).join("")}]`, "g");
function toSafe(base64) {
  return base64.replace(replaceRE, (x) => replacements[x]);
}

// src/utils/compile.ts
var scriptLangRE = /<script [^>]*lang=["']?([^"' >]+)["']?[^>]*>/;
var _createCompileSvelte = (makeHot) => async function compileSvelte2(svelteRequest, code, options) {
  var _a, _b, _c;
  const { filename, normalizedFilename, cssId, ssr } = svelteRequest;
  const { emitCss = true } = options;
  const dependencies = [];
  const compileOptions = {
    ...options.compilerOptions,
    filename,
    generate: ssr ? "ssr" : "dom",
    format: "esm"
  };
  if (options.hot && options.emitCss) {
    const hash = `s-${safeBase64Hash(normalizedFilename)}`;
    log.debug(`setting cssHash ${hash} for ${normalizedFilename}`);
    compileOptions.cssHash = () => hash;
  }
  if (ssr && compileOptions.enableSourcemap !== false) {
    if (typeof compileOptions.enableSourcemap === "object") {
      compileOptions.enableSourcemap.css = false;
    } else {
      compileOptions.enableSourcemap = { js: true, css: false };
    }
  }
  let preprocessed;
  if (options.preprocess) {
    try {
      preprocessed = await preprocess(code, options.preprocess, { filename });
    } catch (e) {
      e.message = `Error while preprocessing ${filename}${e.message ? ` - ${e.message}` : ""}`;
      throw e;
    }
    if (preprocessed.dependencies)
      dependencies.push(...preprocessed.dependencies);
    if (preprocessed.map)
      compileOptions.sourcemap = preprocessed.map;
  }
  const finalCode = preprocessed ? preprocessed.code : code;
  const dynamicCompileOptions = await ((_b = (_a = options.experimental) == null ? void 0 : _a.dynamicCompileOptions) == null ? void 0 : _b.call(_a, {
    filename,
    code: finalCode,
    compileOptions
  }));
  if (dynamicCompileOptions && log.debug.enabled) {
    log.debug(`dynamic compile options for  ${filename}: ${JSON.stringify(dynamicCompileOptions)}`);
  }
  const finalCompileOptions = dynamicCompileOptions ? {
    ...compileOptions,
    ...dynamicCompileOptions
  } : compileOptions;
  const compiled = compile(finalCode, finalCompileOptions);
  if (emitCss && compiled.css.code) {
    compiled.js.code += `
import ${JSON.stringify(cssId)};
`;
  }
  if (!ssr && makeHot) {
    compiled.js.code = makeHot({
      id: filename,
      compiledCode: compiled.js.code,
      hotOptions: options.hot,
      compiled,
      originalCode: code,
      compileOptions: finalCompileOptions
    });
  }
  compiled.js.dependencies = dependencies;
  return {
    filename,
    normalizedFilename,
    lang: ((_c = code.match(scriptLangRE)) == null ? void 0 : _c[1]) || "js",
    compiled,
    ssr,
    dependencies
  };
};
function buildMakeHot(options) {
  var _a, _b;
  const needsMakeHot = options.hot !== false && options.isServe && !options.isProduction;
  if (needsMakeHot) {
    const hotApi = (_a = options == null ? void 0 : options.hot) == null ? void 0 : _a.hotApi;
    const adapter = (_b = options == null ? void 0 : options.hot) == null ? void 0 : _b.adapter;
    return createMakeHot({
      walk,
      hotApi,
      adapter,
      hotOptions: { noOverlay: true, ...options.hot }
    });
  }
}
function createCompileSvelte(options) {
  const makeHot = buildMakeHot(options);
  return _createCompileSvelte(makeHot);
}

// src/utils/id.ts
import { createFilter } from "@rollup/pluginutils";
import { normalizePath } from "vite";
import * as fs from "fs";
var VITE_FS_PREFIX = "/@fs/";
var IS_WINDOWS = process.platform === "win32";
function splitId(id) {
  const parts = id.split(`?`, 2);
  const filename = parts[0];
  const rawQuery = parts[1];
  return { filename, rawQuery };
}
function parseToSvelteRequest(id, filename, rawQuery, root, timestamp, ssr) {
  const query = parseRequestQuery(rawQuery);
  if (query.url || query.raw) {
    return;
  }
  const normalizedFilename = normalize(filename, root);
  const cssId = createVirtualImportId(filename, root, "style");
  return {
    id,
    filename,
    normalizedFilename,
    cssId,
    query,
    timestamp,
    ssr
  };
}
function createVirtualImportId(filename, root, type) {
  const parts = ["svelte", `type=${type}`];
  if (type === "style") {
    parts.push("lang.css");
  }
  if (existsInRoot(filename, root)) {
    filename = root + filename;
  } else if (filename.startsWith(VITE_FS_PREFIX)) {
    filename = IS_WINDOWS ? filename.slice(VITE_FS_PREFIX.length) : filename.slice(VITE_FS_PREFIX.length - 1);
  }
  return `${filename}?${parts.join("&")}`;
}
function parseRequestQuery(rawQuery) {
  const query = Object.fromEntries(new URLSearchParams(rawQuery));
  for (const key in query) {
    if (query[key] === "") {
      query[key] = true;
    }
  }
  return query;
}
function normalize(filename, normalizedRoot) {
  return stripRoot(normalizePath(filename), normalizedRoot);
}
function existsInRoot(filename, root) {
  if (filename.startsWith(VITE_FS_PREFIX)) {
    return false;
  }
  return fs.existsSync(root + filename);
}
function stripRoot(normalizedFilename, normalizedRoot) {
  return normalizedFilename.startsWith(normalizedRoot + "/") ? normalizedFilename.slice(normalizedRoot.length) : normalizedFilename;
}
function buildFilter(include, exclude, extensions) {
  const rollupFilter = createFilter(include, exclude);
  return (filename) => rollupFilter(filename) && extensions.some((ext) => filename.endsWith(ext));
}
function buildIdParser(options) {
  const { include, exclude, extensions, root } = options;
  const normalizedRoot = normalizePath(root);
  const filter = buildFilter(include, exclude, extensions);
  return (id, ssr, timestamp = Date.now()) => {
    const { filename, rawQuery } = splitId(id);
    if (filter(filename)) {
      return parseToSvelteRequest(id, filename, rawQuery, normalizedRoot, timestamp, ssr);
    }
  };
}

// src/utils/options.ts
import {
  normalizePath as normalizePath2
} from "vite";

// src/utils/load-svelte-config.ts
import { createRequire } from "module";
import path from "path";
import fs2 from "fs";
import { pathToFileURL } from "url";
var esmRequire;
var knownSvelteConfigNames = [
  "svelte.config.js",
  "svelte.config.cjs",
  "svelte.config.mjs"
];
var dynamicImportDefault = new Function("path", "timestamp", 'return import(path + "?t=" + timestamp).then(m => m.default)');
async function loadSvelteConfig(viteConfig, inlineOptions) {
  if ((inlineOptions == null ? void 0 : inlineOptions.configFile) === false) {
    return;
  }
  const configFile = findConfigToLoad(viteConfig, inlineOptions);
  if (configFile) {
    let err;
    if (configFile.endsWith(".js") || configFile.endsWith(".mjs")) {
      try {
        const result = await dynamicImportDefault(pathToFileURL(configFile).href, fs2.statSync(configFile).mtimeMs);
        if (result != null) {
          return {
            ...result,
            configFile
          };
        } else {
          throw new Error(`invalid export in ${configFile}`);
        }
      } catch (e) {
        log.error(`failed to import config ${configFile}`, e);
        err = e;
      }
    }
    if (!configFile.endsWith(".mjs")) {
      try {
        const _require = import.meta.url ? esmRequire ?? (esmRequire = createRequire(import.meta.url)) : __require;
        delete _require.cache[_require.resolve(configFile)];
        const result = _require(configFile);
        if (result != null) {
          return {
            ...result,
            configFile
          };
        } else {
          throw new Error(`invalid export in ${configFile}`);
        }
      } catch (e) {
        log.error(`failed to require config ${configFile}`, e);
        if (!err) {
          err = e;
        }
      }
    }
    throw err;
  }
}
function findConfigToLoad(viteConfig, inlineOptions) {
  const root = (viteConfig == null ? void 0 : viteConfig.root) || process.cwd();
  if (inlineOptions == null ? void 0 : inlineOptions.configFile) {
    const abolutePath = path.isAbsolute(inlineOptions.configFile) ? inlineOptions.configFile : path.resolve(root, inlineOptions.configFile);
    if (!fs2.existsSync(abolutePath)) {
      throw new Error(`failed to find svelte config file ${abolutePath}.`);
    }
    return abolutePath;
  } else {
    const existingKnownConfigFiles = knownSvelteConfigNames.map((candidate) => path.resolve(root, candidate)).filter((file) => fs2.existsSync(file));
    if (existingKnownConfigFiles.length === 0) {
      log.debug(`no svelte config found at ${root}`);
      return;
    } else if (existingKnownConfigFiles.length > 1) {
      log.warn(`found more than one svelte config file, using ${existingKnownConfigFiles[0]}. you should only have one!`, existingKnownConfigFiles);
    }
    return existingKnownConfigFiles[0];
  }
}

// src/utils/constants.ts
var VITE_RESOLVE_MAIN_FIELDS = ["module", "jsnext:main", "jsnext"];
var SVELTE_RESOLVE_MAIN_FIELDS = ["svelte", ...VITE_RESOLVE_MAIN_FIELDS];
var SVELTE_IMPORTS = [
  "svelte/animate",
  "svelte/easing",
  "svelte/internal",
  "svelte/motion",
  "svelte/ssr",
  "svelte/store",
  "svelte/transition",
  "svelte"
];
var SVELTE_HMR_IMPORTS = [
  "svelte-hmr/runtime/hot-api-esm.js",
  "svelte-hmr/runtime/proxy-adapter-dom.js",
  "svelte-hmr"
];

// src/utils/options.ts
import path4 from "path";

// src/utils/dependencies.ts
import path2 from "path";
import fs3 from "fs";
import { createRequire as createRequire2 } from "module";
function findRootSvelteDependencies(root, cwdFallback = true) {
  log.debug(`findSvelteDependencies: searching svelte dependencies in ${root}`);
  const pkgFile = path2.join(root, "package.json");
  if (!fs3.existsSync(pkgFile)) {
    if (cwdFallback) {
      const cwd = process.cwd();
      if (root !== cwd) {
        log.debug(`no package.json found in vite root ${root}`);
        return findRootSvelteDependencies(cwd, false);
      }
    }
    log.warn(`no package.json found, findRootSvelteDependencies failed`);
    return [];
  }
  const pkg = parsePkg(root);
  if (!pkg) {
    return [];
  }
  const deps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {})
  ].filter((dep) => !is_common_without_svelte_field(dep));
  return getSvelteDependencies(deps, root);
}
function getSvelteDependencies(deps, pkgDir, path9 = []) {
  const result = [];
  const localRequire = createRequire2(`${pkgDir}/package.json`);
  const resolvedDeps = deps.map((dep) => resolveDependencyData(dep, localRequire)).filter(Boolean);
  for (const { pkg, dir } of resolvedDeps) {
    const type = getSvelteDependencyType(pkg);
    if (!type)
      continue;
    result.push({ name: pkg.name, type, pkg, dir, path: path9 });
    if (type === "component-library" && pkg.dependencies) {
      let dependencyNames = Object.keys(pkg.dependencies);
      const circular = dependencyNames.filter((name) => path9.includes(name));
      if (circular.length > 0) {
        log.warn.enabled && log.warn(`skipping circular svelte dependencies in automated vite optimizeDeps handling`, circular.map((x) => path9.concat(x).join(">")));
        dependencyNames = dependencyNames.filter((name) => !path9.includes(name));
      }
      if (path9.length === 3) {
        log.debug.once(`encountered deep svelte dependency tree: ${path9.join(">")}`);
      }
      result.push(...getSvelteDependencies(dependencyNames, dir, path9.concat(pkg.name)));
    }
  }
  return result;
}
function resolveDependencyData(dep, localRequire) {
  try {
    const pkgJson = `${dep}/package.json`;
    const pkg = localRequire(pkgJson);
    const dir = path2.dirname(localRequire.resolve(pkgJson));
    return { dir, pkg };
  } catch (e) {
    log.debug.once(`dependency ${dep} does not export package.json`, e);
    try {
      let dir = path2.dirname(localRequire.resolve(dep));
      while (dir) {
        const pkg = parsePkg(dir, true);
        if (pkg && pkg.name === dep) {
          return { dir, pkg };
        }
        const parent = path2.dirname(dir);
        if (parent === dir) {
          break;
        }
        dir = parent;
      }
    } catch (e2) {
      log.debug.once(`error while trying to find package.json of ${dep}`, e2);
    }
  }
  log.debug.once(`failed to resolve ${dep}`);
}
function parsePkg(dir, silent = false) {
  const pkgFile = path2.join(dir, "package.json");
  try {
    return JSON.parse(fs3.readFileSync(pkgFile, "utf-8"));
  } catch (e) {
    !silent && log.warn.enabled && log.warn(`failed to parse ${pkgFile}`, e);
  }
}
function getSvelteDependencyType(pkg) {
  if (isSvelteComponentLib(pkg)) {
    return "component-library";
  } else if (isSvelteLib(pkg)) {
    return "js-library";
  } else {
    return void 0;
  }
}
function isSvelteComponentLib(pkg) {
  return !!pkg.svelte;
}
function isSvelteLib(pkg) {
  var _a, _b;
  return !!((_a = pkg.dependencies) == null ? void 0 : _a.svelte) || !!((_b = pkg.peerDependencies) == null ? void 0 : _b.svelte);
}
var COMMON_DEPENDENCIES_WITHOUT_SVELTE_FIELD = [
  "@lukeed/uuid",
  "@playwright/test",
  "@sveltejs/vite-plugin-svelte",
  "@sveltejs/kit",
  "autoprefixer",
  "cookie",
  "dotenv",
  "esbuild",
  "eslint",
  "jest",
  "mdsvex",
  "playwright",
  "postcss",
  "prettier",
  "svelte",
  "svelte-check",
  "svelte-hmr",
  "svelte-preprocess",
  "tslib",
  "typescript",
  "vite",
  "vitest",
  "__vite-browser-external"
];
var COMMON_PREFIXES_WITHOUT_SVELTE_FIELD = [
  "@fontsource/",
  "@postcss-plugins/",
  "@rollup/",
  "@sveltejs/adapter-",
  "@types/",
  "@typescript-eslint/",
  "eslint-",
  "jest-",
  "postcss-plugin-",
  "prettier-plugin-",
  "rollup-plugin-",
  "vite-plugin-"
];
function is_common_without_svelte_field(dependency) {
  return COMMON_DEPENDENCIES_WITHOUT_SVELTE_FIELD.includes(dependency) || COMMON_PREFIXES_WITHOUT_SVELTE_FIELD.some((prefix2) => prefix2.startsWith("@") ? dependency.startsWith(prefix2) : dependency.substring(dependency.lastIndexOf("/") + 1).startsWith(prefix2));
}
function needsOptimization(dep, localRequire) {
  const depData = resolveDependencyData(dep, localRequire);
  if (!depData)
    return false;
  const pkg = depData.pkg;
  const hasEsmFields = pkg.module || pkg.exports;
  if (hasEsmFields)
    return false;
  if (pkg.main) {
    const entryExt = path2.extname(pkg.main);
    return !entryExt || entryExt === ".js" || entryExt === ".cjs";
  } else {
    try {
      localRequire.resolve(`${dep}/index.js`);
      return true;
    } catch {
      return false;
    }
  }
}

// src/utils/options.ts
import { createRequire as createRequire3 } from "module";

// src/utils/esbuild.ts
import { promises as fs4 } from "fs";
import { compile as compile2, preprocess as preprocess2 } from "svelte/compiler";

// src/utils/error.ts
function toRollupError(error, options) {
  const { filename, frame, start, code, name, stack } = error;
  const rollupError = {
    name,
    id: filename,
    message: buildExtendedLogMessage(error),
    frame: formatFrameForVite(frame),
    code,
    stack: options.isBuild || options.isDebug || !frame ? stack : ""
  };
  if (start) {
    rollupError.loc = {
      line: start.line,
      column: start.column,
      file: filename
    };
  }
  return rollupError;
}
function toESBuildError(error, options) {
  const { filename, frame, start, stack } = error;
  const partialMessage = {
    text: buildExtendedLogMessage(error)
  };
  if (start) {
    partialMessage.location = {
      line: start.line,
      column: start.column,
      file: filename,
      lineText: lineFromFrame(start.line, frame)
    };
  }
  if (options.isBuild || options.isDebug || !frame) {
    partialMessage.detail = stack;
  }
  return partialMessage;
}
function lineFromFrame(lineNo, frame) {
  if (!frame) {
    return "";
  }
  const lines = frame.split("\n");
  const errorLine = lines.find((line) => line.trimStart().startsWith(`${lineNo}: `));
  return errorLine ? errorLine.substring(errorLine.indexOf(": ") + 3) : "";
}
function formatFrameForVite(frame) {
  if (!frame) {
    return "";
  }
  return frame.split("\n").map((line) => line.match(/^\s+\^/) ? "   " + line : " " + line.replace(":", " | ")).join("\n");
}

// src/utils/esbuild.ts
var facadeEsbuildSveltePluginName = "vite-plugin-svelte:facade";
function esbuildSveltePlugin(options) {
  return {
    name: "vite-plugin-svelte:optimize-svelte",
    setup(build) {
      var _a;
      if ((_a = build.initialOptions.plugins) == null ? void 0 : _a.some((v) => v.name === "vite:dep-scan"))
        return;
      const svelteExtensions = (options.extensions ?? [".svelte"]).map((ext) => ext.slice(1));
      const svelteFilter = new RegExp(`\\.(` + svelteExtensions.join("|") + `)(\\?.*)?$`);
      build.onLoad({ filter: svelteFilter }, async ({ path: filename }) => {
        const code = await fs4.readFile(filename, "utf8");
        try {
          const contents = await compileSvelte(options, { filename, code });
          return { contents };
        } catch (e) {
          return { errors: [toESBuildError(e, options)] };
        }
      });
    }
  };
}
async function compileSvelte(options, { filename, code }) {
  var _a, _b;
  const compileOptions = {
    ...options.compilerOptions,
    css: true,
    filename,
    format: "esm",
    generate: "dom"
  };
  let preprocessed;
  if (options.preprocess) {
    try {
      preprocessed = await preprocess2(code, options.preprocess, { filename });
    } catch (e) {
      e.message = `Error while preprocessing ${filename}${e.message ? ` - ${e.message}` : ""}`;
      throw e;
    }
    if (preprocessed.map)
      compileOptions.sourcemap = preprocessed.map;
  }
  const finalCode = preprocessed ? preprocessed.code : code;
  const dynamicCompileOptions = await ((_b = (_a = options.experimental) == null ? void 0 : _a.dynamicCompileOptions) == null ? void 0 : _b.call(_a, {
    filename,
    code: finalCode,
    compileOptions
  }));
  if (dynamicCompileOptions && log.debug.enabled) {
    log.debug(`dynamic compile options for  ${filename}: ${JSON.stringify(dynamicCompileOptions)}`);
  }
  const finalCompileOptions = dynamicCompileOptions ? {
    ...compileOptions,
    ...dynamicCompileOptions
  } : compileOptions;
  const compiled = compile2(finalCode, finalCompileOptions);
  return compiled.js.code + "//# sourceMappingURL=" + compiled.js.map.toUrl();
}

// src/utils/preprocess.ts
import {
  transformWithEsbuild
} from "vite";
import MagicString2 from "magic-string";
import { preprocess as preprocess3 } from "svelte/compiler";

// src/utils/sourcemap.ts
import MagicString from "magic-string";
async function buildMagicString(from, to, options) {
  let diff_match_patch, DIFF_DELETE, DIFF_INSERT;
  try {
    const dmpPkg = await import("diff-match-patch");
    diff_match_patch = dmpPkg.diff_match_patch;
    DIFF_INSERT = dmpPkg.DIFF_INSERT;
    DIFF_DELETE = dmpPkg.DIFF_DELETE;
  } catch (e) {
    log.error.once('Failed to import optional dependency "diff-match-patch". Please install it to enable generated sourcemaps.');
    return null;
  }
  const dmp = new diff_match_patch();
  const diffs = dmp.diff_main(from, to);
  dmp.diff_cleanupSemantic(diffs);
  const m = new MagicString(from, options);
  let pos = 0;
  for (let i = 0; i < diffs.length; i++) {
    const diff = diffs[i];
    const nextDiff = diffs[i + 1];
    if (diff[0] === DIFF_DELETE) {
      if ((nextDiff == null ? void 0 : nextDiff[0]) === DIFF_INSERT) {
        m.overwrite(pos, pos + diff[1].length, nextDiff[1]);
        i++;
      } else {
        m.remove(pos, pos + diff[1].length);
      }
      pos += diff[1].length;
    } else if (diff[0] === DIFF_INSERT) {
      if (nextDiff) {
        m.appendRight(pos, diff[1]);
      } else {
        m.append(diff[1]);
      }
    } else {
      pos += diff[1].length;
    }
  }
  return m;
}
async function buildSourceMap(from, to, filename) {
  const m = await buildMagicString(from, to, { filename });
  return m ? m.generateDecodedMap({ source: filename, hires: true, includeContent: false }) : null;
}

// src/utils/preprocess.ts
import path3 from "path";
var supportedStyleLangs = ["css", "less", "sass", "scss", "styl", "stylus", "postcss"];
var supportedScriptLangs = ["ts"];
function createViteScriptPreprocessor() {
  return async ({ attributes, content, filename = "" }) => {
    const lang = attributes.lang;
    if (!supportedScriptLangs.includes(lang))
      return;
    const transformResult = await transformWithEsbuild(content, filename, {
      loader: lang,
      tsconfigRaw: {
        compilerOptions: {
          importsNotUsedAsValues: "preserve",
          preserveValueImports: true
        }
      }
    });
    return {
      code: transformResult.code,
      map: transformResult.map
    };
  };
}
function createViteStylePreprocessor(config) {
  const pluginName = "vite:css";
  const plugin = config.plugins.find((p) => p.name === pluginName);
  if (!plugin) {
    throw new Error(`failed to find plugin ${pluginName}`);
  }
  if (!plugin.transform) {
    throw new Error(`plugin ${pluginName} has no transform`);
  }
  const pluginTransform = plugin.transform.bind(null);
  return async ({ attributes, content, filename = "" }) => {
    var _a, _b;
    const lang = attributes.lang;
    if (!supportedStyleLangs.includes(lang))
      return;
    const moduleId = `${filename}.${lang}`;
    const transformResult = await pluginTransform(content, moduleId);
    if (((_b = (_a = transformResult.map) == null ? void 0 : _a.sources) == null ? void 0 : _b[0]) === moduleId) {
      transformResult.map.sources[0] = path3.basename(filename);
    }
    return {
      code: transformResult.code,
      map: transformResult.map ?? void 0
    };
  };
}
function createVitePreprocessorGroup(config) {
  return {
    markup({ content, filename }) {
      return preprocess3(content, {
        script: createViteScriptPreprocessor(),
        style: createViteStylePreprocessor(config)
      }, { filename });
    }
  };
}
function createInjectScopeEverythingRulePreprocessorGroup() {
  return {
    style({ content, filename }) {
      const s = new MagicString2(content);
      s.append(" *{}");
      return {
        code: s.toString(),
        map: s.generateDecodedMap({
          source: filename ? path3.basename(filename) : void 0,
          hires: true
        })
      };
    }
  };
}
function buildExtraPreprocessors(options, config) {
  var _a, _b;
  const prependPreprocessors = [];
  const appendPreprocessors = [];
  if ((_a = options.experimental) == null ? void 0 : _a.useVitePreprocess) {
    log.debug("adding vite preprocessor");
    prependPreprocessors.push(createVitePreprocessorGroup(config));
  }
  const pluginsWithPreprocessorsDeprecated = config.plugins.filter((p) => p == null ? void 0 : p.sveltePreprocess);
  if (pluginsWithPreprocessorsDeprecated.length > 0) {
    log.warn(`The following plugins use the deprecated 'plugin.sveltePreprocess' field. Please contact their maintainers and ask them to move it to 'plugin.api.sveltePreprocess': ${pluginsWithPreprocessorsDeprecated.map((p) => p.name).join(", ")}`);
    pluginsWithPreprocessorsDeprecated.forEach((p) => {
      if (!p.api) {
        p.api = {};
      }
      if (p.api.sveltePreprocess === void 0) {
        p.api.sveltePreprocess = p.sveltePreprocess;
      } else {
        log.error(`ignoring plugin.sveltePreprocess of ${p.name} because it already defined plugin.api.sveltePreprocess.`);
      }
    });
  }
  const pluginsWithPreprocessors = config.plugins.filter((p) => {
    var _a2;
    return (_a2 = p == null ? void 0 : p.api) == null ? void 0 : _a2.sveltePreprocess;
  });
  const ignored = [], included = [];
  for (const p of pluginsWithPreprocessors) {
    if (options.ignorePluginPreprocessors === true || Array.isArray(options.ignorePluginPreprocessors) && ((_b = options.ignorePluginPreprocessors) == null ? void 0 : _b.includes(p.name))) {
      ignored.push(p);
    } else {
      included.push(p);
    }
  }
  if (ignored.length > 0) {
    log.debug(`Ignoring svelte preprocessors defined by these vite plugins: ${ignored.map((p) => p.name).join(", ")}`);
  }
  if (included.length > 0) {
    log.debug(`Adding svelte preprocessors defined by these vite plugins: ${included.map((p) => p.name).join(", ")}`);
    appendPreprocessors.push(...pluginsWithPreprocessors.map((p) => p.api.sveltePreprocess));
  }
  if (options.hot && options.emitCss) {
    appendPreprocessors.push(createInjectScopeEverythingRulePreprocessorGroup());
  }
  return { prependPreprocessors, appendPreprocessors };
}
function addExtraPreprocessors(options, config) {
  var _a;
  const { prependPreprocessors, appendPreprocessors } = buildExtraPreprocessors(options, config);
  if (prependPreprocessors.length > 0 || appendPreprocessors.length > 0) {
    if (!options.preprocess) {
      options.preprocess = [...prependPreprocessors, ...appendPreprocessors];
    } else if (Array.isArray(options.preprocess)) {
      options.preprocess.unshift(...prependPreprocessors);
      options.preprocess.push(...appendPreprocessors);
    } else {
      options.preprocess = [...prependPreprocessors, options.preprocess, ...appendPreprocessors];
    }
  }
  const generateMissingSourceMaps = !!((_a = options.experimental) == null ? void 0 : _a.generateMissingPreprocessorSourcemaps);
  if (options.preprocess && generateMissingSourceMaps) {
    options.preprocess = Array.isArray(options.preprocess) ? options.preprocess.map((p, i) => validateSourceMapOutputWrapper(p, i)) : validateSourceMapOutputWrapper(options.preprocess, 0);
  }
}
function validateSourceMapOutputWrapper(group, i) {
  const wrapper = {};
  for (const [processorType, processorFn] of Object.entries(group)) {
    wrapper[processorType] = async (options) => {
      var _a;
      const result = await processorFn(options);
      if (result && result.code !== options.content) {
        let invalidMap = false;
        if (!result.map) {
          invalidMap = true;
          log.warn.enabled && log.warn.once(`preprocessor at index ${i} did not return a sourcemap for ${processorType} transform`, {
            filename: options.filename,
            type: processorType,
            processor: processorFn.toString()
          });
        } else if (((_a = result.map) == null ? void 0 : _a.mappings) === "") {
          invalidMap = true;
          log.warn.enabled && log.warn.once(`preprocessor at index ${i} returned an invalid empty sourcemap for ${processorType} transform`, {
            filename: options.filename,
            type: processorType,
            processor: processorFn.toString()
          });
        }
        if (invalidMap) {
          try {
            const map = await buildSourceMap(options.content, result.code, options.filename);
            if (map) {
              log.debug.enabled && log.debug(`adding generated sourcemap to preprocesor result for ${options.filename}`);
              result.map = map;
            }
          } catch (e) {
            log.error(`failed to build sourcemap`, e);
          }
        }
      }
      return result;
    };
  }
  return wrapper;
}

// src/utils/options.ts
import deepmerge from "deepmerge";
var allowedPluginOptions = /* @__PURE__ */ new Set([
  "include",
  "exclude",
  "emitCss",
  "hot",
  "ignorePluginPreprocessors",
  "disableDependencyReinclusion",
  "experimental"
]);
var knownRootOptions = /* @__PURE__ */ new Set(["extensions", "compilerOptions", "preprocess", "onwarn"]);
var allowedInlineOptions = /* @__PURE__ */ new Set([
  "configFile",
  "kit",
  ...allowedPluginOptions,
  ...knownRootOptions
]);
function validateInlineOptions(inlineOptions) {
  const invalidKeys = Object.keys(inlineOptions || {}).filter((key) => !allowedInlineOptions.has(key));
  if (invalidKeys.length) {
    log.warn(`invalid plugin options "${invalidKeys.join(", ")}" in inline config`, inlineOptions);
  }
}
function convertPluginOptions(config) {
  if (!config) {
    return;
  }
  const invalidRootOptions = Object.keys(config).filter((key) => allowedPluginOptions.has(key));
  if (invalidRootOptions.length > 0) {
    throw new Error(`Invalid options in svelte config. Move the following options into 'vitePlugin:{...}': ${invalidRootOptions.join(", ")}`);
  }
  if (!config.vitePlugin) {
    return config;
  }
  const pluginOptions = config.vitePlugin;
  const pluginOptionKeys = Object.keys(pluginOptions);
  const rootOptionsInPluginOptions = pluginOptionKeys.filter((key) => knownRootOptions.has(key));
  if (rootOptionsInPluginOptions.length > 0) {
    throw new Error(`Invalid options in svelte config under vitePlugin:{...}', move them to the config root : ${rootOptionsInPluginOptions.join(", ")}`);
  }
  const duplicateOptions = pluginOptionKeys.filter((key) => Object.prototype.hasOwnProperty.call(config, key));
  if (duplicateOptions.length > 0) {
    throw new Error(`Invalid duplicate options in svelte config under vitePlugin:{...}', they are defined in root too and must only exist once: ${duplicateOptions.join(", ")}`);
  }
  const unknownPluginOptions = pluginOptionKeys.filter((key) => !allowedPluginOptions.has(key));
  if (unknownPluginOptions.length > 0) {
    log.warn(`ignoring unknown plugin options in svelte config under vitePlugin:{...}: ${unknownPluginOptions.join(", ")}`);
    unknownPluginOptions.forEach((unkownOption) => {
      delete pluginOptions[unkownOption];
    });
  }
  const result = {
    ...config,
    ...pluginOptions
  };
  delete result.vitePlugin;
  return result;
}
async function preResolveOptions(inlineOptions = {}, viteUserConfig, viteEnv) {
  const viteConfigWithResolvedRoot = {
    ...viteUserConfig,
    root: resolveViteRoot(viteUserConfig)
  };
  const defaultOptions = {
    extensions: [".svelte"],
    emitCss: true
  };
  const svelteConfig = convertPluginOptions(await loadSvelteConfig(viteConfigWithResolvedRoot, inlineOptions));
  const extraOptions = {
    root: viteConfigWithResolvedRoot.root,
    isBuild: viteEnv.command === "build",
    isServe: viteEnv.command === "serve",
    isDebug: process.env.DEBUG != null
  };
  const merged = mergeConfigs(defaultOptions, svelteConfig, inlineOptions, extraOptions);
  if (svelteConfig == null ? void 0 : svelteConfig.configFile) {
    merged.configFile = svelteConfig.configFile;
  }
  return merged;
}
function mergeConfigs(...configs) {
  let result = {};
  for (const config of configs.filter(Boolean)) {
    result = deepmerge(result, config, {
      arrayMerge: (target, source) => source ?? target
    });
  }
  return result;
}
function resolveOptions(preResolveOptions2, viteConfig) {
  const defaultOptions = {
    hot: viteConfig.isProduction ? false : { injectCss: !preResolveOptions2.emitCss },
    compilerOptions: {
      css: !preResolveOptions2.emitCss,
      dev: !viteConfig.isProduction
    }
  };
  const extraOptions = {
    root: viteConfig.root,
    isProduction: viteConfig.isProduction
  };
  const merged = mergeConfigs(defaultOptions, preResolveOptions2, extraOptions);
  removeIgnoredOptions(merged);
  addSvelteKitOptions(merged);
  addExtraPreprocessors(merged, viteConfig);
  enforceOptionsForHmr(merged);
  enforceOptionsForProduction(merged);
  return merged;
}
function enforceOptionsForHmr(options) {
  if (options.hot) {
    if (!options.compilerOptions.dev) {
      log.warn("hmr is enabled but compilerOptions.dev is false, forcing it to true");
      options.compilerOptions.dev = true;
    }
    if (options.emitCss) {
      if (options.hot !== true && options.hot.injectCss) {
        log.warn("hmr and emitCss are enabled but hot.injectCss is true, forcing it to false");
        options.hot.injectCss = false;
      }
      if (options.compilerOptions.css) {
        log.warn("hmr and emitCss are enabled but compilerOptions.css is true, forcing it to false");
        options.compilerOptions.css = false;
      }
    } else {
      if (options.hot === true || !options.hot.injectCss) {
        log.warn("hmr with emitCss disabled requires option hot.injectCss to be enabled, forcing it to true");
        if (options.hot === true) {
          options.hot = { injectCss: true };
        } else {
          options.hot.injectCss = true;
        }
      }
      if (!options.compilerOptions.css) {
        log.warn("hmr with emitCss disabled requires compilerOptions.css to be enabled, forcing it to true");
        options.compilerOptions.css = true;
      }
    }
  }
}
function enforceOptionsForProduction(options) {
  if (options.isProduction) {
    if (options.hot) {
      log.warn("options.hot is enabled but does not work on production build, forcing it to false");
      options.hot = false;
    }
    if (options.compilerOptions.dev) {
      log.warn("you are building for production but compilerOptions.dev is true, forcing it to false");
      options.compilerOptions.dev = false;
    }
  }
}
function removeIgnoredOptions(options) {
  const ignoredCompilerOptions = ["generate", "format", "filename"];
  if (options.hot && options.emitCss) {
    ignoredCompilerOptions.push("cssHash");
  }
  const passedCompilerOptions = Object.keys(options.compilerOptions || {});
  const passedIgnored = passedCompilerOptions.filter((o) => ignoredCompilerOptions.includes(o));
  if (passedIgnored.length) {
    log.warn(`The following Svelte compilerOptions are controlled by vite-plugin-svelte and essential to its functionality. User-specified values are ignored. Please remove them from your configuration: ${passedIgnored.join(", ")}`);
    passedIgnored.forEach((ignored) => {
      delete options.compilerOptions[ignored];
    });
  }
}
function addSvelteKitOptions(options) {
  var _a;
  if ((options == null ? void 0 : options.kit) != null) {
    const kit_browser_hydrate = (_a = options.kit.browser) == null ? void 0 : _a.hydrate;
    const hydratable = kit_browser_hydrate !== false;
    if (options.compilerOptions.hydratable != null && options.compilerOptions.hydratable !== hydratable) {
      log.warn(`Conflicting values "compilerOptions.hydratable: ${options.compilerOptions.hydratable}" and "kit.browser.hydrate: ${kit_browser_hydrate}" in your svelte config. You should remove "compilerOptions.hydratable".`);
    }
    log.debug(`Setting compilerOptions.hydratable: ${hydratable} for SvelteKit`);
    options.compilerOptions.hydratable = hydratable;
  }
}
function resolveViteRoot(viteConfig) {
  return normalizePath2(viteConfig.root ? path4.resolve(viteConfig.root) : process.cwd());
}
function buildExtraViteConfig(options, config) {
  var _a;
  const svelteDeps = findRootSvelteDependencies(options.root);
  const extraViteConfig = {
    resolve: {
      mainFields: [...SVELTE_RESOLVE_MAIN_FIELDS],
      dedupe: [...SVELTE_IMPORTS, ...SVELTE_HMR_IMPORTS]
    }
  };
  extraViteConfig.optimizeDeps = buildOptimizeDepsForSvelte(svelteDeps, options, config.optimizeDeps);
  if ((_a = options.experimental) == null ? void 0 : _a.prebundleSvelteLibraries) {
    extraViteConfig.optimizeDeps = {
      ...extraViteConfig.optimizeDeps,
      extensions: options.extensions ?? [".svelte"],
      esbuildOptions: {
        plugins: [{ name: facadeEsbuildSveltePluginName, setup: () => {
        } }]
      }
    };
  }
  extraViteConfig.ssr = buildSSROptionsForSvelte(svelteDeps, options, config, extraViteConfig);
  return extraViteConfig;
}
function buildOptimizeDepsForSvelte(svelteDeps, options, optimizeDeps) {
  var _a;
  const include = [];
  const exclude = ["svelte-hmr"];
  const isIncluded = (dep) => {
    var _a2;
    return include.includes(dep) || ((_a2 = optimizeDeps == null ? void 0 : optimizeDeps.include) == null ? void 0 : _a2.includes(dep));
  };
  const isExcluded = (dep) => {
    var _a2;
    return exclude.includes(dep) || ((_a2 = optimizeDeps == null ? void 0 : optimizeDeps.exclude) == null ? void 0 : _a2.some((id) => dep === id || id.startsWith(`${dep}/`)));
  };
  if (!isExcluded("svelte")) {
    const svelteImportsToInclude = SVELTE_IMPORTS.filter((x) => x !== "svelte/ssr");
    log.debug(`adding bare svelte packages to optimizeDeps.include: ${svelteImportsToInclude.join(", ")} `);
    include.push(...svelteImportsToInclude.filter((x) => !isIncluded(x)));
  } else {
    log.debug('"svelte" is excluded in optimizeDeps.exclude, skipped adding it to include.');
  }
  if ((_a = options.experimental) == null ? void 0 : _a.prebundleSvelteLibraries) {
    return { include, exclude };
  }
  svelteDeps = svelteDeps.filter((dep) => dep.type === "component-library");
  const svelteDepsToExclude = Array.from(new Set(svelteDeps.map((dep) => dep.name))).filter((dep) => !isIncluded(dep));
  log.debug(`automatically excluding found svelte dependencies: ${svelteDepsToExclude.join(", ")}`);
  exclude.push(...svelteDepsToExclude.filter((x) => !isExcluded(x)));
  if (options.disableDependencyReinclusion !== true) {
    const disabledReinclusions = options.disableDependencyReinclusion || [];
    if (disabledReinclusions.length > 0) {
      log.debug(`not reincluding transitive dependencies of`, disabledReinclusions);
    }
    const transitiveDepsToInclude = svelteDeps.filter((dep) => !disabledReinclusions.includes(dep.name) && isExcluded(dep.name)).flatMap((dep) => {
      const localRequire = createRequire3(`${dep.dir}/package.json`);
      return Object.keys(dep.pkg.dependencies || {}).filter((depOfDep) => !isExcluded(depOfDep) && needsOptimization(depOfDep, localRequire)).map((depOfDep) => dep.path.concat(dep.name, depOfDep).join(" > "));
    });
    log.debug(`reincluding transitive dependencies of excluded svelte dependencies`, transitiveDepsToInclude);
    include.push(...transitiveDepsToInclude);
  }
  return { include, exclude };
}
function buildSSROptionsForSvelte(svelteDeps, options, config) {
  var _a, _b;
  const noExternal = [];
  if (!((_b = (_a = config.ssr) == null ? void 0 : _a.external) == null ? void 0 : _b.includes("svelte"))) {
    noExternal.push("svelte", /^svelte\//);
  }
  noExternal.push(...Array.from(new Set(svelteDeps.map((s) => s.name))).filter((x) => {
    var _a2, _b2;
    return !((_b2 = (_a2 = config.ssr) == null ? void 0 : _a2.external) == null ? void 0 : _b2.includes(x));
  }));
  const ssr = {
    noExternal,
    external: []
  };
  if (options.isServe) {
    ssr.external = Array.from(new Set(svelteDeps.flatMap((dep) => Object.keys(dep.pkg.dependencies || {})))).filter((dep) => {
      var _a2, _b2;
      return !ssr.noExternal.includes(dep) && !((_b2 = (_a2 = config.ssr) == null ? void 0 : _a2.external) == null ? void 0 : _b2.includes(dep));
    });
  }
  return ssr;
}
function patchResolvedViteConfig(viteConfig, options) {
  var _a, _b;
  const facadeEsbuildSveltePlugin = (_b = (_a = viteConfig.optimizeDeps.esbuildOptions) == null ? void 0 : _a.plugins) == null ? void 0 : _b.find((plugin) => plugin.name === facadeEsbuildSveltePluginName);
  if (facadeEsbuildSveltePlugin) {
    Object.assign(facadeEsbuildSveltePlugin, esbuildSveltePlugin(options));
  }
}

// src/utils/vite-plugin-svelte-cache.ts
var VitePluginSvelteCache = class {
  constructor() {
    this._css = /* @__PURE__ */ new Map();
    this._js = /* @__PURE__ */ new Map();
    this._dependencies = /* @__PURE__ */ new Map();
    this._dependants = /* @__PURE__ */ new Map();
    this._resolvedSvelteFields = /* @__PURE__ */ new Map();
    this._errors = /* @__PURE__ */ new Map();
  }
  update(compileData) {
    this._errors.delete(compileData.normalizedFilename);
    this.updateCSS(compileData);
    this.updateJS(compileData);
    this.updateDependencies(compileData);
  }
  has(svelteRequest) {
    const id = svelteRequest.normalizedFilename;
    return this._errors.has(id) || this._js.has(id) || this._css.has(id);
  }
  setError(svelteRequest, error) {
    this.remove(svelteRequest, true);
    this._errors.set(svelteRequest.normalizedFilename, error);
  }
  updateCSS(compileData) {
    this._css.set(compileData.normalizedFilename, compileData.compiled.css);
  }
  updateJS(compileData) {
    if (!compileData.ssr) {
      this._js.set(compileData.normalizedFilename, compileData.compiled.js);
    }
  }
  updateDependencies(compileData) {
    const id = compileData.normalizedFilename;
    const prevDependencies = this._dependencies.get(id) || [];
    const dependencies = compileData.dependencies;
    this._dependencies.set(id, dependencies);
    const removed = prevDependencies.filter((d) => !dependencies.includes(d));
    const added = dependencies.filter((d) => !prevDependencies.includes(d));
    added.forEach((d) => {
      if (!this._dependants.has(d)) {
        this._dependants.set(d, /* @__PURE__ */ new Set());
      }
      this._dependants.get(d).add(compileData.filename);
    });
    removed.forEach((d) => {
      this._dependants.get(d).delete(compileData.filename);
    });
  }
  remove(svelteRequest, keepDependencies = false) {
    const id = svelteRequest.normalizedFilename;
    let removed = false;
    if (this._errors.delete(id)) {
      removed = true;
    }
    if (this._js.delete(id)) {
      removed = true;
    }
    if (this._css.delete(id)) {
      removed = true;
    }
    if (!keepDependencies) {
      const dependencies = this._dependencies.get(id);
      if (dependencies) {
        removed = true;
        dependencies.forEach((d) => {
          const dependants = this._dependants.get(d);
          if (dependants && dependants.has(svelteRequest.filename)) {
            dependants.delete(svelteRequest.filename);
          }
        });
        this._dependencies.delete(id);
      }
    }
    return removed;
  }
  getCSS(svelteRequest) {
    return this._css.get(svelteRequest.normalizedFilename);
  }
  getJS(svelteRequest) {
    if (!svelteRequest.ssr) {
      return this._js.get(svelteRequest.normalizedFilename);
    }
  }
  getError(svelteRequest) {
    return this._errors.get(svelteRequest.normalizedFilename);
  }
  getDependants(path9) {
    const dependants = this._dependants.get(path9);
    return dependants ? [...dependants] : [];
  }
  getResolvedSvelteField(name, importer) {
    return this._resolvedSvelteFields.get(this._getResolvedSvelteFieldKey(name, importer));
  }
  setResolvedSvelteField(importee, importer = void 0, resolvedSvelte) {
    this._resolvedSvelteFields.set(this._getResolvedSvelteFieldKey(importee, importer), resolvedSvelte);
  }
  _getResolvedSvelteFieldKey(importee, importer) {
    return importer ? `${importer} > ${importee}` : importee;
  }
};

// src/utils/watch.ts
import fs5 from "fs";
import path5 from "path";
function setupWatchers(options, cache, requestParser) {
  const { server, configFile: svelteConfigFile } = options;
  if (!server) {
    return;
  }
  const { watcher, ws } = server;
  const { root, server: serverConfig } = server.config;
  const emitChangeEventOnDependants = (filename) => {
    const dependants = cache.getDependants(filename);
    dependants.forEach((dependant) => {
      if (fs5.existsSync(dependant)) {
        log.debug(`emitting virtual change event for "${dependant}" because depdendency "${filename}" changed`);
        watcher.emit("change", dependant);
      }
    });
  };
  const removeUnlinkedFromCache = (filename) => {
    const svelteRequest = requestParser(filename, false);
    if (svelteRequest) {
      const removedFromCache = cache.remove(svelteRequest);
      if (removedFromCache) {
        log.debug(`cleared VitePluginSvelteCache for deleted file ${filename}`);
      }
    }
  };
  const triggerViteRestart = (filename) => {
    if (serverConfig.middlewareMode) {
      const message = "Svelte config change detected, restart your dev process to apply the changes.";
      log.info(message, filename);
      ws.send({
        type: "error",
        err: { message, stack: "", plugin: "vite-plugin-svelte", id: filename }
      });
    } else {
      log.info(`svelte config changed: restarting vite server. - file: ${filename}`);
      server.restart();
    }
  };
  const listenerCollection = {
    add: [],
    change: [emitChangeEventOnDependants],
    unlink: [removeUnlinkedFromCache, emitChangeEventOnDependants]
  };
  if (svelteConfigFile !== false) {
    const possibleSvelteConfigs = knownSvelteConfigNames.map((cfg) => path5.join(root, cfg));
    const restartOnConfigAdd = (filename) => {
      if (possibleSvelteConfigs.includes(filename)) {
        triggerViteRestart(filename);
      }
    };
    const restartOnConfigChange = (filename) => {
      if (filename === svelteConfigFile) {
        triggerViteRestart(filename);
      }
    };
    if (svelteConfigFile) {
      listenerCollection.change.push(restartOnConfigChange);
      listenerCollection.unlink.push(restartOnConfigChange);
    } else {
      listenerCollection.add.push(restartOnConfigAdd);
    }
  }
  Object.entries(listenerCollection).forEach(([evt, listeners]) => {
    if (listeners.length > 0) {
      watcher.on(evt, (filename) => listeners.forEach((listener) => listener(filename)));
    }
  });
}
function ensureWatchedFile(watcher, file, root) {
  if (file && !file.startsWith(root + "/") && !file.includes("\0") && fs5.existsSync(file)) {
    watcher.add(path5.resolve(file));
  }
}

// src/utils/resolve.ts
import path6 from "path";
import { builtinModules, createRequire as createRequire4 } from "module";
function resolveViaPackageJsonSvelte(importee, importer, cache) {
  if (importer && isBareImport(importee) && !isNodeInternal(importee) && !is_common_without_svelte_field(importee)) {
    const cached = cache.getResolvedSvelteField(importee, importer);
    if (cached) {
      return cached;
    }
    const localRequire = createRequire4(importer);
    const pkgData = resolveDependencyData(importee, localRequire);
    if (pkgData) {
      const { pkg, dir } = pkgData;
      if (pkg.svelte) {
        const result = path6.resolve(dir, pkg.svelte);
        cache.setResolvedSvelteField(importee, importer, result);
        return result;
      }
    }
  }
}
function isNodeInternal(importee) {
  return importee.startsWith("node:") || builtinModules.includes(importee);
}
function isBareImport(importee) {
  if (!importee || importee[0] === "." || importee[0] === "\0" || importee.includes(":") || path6.isAbsolute(importee)) {
    return false;
  }
  const parts = importee.split("/");
  switch (parts.length) {
    case 1:
      return true;
    case 2:
      return parts[0].startsWith("@");
    default:
      return false;
  }
}

// src/utils/optimizer.ts
import { promises as fs6 } from "fs";
import path7 from "path";
var PREBUNDLE_SENSITIVE_OPTIONS = [
  "compilerOptions",
  "configFile",
  "experimental",
  "extensions",
  "ignorePluginPreprocessors",
  "preprocess"
];
async function saveSvelteMetadata(cacheDir, options) {
  const svelteMetadata = generateSvelteMetadata(options);
  const svelteMetadataPath = path7.resolve(cacheDir, "_svelte_metadata.json");
  const currentSvelteMetadata = JSON.stringify(svelteMetadata, (_, value) => {
    return typeof value === "function" ? value.toString() : value;
  });
  let existingSvelteMetadata;
  try {
    existingSvelteMetadata = await fs6.readFile(svelteMetadataPath, "utf8");
  } catch {
  }
  await fs6.mkdir(cacheDir, { recursive: true });
  await fs6.writeFile(svelteMetadataPath, currentSvelteMetadata);
  return currentSvelteMetadata !== existingSvelteMetadata;
}
function generateSvelteMetadata(options) {
  const metadata = {};
  for (const key of PREBUNDLE_SENSITIVE_OPTIONS) {
    metadata[key] = options[key];
  }
  return metadata;
}

// src/ui/inspector/plugin.ts
import { normalizePath as normalizePath3 } from "vite";
import path8 from "path";
import { fileURLToPath } from "url";
import fs7 from "fs";
var defaultInspectorOptions = {
  toggleKeyCombo: process.platform === "win32" ? "control-shift" : "meta-shift",
  holdMode: false,
  showToggleButton: "active",
  toggleButtonPos: "top-right",
  customStyles: true
};
function getInspectorPath() {
  const pluginPath = normalizePath3(path8.dirname(fileURLToPath(import.meta.url)));
  return pluginPath.replace(/\/vite-plugin-svelte\/dist$/, "/vite-plugin-svelte/src/ui/inspector/");
}
function svelteInspector() {
  const inspectorPath = getInspectorPath();
  log.debug.enabled && log.debug(`svelte inspector path: ${inspectorPath}`);
  let inspectorOptions;
  let appendTo;
  let disabled = false;
  return {
    name: "vite-plugin-svelte:inspector",
    apply: "serve",
    enforce: "pre",
    configResolved(config) {
      var _a, _b, _c;
      const vps = config.plugins.find((p) => p.name === "vite-plugin-svelte");
      if ((_c = (_b = (_a = vps == null ? void 0 : vps.api) == null ? void 0 : _a.options) == null ? void 0 : _b.experimental) == null ? void 0 : _c.inspector) {
        inspectorOptions = {
          ...defaultInspectorOptions,
          ...vps.api.options.experimental.inspector
        };
      }
      if (!vps || !inspectorOptions) {
        log.debug("inspector disabled, could not find config");
        disabled = true;
      } else {
        if (vps.api.options.kit && !inspectorOptions.appendTo) {
          const out_dir = path8.basename(vps.api.options.kit.outDir || ".svelte-kit");
          inspectorOptions.appendTo = `${out_dir}/runtime/client/start.js`;
        }
        appendTo = inspectorOptions.appendTo;
      }
    },
    async resolveId(importee, importer, options) {
      if ((options == null ? void 0 : options.ssr) || disabled) {
        return;
      }
      if (importee.startsWith("virtual:svelte-inspector-options")) {
        return importee;
      } else if (importee.startsWith("virtual:svelte-inspector-path:")) {
        const resolved = importee.replace("virtual:svelte-inspector-path:", inspectorPath);
        log.debug.enabled && log.debug(`resolved ${importee} with ${resolved}`);
        return resolved;
      }
    },
    async load(id, options) {
      if ((options == null ? void 0 : options.ssr) || disabled) {
        return;
      }
      if (id === "virtual:svelte-inspector-options") {
        return `export default ${JSON.stringify(inspectorOptions ?? {})}`;
      } else if (id.startsWith(inspectorPath)) {
        return await fs7.promises.readFile(id, "utf-8");
      }
    },
    transform(code, id, options) {
      if ((options == null ? void 0 : options.ssr) || disabled || !appendTo) {
        return;
      }
      if (id.endsWith(appendTo)) {
        return { code: `${code}
import 'virtual:svelte-inspector-path:load-inspector.js'` };
      }
    },
    transformIndexHtml(html) {
      if (disabled || appendTo) {
        return;
      }
      return {
        html,
        tags: [
          {
            tag: "script",
            injectTo: "body",
            attrs: {
              type: "module",
              src: "/@id/virtual:svelte-inspector-path:load-inspector.js"
            }
          }
        ]
      };
    }
  };
}

// src/index.ts
function svelte(inlineOptions) {
  if (process.env.DEBUG != null) {
    log.setLevel("debug");
  }
  validateInlineOptions(inlineOptions);
  const cache = new VitePluginSvelteCache();
  let requestParser;
  let options;
  let viteConfig;
  let compileSvelte2;
  let resolvedSvelteSSR;
  const api = {};
  const plugins = [
    {
      name: "vite-plugin-svelte",
      enforce: "pre",
      api,
      async config(config, configEnv) {
        if (process.env.DEBUG) {
          log.setLevel("debug");
        } else if (config.logLevel) {
          log.setLevel(config.logLevel);
        }
        options = await preResolveOptions(inlineOptions, config, configEnv);
        const extraViteConfig = buildExtraViteConfig(options, config);
        log.debug("additional vite config", extraViteConfig);
        return extraViteConfig;
      },
      async configResolved(config) {
        options = resolveOptions(options, config);
        patchResolvedViteConfig(config, options);
        requestParser = buildIdParser(options);
        compileSvelte2 = createCompileSvelte(options);
        viteConfig = config;
        api.options = options;
        log.debug("resolved options", options);
      },
      async buildStart() {
        var _a;
        if (!((_a = options.experimental) == null ? void 0 : _a.prebundleSvelteLibraries))
          return;
        const isSvelteMetadataChanged = await saveSvelteMetadata(viteConfig.cacheDir, options);
        if (isSvelteMetadataChanged) {
          viteConfig.optimizeDeps.force = true;
        }
      },
      configureServer(server) {
        options.server = server;
        setupWatchers(options, cache, requestParser);
      },
      load(id, opts) {
        const ssr = !!(opts == null ? void 0 : opts.ssr);
        const svelteRequest = requestParser(id, !!ssr);
        if (svelteRequest) {
          const { filename, query } = svelteRequest;
          if (query.svelte && query.type === "style") {
            const css = cache.getCSS(svelteRequest);
            if (css) {
              log.debug(`load returns css for ${filename}`);
              return css;
            }
          }
          if (viteConfig.assetsInclude(filename)) {
            log.debug(`load returns raw content for ${filename}`);
            return fs8.readFileSync(filename, "utf-8");
          }
        }
      },
      async resolveId(importee, importer, opts) {
        const ssr = !!(opts == null ? void 0 : opts.ssr);
        const svelteRequest = requestParser(importee, ssr);
        if (svelteRequest == null ? void 0 : svelteRequest.query.svelte) {
          if (svelteRequest.query.type === "style") {
            log.debug(`resolveId resolved virtual css module ${svelteRequest.cssId}`);
            return svelteRequest.cssId;
          }
          log.debug(`resolveId resolved ${importee}`);
          return importee;
        }
        if (ssr && importee === "svelte") {
          if (!resolvedSvelteSSR) {
            resolvedSvelteSSR = this.resolve("svelte/ssr", void 0, { skipSelf: true }).then((svelteSSR) => {
              log.debug("resolved svelte to svelte/ssr");
              return svelteSSR;
            }, (err) => {
              log.debug("failed to resolve svelte to svelte/ssr. Update svelte to a version that exports it", err);
              return null;
            });
          }
          return resolvedSvelteSSR;
        }
        try {
          const resolved = resolveViaPackageJsonSvelte(importee, importer, cache);
          if (resolved) {
            log.debug(`resolveId resolved ${resolved} via package.json svelte field of ${importee}`);
            return resolved;
          }
        } catch (e) {
          log.debug.once(`error trying to resolve ${importee} from ${importer} via package.json svelte field `, e);
        }
      },
      async transform(code, id, opts) {
        var _a;
        const ssr = !!(opts == null ? void 0 : opts.ssr);
        const svelteRequest = requestParser(id, ssr);
        if (!svelteRequest || svelteRequest.query.svelte) {
          return;
        }
        let compileData;
        try {
          compileData = await compileSvelte2(svelteRequest, code, options);
        } catch (e) {
          cache.setError(svelteRequest, e);
          throw toRollupError(e, options);
        }
        logCompilerWarnings(svelteRequest, compileData.compiled.warnings, options);
        cache.update(compileData);
        if (((_a = compileData.dependencies) == null ? void 0 : _a.length) && options.server) {
          compileData.dependencies.forEach((d) => {
            ensureWatchedFile(options.server.watcher, d, options.root);
          });
        }
        log.debug(`transform returns compiled js for ${svelteRequest.filename}`);
        return {
          ...compileData.compiled.js,
          meta: {
            vite: {
              lang: compileData.lang
            }
          }
        };
      },
      handleHotUpdate(ctx) {
        if (!options.hot || !options.emitCss) {
          return;
        }
        const svelteRequest = requestParser(ctx.file, false, ctx.timestamp);
        if (svelteRequest) {
          try {
            return handleHotUpdate(compileSvelte2, ctx, svelteRequest, cache, options);
          } catch (e) {
            throw toRollupError(e, options);
          }
        }
      }
    }
  ];
  plugins.push(svelteInspector());
  return plugins.filter(Boolean);
}
export {
  loadSvelteConfig,
  svelte
};
//# sourceMappingURL=index.js.map