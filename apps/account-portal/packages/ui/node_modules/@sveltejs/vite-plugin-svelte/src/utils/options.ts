/* eslint-disable no-unused-vars */
import {
	ConfigEnv,
	DepOptimizationOptions,
	ResolvedConfig,
	UserConfig,
	ViteDevServer,
	normalizePath
} from 'vite';
import { log } from './log';
import { loadSvelteConfig } from './load-svelte-config';
import { SVELTE_HMR_IMPORTS, SVELTE_IMPORTS, SVELTE_RESOLVE_MAIN_FIELDS } from './constants';
// eslint-disable-next-line node/no-missing-import
import type { CompileOptions, Warning } from 'svelte/types/compiler/interfaces';
import type {
	MarkupPreprocessor,
	Preprocessor,
	PreprocessorGroup,
	Processed
	// eslint-disable-next-line node/no-missing-import
} from 'svelte/types/compiler/preprocess';

import path from 'path';
import { findRootSvelteDependencies, needsOptimization, SvelteDependency } from './dependencies';
import { createRequire } from 'module';
import { esbuildSveltePlugin, facadeEsbuildSveltePluginName } from './esbuild';
import { addExtraPreprocessors } from './preprocess';
import deepmerge from 'deepmerge';

const allowedPluginOptions = new Set([
	'include',
	'exclude',
	'emitCss',
	'hot',
	'ignorePluginPreprocessors',
	'disableDependencyReinclusion',
	'experimental'
]);

const knownRootOptions = new Set(['extensions', 'compilerOptions', 'preprocess', 'onwarn']);

const allowedInlineOptions = new Set([
	'configFile',
	'kit', // only for internal use by sveltekit
	...allowedPluginOptions,
	...knownRootOptions
]);

export function validateInlineOptions(inlineOptions?: Partial<Options>) {
	const invalidKeys = Object.keys(inlineOptions || {}).filter(
		(key) => !allowedInlineOptions.has(key)
	);
	if (invalidKeys.length) {
		log.warn(`invalid plugin options "${invalidKeys.join(', ')}" in inline config`, inlineOptions);
	}
}

function convertPluginOptions(config?: Partial<SvelteOptions>): Partial<Options> | undefined {
	if (!config) {
		return;
	}
	const invalidRootOptions = Object.keys(config).filter((key) => allowedPluginOptions.has(key));
	if (invalidRootOptions.length > 0) {
		throw new Error(
			`Invalid options in svelte config. Move the following options into 'vitePlugin:{...}': ${invalidRootOptions.join(
				', '
			)}`
		);
	}
	if (!config.vitePlugin) {
		return config;
	}
	const pluginOptions = config.vitePlugin;
	const pluginOptionKeys = Object.keys(pluginOptions);

	const rootOptionsInPluginOptions = pluginOptionKeys.filter((key) => knownRootOptions.has(key));
	if (rootOptionsInPluginOptions.length > 0) {
		throw new Error(
			`Invalid options in svelte config under vitePlugin:{...}', move them to the config root : ${rootOptionsInPluginOptions.join(
				', '
			)}`
		);
	}
	const duplicateOptions = pluginOptionKeys.filter((key) =>
		Object.prototype.hasOwnProperty.call(config, key)
	);
	if (duplicateOptions.length > 0) {
		throw new Error(
			`Invalid duplicate options in svelte config under vitePlugin:{...}', they are defined in root too and must only exist once: ${duplicateOptions.join(
				', '
			)}`
		);
	}
	const unknownPluginOptions = pluginOptionKeys.filter((key) => !allowedPluginOptions.has(key));
	if (unknownPluginOptions.length > 0) {
		log.warn(
			`ignoring unknown plugin options in svelte config under vitePlugin:{...}: ${unknownPluginOptions.join(
				', '
			)}`
		);
		unknownPluginOptions.forEach((unkownOption) => {
			// @ts-ignore
			delete pluginOptions[unkownOption];
		});
	}

	const result: Options = {
		...config,
		...pluginOptions
	};
	// @ts-expect-error it exists
	delete result.vitePlugin;

	return result;
}

// used in config phase, merges the default options, svelte config, and inline options
export async function preResolveOptions(
	inlineOptions: Partial<Options> = {},
	viteUserConfig: UserConfig,
	viteEnv: ConfigEnv
): Promise<PreResolvedOptions> {
	const viteConfigWithResolvedRoot: UserConfig = {
		...viteUserConfig,
		root: resolveViteRoot(viteUserConfig)
	};
	const defaultOptions: Partial<Options> = {
		extensions: ['.svelte'],
		emitCss: true
	};
	const svelteConfig = convertPluginOptions(
		await loadSvelteConfig(viteConfigWithResolvedRoot, inlineOptions)
	);

	const extraOptions: Partial<PreResolvedOptions> = {
		root: viteConfigWithResolvedRoot.root!,
		isBuild: viteEnv.command === 'build',
		isServe: viteEnv.command === 'serve',
		isDebug: process.env.DEBUG != null
	};
	const merged = mergeConfigs<Partial<PreResolvedOptions> | undefined>(
		defaultOptions,
		svelteConfig,
		inlineOptions,
		extraOptions
	);
	// configFile of svelteConfig contains the absolute path it was loaded from,
	// prefer it over the possibly relative inline path
	if (svelteConfig?.configFile) {
		merged.configFile = svelteConfig.configFile;
	}
	return merged;
}

function mergeConfigs<T>(...configs: T[]): ResolvedOptions {
	let result = {};
	for (const config of configs.filter(Boolean)) {
		result = deepmerge<T>(result, config, {
			// replace arrays
			arrayMerge: (target: any[], source: any[]) => source ?? target
		});
	}
	return result as ResolvedOptions;
}

// used in configResolved phase, merges a contextual default config, pre-resolved options, and some preprocessors.
// also validates the final config.
export function resolveOptions(
	preResolveOptions: PreResolvedOptions,
	viteConfig: ResolvedConfig
): ResolvedOptions {
	const defaultOptions: Partial<Options> = {
		hot: viteConfig.isProduction ? false : { injectCss: !preResolveOptions.emitCss },
		compilerOptions: {
			css: !preResolveOptions.emitCss,
			dev: !viteConfig.isProduction
		}
	};
	const extraOptions: Partial<ResolvedOptions> = {
		root: viteConfig.root,
		isProduction: viteConfig.isProduction
	};
	const merged: ResolvedOptions = mergeConfigs(defaultOptions, preResolveOptions, extraOptions);

	removeIgnoredOptions(merged);
	addSvelteKitOptions(merged);
	addExtraPreprocessors(merged, viteConfig);
	enforceOptionsForHmr(merged);
	enforceOptionsForProduction(merged);
	return merged;
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

function removeIgnoredOptions(options: ResolvedOptions) {
	const ignoredCompilerOptions = ['generate', 'format', 'filename'];
	if (options.hot && options.emitCss) {
		ignoredCompilerOptions.push('cssHash');
	}
	const passedCompilerOptions = Object.keys(options.compilerOptions || {});
	const passedIgnored = passedCompilerOptions.filter((o) => ignoredCompilerOptions.includes(o));
	if (passedIgnored.length) {
		log.warn(
			`The following Svelte compilerOptions are controlled by vite-plugin-svelte and essential to its functionality. User-specified values are ignored. Please remove them from your configuration: ${passedIgnored.join(
				', '
			)}`
		);
		passedIgnored.forEach((ignored) => {
			// @ts-expect-error string access
			delete options.compilerOptions[ignored];
		});
	}
}

// some SvelteKit options need compilerOptions to work, so set them here.
function addSvelteKitOptions(options: ResolvedOptions) {
	// @ts-expect-error kit is not typed to avoid dependency on sveltekit
	if (options?.kit != null) {
		// @ts-expect-error kit is not typed to avoid dependency on sveltekit
		const kit_browser_hydrate = options.kit.browser?.hydrate;
		const hydratable = kit_browser_hydrate !== false;
		if (
			options.compilerOptions.hydratable != null &&
			options.compilerOptions.hydratable !== hydratable
		) {
			log.warn(
				`Conflicting values "compilerOptions.hydratable: ${options.compilerOptions.hydratable}" and "kit.browser.hydrate: ${kit_browser_hydrate}" in your svelte config. You should remove "compilerOptions.hydratable".`
			);
		}
		log.debug(`Setting compilerOptions.hydratable: ${hydratable} for SvelteKit`);
		options.compilerOptions.hydratable = hydratable;
	}
}

// vite passes unresolved `root`option to config hook but we need the resolved value, so do it here
// https://github.com/sveltejs/vite-plugin-svelte/issues/113
// https://github.com/vitejs/vite/blob/43c957de8a99bb326afd732c962f42127b0a4d1e/packages/vite/src/node/config.ts#L293
function resolveViteRoot(viteConfig: UserConfig): string | undefined {
	return normalizePath(viteConfig.root ? path.resolve(viteConfig.root) : process.cwd());
}

export function buildExtraViteConfig(
	options: PreResolvedOptions,
	config: UserConfig
): Partial<UserConfig> {
	// extra handling for svelte dependencies in the project
	const svelteDeps = findRootSvelteDependencies(options.root);
	const extraViteConfig: Partial<UserConfig> = {
		resolve: {
			mainFields: [...SVELTE_RESOLVE_MAIN_FIELDS],
			dedupe: [...SVELTE_IMPORTS, ...SVELTE_HMR_IMPORTS]
		}
		// this option is still awaiting a PR in vite to be supported
		// see https://github.com/sveltejs/vite-plugin-svelte/issues/60
		// @ts-ignore
		// knownJsSrcExtensions: options.extensions
	};

	extraViteConfig.optimizeDeps = buildOptimizeDepsForSvelte(
		svelteDeps,
		options,
		config.optimizeDeps
	);

	if (options.experimental?.prebundleSvelteLibraries) {
		extraViteConfig.optimizeDeps = {
			...extraViteConfig.optimizeDeps,
			// Experimental Vite API to allow these extensions to be scanned and prebundled
			// @ts-ignore
			extensions: options.extensions ?? ['.svelte'],
			// Add esbuild plugin to prebundle Svelte files.
			// Currently a placeholder as more information is needed after Vite config is resolved,
			// the real Svelte plugin is added in `patchResolvedViteConfig()`
			esbuildOptions: {
				plugins: [{ name: facadeEsbuildSveltePluginName, setup: () => {} }]
			}
		};
	}

	// @ts-ignore
	extraViteConfig.ssr = buildSSROptionsForSvelte(svelteDeps, options, config, extraViteConfig);

	return extraViteConfig;
}

function buildOptimizeDepsForSvelte(
	svelteDeps: SvelteDependency[],
	options: PreResolvedOptions,
	optimizeDeps?: DepOptimizationOptions
): DepOptimizationOptions {
	// include svelte imports for optimization unless explicitly excluded
	const include: string[] = [];
	const exclude: string[] = ['svelte-hmr'];
	const isIncluded = (dep: string) => include.includes(dep) || optimizeDeps?.include?.includes(dep);
	const isExcluded = (dep: string) => {
		return (
			exclude.includes(dep) ||
			// vite optimizeDeps.exclude works for subpackages too
			// see https://github.com/vitejs/vite/blob/c87763c1418d1ba876eae13d139eba83ac6f28b2/packages/vite/src/node/optimizer/scan.ts#L293
			optimizeDeps?.exclude?.some((id: string) => dep === id || id.startsWith(`${dep}/`))
		);
	};
	if (!isExcluded('svelte')) {
		const svelteImportsToInclude = SVELTE_IMPORTS.filter((x) => x !== 'svelte/ssr'); // not used on clientside
		log.debug(
			`adding bare svelte packages to optimizeDeps.include: ${svelteImportsToInclude.join(', ')} `
		);
		include.push(...svelteImportsToInclude.filter((x) => !isIncluded(x)));
	} else {
		log.debug('"svelte" is excluded in optimizeDeps.exclude, skipped adding it to include.');
	}

	// If we prebundle svelte libraries, we can skip the whole prebundling dance below
	if (options.experimental?.prebundleSvelteLibraries) {
		return { include, exclude };
	}

	// only svelte component libraries needs to be processed for optimizeDeps, js libraries work fine
	svelteDeps = svelteDeps.filter((dep) => dep.type === 'component-library');

	const svelteDepsToExclude = Array.from(new Set(svelteDeps.map((dep) => dep.name))).filter(
		(dep) => !isIncluded(dep)
	);
	log.debug(`automatically excluding found svelte dependencies: ${svelteDepsToExclude.join(', ')}`);
	exclude.push(...svelteDepsToExclude.filter((x) => !isExcluded(x)));

	if (options.disableDependencyReinclusion !== true) {
		const disabledReinclusions = options.disableDependencyReinclusion || [];
		if (disabledReinclusions.length > 0) {
			log.debug(`not reincluding transitive dependencies of`, disabledReinclusions);
		}
		const transitiveDepsToInclude = svelteDeps
			.filter((dep) => !disabledReinclusions.includes(dep.name) && isExcluded(dep.name))
			.flatMap((dep) => {
				const localRequire = createRequire(`${dep.dir}/package.json`);
				return Object.keys(dep.pkg.dependencies || {})
					.filter((depOfDep) => !isExcluded(depOfDep) && needsOptimization(depOfDep, localRequire))
					.map((depOfDep) => dep.path.concat(dep.name, depOfDep).join(' > '));
			});
		log.debug(
			`reincluding transitive dependencies of excluded svelte dependencies`,
			transitiveDepsToInclude
		);
		include.push(...transitiveDepsToInclude);
	}

	return { include, exclude };
}

function buildSSROptionsForSvelte(
	svelteDeps: SvelteDependency[],
	options: ResolvedOptions,
	config: UserConfig
): any {
	const noExternal: (string | RegExp)[] = [];

	// add svelte to ssr.noExternal unless it is present in ssr.external
	// so we can resolve it with svelte/ssr
	if (!config.ssr?.external?.includes('svelte')) {
		noExternal.push('svelte', /^svelte\//);
	}

	// add svelte dependencies to ssr.noExternal unless present in ssr.external
	noExternal.push(
		...Array.from(new Set(svelteDeps.map((s) => s.name))).filter(
			(x) => !config.ssr?.external?.includes(x)
		)
	);
	const ssr = {
		noExternal,
		external: [] as string[]
	};

	if (options.isServe) {
		// during dev, we have to externalize transitive dependencies, see https://github.com/sveltejs/vite-plugin-svelte/issues/281
		ssr.external = Array.from(
			new Set(svelteDeps.flatMap((dep) => Object.keys(dep.pkg.dependencies || {})))
		).filter(
			(dep) =>
				!ssr.noExternal.includes(dep) &&
				// TODO noExternal can be something different than a string array
				//!config.ssr?.noExternal?.includes(dep) &&
				!config.ssr?.external?.includes(dep)
		);
	}

	return ssr;
}

export function patchResolvedViteConfig(viteConfig: ResolvedConfig, options: ResolvedOptions) {
	const facadeEsbuildSveltePlugin = viteConfig.optimizeDeps.esbuildOptions?.plugins?.find(
		(plugin) => plugin.name === facadeEsbuildSveltePluginName
	);
	if (facadeEsbuildSveltePlugin) {
		Object.assign(facadeEsbuildSveltePlugin, esbuildSveltePlugin(options));
	}
}

export type Options = Omit<SvelteOptions, 'vitePlugin'> & PluginOptionsInline;

interface PluginOptionsInline extends PluginOptions {
	/**
	 * Path to a svelte config file, either absolute or relative to Vite root
	 *
	 * set to `false` to ignore the svelte config file
	 *
	 * @see https://vitejs.dev/config/#root
	 */
	configFile?: string | false;
}

export interface PluginOptions {
	/**
	 * A `picomatch` pattern, or array of patterns, which specifies the files the plugin should
	 * operate on. By default, all svelte files are included.
	 *
	 * @see https://github.com/micromatch/picomatch
	 */
	include?: Arrayable<string>;

	/**
	 * A `picomatch` pattern, or array of patterns, which specifies the files to be ignored by the
	 * plugin. By default, no files are ignored.
	 *
	 * @see https://github.com/micromatch/picomatch
	 */
	exclude?: Arrayable<string>;

	/**
	 * Emit Svelte styles as virtual CSS files for Vite and other plugins to process
	 *
	 * @default true
	 */
	emitCss?: boolean;

	/**
	 * Enable or disable Hot Module Replacement.
	 *
	 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	 *
	 * DO NOT CUSTOMIZE SVELTE-HMR OPTIONS UNLESS YOU KNOW EXACTLY WHAT YOU ARE DOING
	 *
	 *                             YOU HAVE BEEN WARNED
	 *
	 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	 *
	 * Set an object to pass custom options to svelte-hmr
	 *
	 * @see https://github.com/rixo/svelte-hmr#options
	 * @default true for development, always false for production
	 */
	hot?: boolean | { injectCss?: boolean; [key: string]: any };

	/**
	 * Some Vite plugins can contribute additional preprocessors by defining `api.sveltePreprocess`.
	 * If you don't want to use them, set this to true to ignore them all or use an array of strings
	 * with plugin names to specify which.
	 *
	 * @default false
	 */
	ignorePluginPreprocessors?: boolean | string[];

	/**
	 * vite-plugin-svelte automatically handles excluding svelte libraries and reinclusion of their dependencies
	 * in vite.optimizeDeps.
	 *
	 * `disableDependencyReinclusion: true` disables all reinclusions
	 * `disableDependencyReinclusion: ['foo','bar']` disables reinclusions for dependencies of foo and bar
	 *
	 * This should be used for hybrid packages that contain both node and browser dependencies, eg Routify
	 *
	 * @default false
	 */
	disableDependencyReinclusion?: boolean | string[];

	/**
	 * These options are considered experimental and breaking changes to them can occur in any release
	 */
	experimental?: ExperimentalOptions;
}

export interface SvelteOptions {
	/**
	 * A list of file extensions to be compiled by Svelte
	 *
	 * @default ['.svelte']
	 */
	extensions?: string[];

	/**
	 * An array of preprocessors to transform the Svelte source code before compilation
	 *
	 * @see https://svelte.dev/docs#svelte_preprocess
	 */
	preprocess?: Arrayable<PreprocessorGroup>;

	/**
	 * The options to be passed to the Svelte compiler. A few options are set by default,
	 * including `dev` and `css`. However, some options are non-configurable, like
	 * `filename`, `format`, `generate`, and `cssHash` (in dev).
	 *
	 * @see https://svelte.dev/docs#svelte_compile
	 */
	compilerOptions?: Omit<CompileOptions, 'filename' | 'format' | 'generate'>;

	/**
	 * Handles warning emitted from the Svelte compiler
	 */
	onwarn?: (warning: Warning, defaultHandler?: (warning: Warning) => void) => void;

	/**
	 * Options for vite-plugin-svelte
	 */
	vitePlugin?: PluginOptions;
}

/**
 * These options are considered experimental and breaking changes to them can occur in any release
 */
export interface ExperimentalOptions {
	/**
	 * Use extra preprocessors that delegate style and TypeScript preprocessing to native Vite plugins
	 *
	 * Do not use together with `svelte-preprocess`!
	 *
	 * @default false
	 */
	useVitePreprocess?: boolean;

	/**
	 * Force Vite to pre-bundle Svelte libraries
	 *
	 * @default false
	 */
	prebundleSvelteLibraries?: boolean;

	/**
	 * If a preprocessor does not provide a sourcemap, a best-effort fallback sourcemap will be provided.
	 * This option requires `diff-match-patch` to be installed as a peer dependency.
	 *
	 * @see https://github.com/google/diff-match-patch
	 * @default false
	 */
	generateMissingPreprocessorSourcemaps?: boolean;

	/**
	 * A function to update `compilerOptions` before compilation
	 *
	 * `data.filename` - The file to be compiled
	 * `data.code` - The preprocessed Svelte code
	 * `data.compileOptions` - The current compiler options
	 *
	 * To change part of the compiler options, return an object with the changes you need.
	 *
	 * @example
	 * ```
	 * ({ filename, compileOptions }) => {
	 *   // Dynamically set hydration per Svelte file
	 *   if (compileWithHydratable(filename) && !compileOptions.hydratable) {
	 *     return { hydratable: true };
	 *   }
	 * }
	 * ```
	 */
	dynamicCompileOptions?: (data: {
		filename: string;
		code: string;
		compileOptions: Partial<CompileOptions>;
	}) => Promise<Partial<CompileOptions> | void> | Partial<CompileOptions> | void;

	/**
	 * enable svelte inspector
	 */
	inspector?: InspectorOptions | boolean;

	/**
	 * send a websocket message with svelte compiler warnings during dev
	 *
	 */
	sendWarningsToBrowser?: boolean;
}

export interface InspectorOptions {
	/**
	 * define a key combo to toggle inspector,
	 * @default 'control-shift' on windows, 'meta-shift' on other os
	 *
	 * any number of modifiers `control` `shift` `alt` `meta` followed by zero or one regular key, separated by -
	 * examples: control-shift, control-o, control-alt-s  meta-x control-meta
	 * Some keys have native behavior (e.g. alt-s opens history menu on firefox).
	 * To avoid conflicts or accidentally typing into inputs, modifier only combinations are recommended.
	 */
	toggleKeyCombo?: string;

	/**
	 * inspector is automatically disabled when releasing toggleKeyCombo after holding it for a longpress
	 * @default false
	 */
	holdMode?: boolean;
	/**
	 * when to show the toggle button
	 * @default 'active'
	 */
	showToggleButton?: 'always' | 'active' | 'never';

	/**
	 * where to display the toggle button
	 * @default top-right
	 */
	toggleButtonPos?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

	/**
	 * inject custom styles when inspector is active
	 */
	customStyles?: boolean;

	/**
	 * append an import to the module id ending with `appendTo` instead of adding a script into body
	 * useful for frameworks that do not support trannsformIndexHtml hook
	 *
	 * WARNING: only set this if you know exactly what it does.
	 * Regular users of vite-plugin-svelte or SvelteKit do not need it
	 */
	appendTo?: string;
}

export interface PreResolvedOptions extends Options {
	// these options are non-nullable after resolve
	compilerOptions: CompileOptions;
	experimental?: ExperimentalOptions;
	// extra options
	root: string;
	isBuild: boolean;
	isServe: boolean;
	isDebug: boolean;
}

export interface ResolvedOptions extends PreResolvedOptions {
	isProduction: boolean;
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
