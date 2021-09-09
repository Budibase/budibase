/* eslint-disable no-unused-vars */
import { ConfigEnv, UserConfig, ViteDevServer, normalizePath } from 'vite';
import { log } from './log';
import { loadSvelteConfig } from './load-svelte-config';
import { SVELTE_HMR_IMPORTS, SVELTE_IMPORTS, SVELTE_RESOLVE_MAIN_FIELDS } from './constants';
// eslint-disable-next-line node/no-missing-import
import { CompileOptions, Warning } from 'svelte/types/compiler/interfaces';
import {
	MarkupPreprocessor,
	Preprocessor,
	PreprocessorGroup,
	Processed
	// eslint-disable-next-line node/no-missing-import
} from 'svelte/types/compiler/preprocess';
import path from 'path';

const knownOptions = new Set([
	'configFile',
	'include',
	'exclude',
	'extensions',
	'emitCss',
	'compilerOptions',
	'onwarn',
	'preprocess',
	'hot',
	'ignorePluginPreprocessors',
	'experimental'
]);

function buildDefaultOptions(isProduction: boolean, options: Partial<Options>): Partial<Options> {
	// emit for prod, emit in dev unless css hmr is disabled
	const emitCss = options?.emitCss != null ? options.emitCss : true;
	// no hmr in prod, only inject css in dev if emitCss is false
	const hot = isProduction
		? false
		: {
				injectCss: !emitCss
		  };
	const defaultOptions: Partial<Options> = {
		extensions: ['.svelte'],
		hot,
		emitCss,
		compilerOptions: {
			format: 'esm',
			css: !emitCss,
			dev: !isProduction
		}
	};
	log.debug(`default options for ${isProduction ? 'production' : 'development'}`, defaultOptions);
	return defaultOptions;
}

export function validateInlineOptions(inlineOptions?: Partial<Options>) {
	const invalidKeys = Object.keys(inlineOptions || {}).filter((key) => !knownOptions.has(key));
	if (invalidKeys.length) {
		log.warn(`invalid plugin options "${invalidKeys.join(', ')}" in config`, inlineOptions);
	}
}

function enforceOptionsForHmr(options: ResolvedOptions) {
	if (options.hot) {
		if (!options.compilerOptions.dev) {
			log.warn('hmr is enabled but compilerOptions.dev is false, forcing it to true');
			options.compilerOptions.dev = true;
		}
		if (options.emitCss) {
			if (options.hot !== true && options.hot.injectCss) {
				log.warn('hmr and emitCss are enabled but hot.injectCss is true, forcing it to false');
				options.hot.injectCss = false;
			}
			if (options.compilerOptions.css) {
				log.warn(
					'hmr and emitCss are enabled but compilerOptions.css is true, forcing it to false'
				);
				options.compilerOptions.css = false;
			}
		} else {
			if (options.hot === true || !options.hot.injectCss) {
				log.warn(
					'hmr with emitCss disabled requires option hot.injectCss to be enabled, forcing it to true'
				);
				if (options.hot === true) {
					options.hot = { injectCss: true };
				} else {
					options.hot.injectCss = true;
				}
			}
			if (!options.compilerOptions.css) {
				log.warn(
					'hmr with emitCss disabled requires compilerOptions.css to be enabled, forcing it to true'
				);
				options.compilerOptions.css = true;
			}
		}
	}
}

function enforceOptionsForProduction(options: ResolvedOptions) {
	if (options.isProduction) {
		if (options.hot) {
			log.warn('options.hot is enabled but does not work on production build, forcing it to false');
			options.hot = false;
		}
		if (options.compilerOptions.dev) {
			log.warn(
				'you are building for production but compilerOptions.dev is true, forcing it to false'
			);
			options.compilerOptions.dev = false;
		}
	}
}

function mergeOptions(
	defaultOptions: Partial<Options>,
	svelteConfig: Partial<Options>,
	inlineOptions: Partial<Options>,
	viteConfig: UserConfig,
	viteEnv: ConfigEnv
): ResolvedOptions {
	const merged = {
		...defaultOptions,
		...svelteConfig,
		...inlineOptions,
		compilerOptions: {
			...defaultOptions.compilerOptions,
			...(svelteConfig?.compilerOptions || {}),
			...(inlineOptions?.compilerOptions || {})
		},
		experimental: {
			...(svelteConfig?.experimental || {}),
			...(inlineOptions?.experimental || {})
		},
		root: viteConfig.root!,
		isProduction: viteEnv.mode === 'production',
		isBuild: viteEnv.command === 'build',
		isServe: viteEnv.command === 'serve'
	};
	// configFile of svelteConfig contains the absolute path it was loaded from,
	// prefer it over the possibly relative inline path
	if (svelteConfig?.configFile) {
		merged.configFile = svelteConfig.configFile;
	}
	return merged;
}

export async function resolveOptions(
	inlineOptions: Partial<Options> = {},
	viteConfig: UserConfig,
	viteEnv: ConfigEnv
): Promise<ResolvedOptions> {
	const viteConfigWithResolvedRoot = {
		...viteConfig,
		root: resolveViteRoot(viteConfig)
	};
	const defaultOptions = buildDefaultOptions(viteEnv.mode === 'production', inlineOptions);
	const svelteConfig = (await loadSvelteConfig(viteConfigWithResolvedRoot, inlineOptions)) || {};
	const resolvedOptions = mergeOptions(
		defaultOptions,
		svelteConfig,
		inlineOptions,
		viteConfigWithResolvedRoot,
		viteEnv
	);

	enforceOptionsForProduction(resolvedOptions);
	enforceOptionsForHmr(resolvedOptions);
	return resolvedOptions;
}

// vite passes unresolved `root`option to config hook but we need the resolved value, so do it here
// https://github.com/sveltejs/vite-plugin-svelte/issues/113
// https://github.com/vitejs/vite/blob/43c957de8a99bb326afd732c962f42127b0a4d1e/packages/vite/src/node/config.ts#L293
function resolveViteRoot(viteConfig: UserConfig): string | undefined {
	return normalizePath(viteConfig.root ? path.resolve(viteConfig.root) : process.cwd());
}

export function buildExtraViteConfig(
	options: ResolvedOptions,
	config: UserConfig
): Partial<UserConfig> {
	const allSvelteImports = [...SVELTE_IMPORTS, ...SVELTE_HMR_IMPORTS];

	// exclude svelte imports from optimization unless explicitly included
	const excludeFromOptimize = allSvelteImports.filter(
		(x) => !config.optimizeDeps?.include?.includes(x)
	);

	const extraViteConfig: Partial<UserConfig> = {
		optimizeDeps: {
			exclude: excludeFromOptimize
		},
		resolve: {
			mainFields: [...SVELTE_RESOLVE_MAIN_FIELDS],
			dedupe: allSvelteImports
		}
		// this option is still awaiting a PR in vite to be supported
		// see https://github.com/sveltejs/vite-plugin-svelte/issues/60
		// @ts-ignore
		// knownJsSrcExtensions: options.extensions
	};

	if (options.isBuild && config.build?.ssr) {
		// add svelte to ssr.noExternal unless it is present in ssr.external
		// so we can resolve it with svelte/ssr
		// @ts-ignore
		if (!config.ssr?.external?.includes('svelte')) {
			// @ts-ignore
			extraViteConfig.ssr = {
				noExternal: ['svelte']
			};
		}
	}

	if (options.experimental?.useVitePreprocess) {
		// needed to transform svelte files with component imports
		// can cause issues with other typescript files, see https://github.com/sveltejs/vite-plugin-svelte/pull/20
		extraViteConfig.esbuild = {
			tsconfigRaw: {
				compilerOptions: {
					importsNotUsedAsValues: 'preserve'
				}
			}
		};
	}
	return extraViteConfig;
}

export interface Options {
	// eslint-disable no-unused-vars
	/** path to svelte config file, either absolute or relative to vite root*/
	configFile?: string;

	/** One or more minimatch patterns */
	include?: Arrayable<string>;

	/** One or more minimatch patterns */
	exclude?: Arrayable<string>;

	/**
	 * By default, all ".svelte" files are compiled
	 * @default ['.svelte']
	 */
	extensions?: string[];

	/**
	 * Optionally, preprocess components with svelte.preprocess:
	 * \@see https://svelte.dev/docs#svelte_preprocess
	 */
	preprocess?: Arrayable<PreprocessorGroup>;

	/** Emit Svelte styles as virtual CSS files for other plugins to process.
	 * @default true
	 */
	emitCss?: boolean;

	/** Options passed to `svelte.compile` method. */
	compilerOptions: Partial<CompileOptions>;

	/**
	 * custom warning handler for svelte compiler warnings
	 */
	onwarn?: (warning: Warning, defaultHandler?: (warning: Warning) => void) => void;

	/**
	 * enable/disable hmr. You want this enabled.
	 *
	 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	 * DO NOT CUSTOMIZE SVELTE-HMR OPTIONS UNLESS YOU KNOW EXACTLY WHAT YOU ARE DOING
	 *
	 *                             YOU HAVE BEEN WARNED
	 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	 *
	 * set to object to pass custom options to svelte-hmr, see https://github.com/rixo/svelte-hmr#options
	 *
	 * @default true for development, always false for production
	 */
	hot?: boolean | { injectCss?: boolean; [key: string]: any };

	/**
	 * vite plugins can contribute additional preprocessors by defining api.sveltePreprocess.
	 * If you don't want to use them, set this to true to ignore them all or use an array of strings with plugin names to specify which
	 *
	 * @default false
	 */
	ignorePluginPreprocessors?: boolean | string[];

	/**
	 * These options are considered experimental and breaking changes to them can occur in any release
	 */
	experimental?: ExperimentalOptions;
}

/**
 * These options are considered experimental and breaking changes to them can occur in any release
 */
export interface ExperimentalOptions {
	/**
	 * use extra preprocessors that delegate style and typescript preproessing to native vite plugins
	 *
	 * do not use together with svelte-preprocess!
	 *
	 * @default false
	 */
	useVitePreprocess?: boolean;

	/**
	 * wrap all preprocessors in with a function that adds a sourcemap to the output if missing
	 *
	 * to use this option you have to install "diff-match-patch"
	 */
	generateMissingPreprocessorSourcemaps?: boolean;

	/**
	 * function to update compilerOptions before compilation
	 *
	 * data.filename is the file to be compiled,
	 * data.code is the already preprocessed code
	 * data.compileOptions are the compilerOptions that are going to be used
	 *
	 * to change one, you should return an object with the changes you need, eg:
	 *
	 * ```
	 * ({filename,compileOptions}) => { if( compileWithHydratable(filename) && !compileOptions.hydratable ){ return {hydratable: true}}}
	 * ```
	 * @default undefined
	 */
	dynamicCompileOptions?: (data: {
		filename: string;
		code: string;
		compileOptions: Partial<CompileOptions>;
	}) => Promise<Partial<CompileOptions> | void> | Partial<CompileOptions> | void;
}

export interface ResolvedOptions extends Options {
	root: string;
	isProduction: boolean;
	isBuild?: boolean;
	isServe?: boolean;
	server?: ViteDevServer;
}

export type {
	CompileOptions,
	Processed,
	MarkupPreprocessor,
	Preprocessor,
	PreprocessorGroup,
	Warning
};

export type ModuleFormat = NonNullable<CompileOptions['format']>;

export type CssHashGetter = NonNullable<CompileOptions['cssHash']>;

export type Arrayable<T> = T | T[];
