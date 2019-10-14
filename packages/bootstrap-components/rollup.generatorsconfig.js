import resolve from 'rollup-plugin-node-resolve';

export default {
	input: 'src/generators.js',
	output: [
		{ 
			file: "dist/generators.js", 
			format: 'esm', 
			name:"budibaseStandardComponents",
			sourcemap: "inline"
		}
	],
	plugins: [
		resolve()
	]
};
