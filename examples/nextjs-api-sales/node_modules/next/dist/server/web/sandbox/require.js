"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.requireDependencies = requireDependencies;
var _path = require("path");
var _fs = require("fs");
var _vm = require("vm");
function requireDependencies(params) {
    const { context , requireCache , dependencies  } = params;
    const requireFn = createRequire(context, requireCache);
    for (const { path , mapExports  } of dependencies){
        const mod = requireFn(path, path);
        for (const mapKey of Object.keys(mapExports)){
            context[mapExports[mapKey]] = mod[mapKey];
        }
    }
}
function createRequire(context, cache) {
    return function requireFn(referrer, specifier) {
        const resolved = require.resolve(specifier, {
            paths: [
                (0, _path).dirname(referrer)
            ]
        });
        const cached = cache.get(resolved);
        if (cached !== undefined) {
            return cached.exports;
        }
        const module = {
            exports: {
            },
            loaded: false,
            id: resolved
        };
        cache.set(resolved, module);
        const fn = (0, _vm).runInContext(`(function(module,exports,require,__dirname,__filename) {${(0, _fs).readFileSync(resolved, 'utf-8')}\n})`, context);
        try {
            fn(module, module.exports, requireFn.bind(null, resolved), (0, _path).dirname(resolved), resolved);
        } finally{
            cache.delete(resolved);
        }
        module.loaded = true;
        return module.exports;
    };
}

//# sourceMappingURL=require.js.map