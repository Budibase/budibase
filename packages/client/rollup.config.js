import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import nodeglobals from 'rollup-plugin-node-globals';
import { terser } from 'rollup-plugin-terser';

const lodash_fp_exports = [
    "find", "isUndefined", "split", "max",
    "last", "union", "reduce", "isObject",
    "cloneDeep", "some", "isArray", "map",
    "filter", "keys", "isFunction", "isEmpty",
    "countBy", "join", "includes", "flatten",
    "constant", "first", "intersection", "take",
    "has", "mapValues", "isString", "isBoolean",
    "isNull", "isNumber", "isObjectLike", "isDate",
    "clone", "values", "keyBy", "isNaN",
    "isInteger", "toNumber"];

const lodash_exports = [
    "flow", "head",  "find", "each",
    "tail", "findIndex", "startsWith", 
    "dropRight", "takeRight", 
    "trim", "split", "replace", 
    "merge", "assign"];

const coreExternal = [
	"lodash", "lodash/fp", 
	"lunr", "safe-buffer", "shortid",
	"@nx-js/compiler-util"
];

export default {
	input: 'src/index.js',
	output: [
        {
            sourcemap: true,
            format: 'iife',
            name: 'app',
            file: `./dist/budibase-client.js`
        },
        {
            file: 'dist/budibase-client.esm.mjs',
            format: 'esm',
            sourcemap: "inline"
        }
    ],
    plugins: [
       
        resolve({
            preferBuiltins:true,
            browser:true,
            dedupe: importee => {
				return coreExternal.includes(importee);
			}
        }),
        commonjs({
            namedExports: {
                "lodash/fp": lodash_fp_exports,
                "lodash":lodash_exports,
                "shortid": ["generate"]
            }
        }),
        builtins(),
        nodeglobals(),
        //terser()
    ],
	watch: {
		clearScreen: false
	}
};
