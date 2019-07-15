import builtins from 'rollup-plugin-node-builtins';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import nodeglobals from 'rollup-plugin-node-globals';

const lodash_fp_exports = ["union", "reduce", "isUndefined", "cloneDeep", "split", "some", "map", "filter", "isEmpty", "countBy", "includes", "last", "find", "constant", 
"take", "first", "intersection", "mapValues", "isNull", "has", "isNumber", "isString", "isBoolean", "isDate", "isArray", "isObject", "clone", "values", "keyBy", 
"keys", "orderBy", "concat", "reverse", "difference", "merge", "flatten", "each", "pull", "join", "defaultCase", "uniqBy", "every", "uniqWith", "isFunction", "groupBy", 
"differenceBy", "intersectionBy", "isEqual", "max"];

const lodash_exports = ["toNumber", "flow", "isArray", "join", "replace", "trim", "dropRight", "takeRight", "head", "isUndefined", "isNull", "isNaN", "reduce", "isEmpty", 
"constant", "tail", "includes", "startsWith", "findIndex", "isInteger", "isDate", "isString", "split", "clone", "keys", "isFunction", "merge", "has", "isBoolean", "isNumber", 
"isObjectLike", "assign", "some", "each", "find", "orderBy", "union", "cloneDeep"];

const globals = {
    "lodash/fp": "fp",
    lodash: "_",
    lunr: "lunr",
    "safe-buffer": "safe_buffer",
    shortid:"shortid",
    "@nx-js/compiler-util":"compiler_util"
}

module.exports = {
    input: 'src/index.js',
    output: [
        {
            file: 'dist/budibase-core.cjs.js',
            format: 'cjs',
            sourcemap: 'inline',
            globals
        },
        /*{
            file: 'dist/budibase-core.iife.js',
            format: 'iife',
            sourcemap: 'inline',
            globals: [

            ]
        }*/,
        {
            file: 'dist/budibase-core.esm.mjs',
            format: 'esm',
            sourcemap: 'inline',
            globals
        },
        {
            file: 'dist/budibase-core.umd.js',
            format: 'umd',
            name: "budibase-core",
            sourcemap: 'inline',
            globals
        }
    ],
    plugins: [
        nodeglobals(),
        builtins(),
        resolve({
            preferBuiltins:true
        }),
        commonjs({
            namedExports: {
                "lodash/fp": lodash_fp_exports,
                "lodash":lodash_exports,
                "shortid": ["generate"]
            }
        })
    ],
    external: [
        "lodash", "lodash/fp", "date-fns",
        "lunr", "safe-buffer", "shortid",
        "@nx-js/compiler-util"
    ]
  };

  