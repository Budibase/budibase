import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import nodeglobals from 'rollup-plugin-node-globals';
import { terser } from 'rollup-plugin-terser';

const lodash_fp_exports = [
    "find", "isUndefined", "split", 
    "last", "union", "reduce",
    "cloneDeep", "some"];

const lodash_exports = [
    "flow","reduce", "constant", "head", "isEmpty", 
    "tail", "findIndex", "startsWith", 
    "join", "dropRight", "takeRight", 
    "trim", "split", "includes", "replace", 
    "isArray", "isString", "isInteger", 
    "isDate", "toNumber", "isUndefined",
    "isNull", "isNaN"];

const coreExternal = [
	"lodash", "lodash/fp", "date-fns",
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
            sourcemap: 'inline'
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
        terser()
    ],
	watch: {
		clearScreen: false
	}
};
