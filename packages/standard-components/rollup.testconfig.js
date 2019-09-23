import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import json from 'rollup-plugin-json';

const production = !process.env.ROLLUP_WATCH;

const lodash_fp_exports = ["union", "reduce", "isUndefined", "cloneDeep", "split", "some", "map", "filter", "isEmpty", "countBy", "includes", "last", "find", "constant", 
"take", "first", "intersection", "mapValues", "isNull", "has", "isNumber", "isString", "isBoolean", "isDate", "isArray", "isObject", "clone", "values", "keyBy", 
"keys", "orderBy", "concat", "reverse", "difference", "merge", "flatten", "each", "pull", "join", "defaultCase", "uniqBy", "every", "uniqWith", "isFunction", "groupBy", 
"differenceBy", "intersectionBy", "isEqual", "max", "sortBy", "assign", "uniq", "trimChars", "trimCharsStart", "isObjectLike", "flattenDeep", "indexOf"];

const lodash_exports = ["toNumber", "flow", "isArray", "join", "replace", "trim", "dropRight", "takeRight", "head", "isUndefined", "isNull", "isNaN", "reduce", "isEmpty", 
"constant", "tail", "includes", "startsWith", "findIndex", "isInteger", "isDate", "isString", "split", "clone", "keys", "isFunction", "merge", "has", "isBoolean", "isNumber", 
"isObjectLike", "assign", "some", "each", "find", "orderBy", "union", "cloneDeep"];

const coreExternal = [
	"lodash", "lodash/fp", "date-fns",
	"lunr", "safe-buffer", "shortid",
	"@nx-js/compiler-util"
];

export default {
	input: 'src/Test/testMain.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/bundle.js'
	},
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file — better for performance
			css: css => {
				css.write('public/bundle.css');
			}
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration —
		// consult the documentation for details:
		// https://github.com/rollup/rollup-plugin-commonjs
		resolve({
			browser: true,
			dedupe: importee => {
				return importee === 'svelte' 
					   || importee.startsWith('svelte/')
					   || coreExternal.includes(importee);
			}
		}),
		commonjs({
			namedExports: {
				"lodash/fp": lodash_fp_exports,
				"lodash":lodash_exports,
				"shortid": ["generate"]
			}
		}),
		json(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
