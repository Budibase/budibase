import fs from 'fs';
import { HmrContext, ModuleNode, Plugin, ResolvedConfig, UserConfig } from 'vite';
import { handleHotUpdate } from './handle-hot-update';
import { log, logCompilerWarnings } from './utils/log';
import { CompileData, createCompileSvelte } from './utils/compile';
import { buildIdParser, IdParser, SvelteRequest } from './utils/id';
import {
	buildExtraViteConfig,
	validateInlineOptions,
	Options,
	ResolvedOptions,
	resolveOptions
} from './utils/options';
import { VitePluginSvelteCache } from './utils/vite-plugin-svelte-cache';

import { setupWatchers } from './utils/watch';
import { resolveViaPackageJsonSvelte } from './utils/resolve';
import { addExtraPreprocessors } from './utils/preprocess';
import { PartialResolvedId } from 'rollup';

export function svelte(inlineOptions?: Partial<Options>): Plugin {
	if (process.env.DEBUG != null) {
		log.setLevel('debug');
	}
	validateInlineOptions(inlineOptions);
	const cache = new VitePluginSvelteCache();
	const pkg_export_errors = new Set();
	// updated in configResolved hook
	let requestParser: IdParser;
	let options: ResolvedOptions;
	let viteConfig: ResolvedConfig;
	/* eslint-disable no-unused-vars */
	let compileSvelte: (
		svelteRequest: SvelteRequest,
		code: string,
		options: Partial<ResolvedOptions>
	) => Promise<CompileData>;
	/* eslint-enable no-unused-vars */

	let resolvedSvelteSSR: Promise<PartialResolvedId | null>;

	return {
		name: 'vite-plugin-svelte',
		// make sure our resolver runs before vite internal resolver to resolve svelte field correctly
		enforce: 'pre',
		async config(config, configEnv): Promise<Partial<UserConfig>> {
			// setup logger
			if (process.env.DEBUG) {
				log.setLevel('debug');
			} else if (config.logLevel) {
				log.setLevel(config.logLevel);
			}
			options = await resolveOptions(inlineOptions, config, configEnv);
			// extra vite config
			const extraViteConfig = buildExtraViteConfig(options, config);
			log.debug('additional vite config', extraViteConfig);
			return extraViteConfig as Partial<UserConfig>;
		},

		async configResolved(config) {
			addExtraPreprocessors(options, config);
			requestParser = buildIdParser(options);
			compileSvelte = createCompileSvelte(options);
			viteConfig = config;
			log.debug('resolved options', options);
		},

		configureServer(server) {
			// eslint-disable-next-line no-unused-vars
			options.server = server;
			setupWatchers(options, cache, requestParser);
		},

		load(id, ssr) {
			const svelteRequest = requestParser(id, !!ssr);
			if (svelteRequest) {
				const { filename, query } = svelteRequest;
				// virtual css module
				if (query.svelte && query.type === 'style') {
					const css = cache.getCSS(svelteRequest);
					if (css) {
						log.debug(`load returns css for ${filename}`);
						return css;
					}
				}
				// prevent vite asset plugin from loading files as url that should be compiled in transform
				if (viteConfig.assetsInclude(filename)) {
					log.debug(`load returns raw content for ${filename}`);
					return fs.readFileSync(filename, 'utf-8');
				}
			}
		},

		async resolveId(importee, importer, customOptions, ssr) {
			const svelteRequest = requestParser(importee, !!ssr);
			if (svelteRequest?.query.svelte) {
				if (svelteRequest.query.type === 'style') {
					// return cssId with root prefix so postcss pipeline of vite finds the directory correctly
					// see https://github.com/sveltejs/vite-plugin-svelte/issues/14
					log.debug(`resolveId resolved virtual css module ${svelteRequest.cssId}`);
					return svelteRequest.cssId;
				}
				log.debug(`resolveId resolved ${importee}`);
				return importee; // query with svelte tag, an id we generated, no need for further analysis
			}

			if (ssr && importee === 'svelte') {
				if (!resolvedSvelteSSR) {
					resolvedSvelteSSR = this.resolve('svelte/ssr', undefined, { skipSelf: true }).then(
						(svelteSSR) => {
							log.debug('resolved svelte to svelte/ssr');
							return svelteSSR;
						},
						(err) => {
							log.debug(
								'failed to resolve svelte to svelte/ssr. Update svelte to a version that exports it',
								err
							);
							return null; // returning null here leads to svelte getting resolved regularly
						}
					);
				}
				return resolvedSvelteSSR;
			}

			try {
				const resolved = resolveViaPackageJsonSvelte(importee, importer);
				if (resolved) {
					log.debug(`resolveId resolved ${resolved} via package.json svelte field of ${importee}`);
					return resolved;
				}
			} catch (err) {
				switch (err.code) {
					case 'ERR_PACKAGE_PATH_NOT_EXPORTED':
						pkg_export_errors.add(importee);
						return null;
					case 'MODULE_NOT_FOUND':
						return null;
					default:
						throw err;
				}
			}
		},

		async transform(code, id, ssr) {
			const svelteRequest = requestParser(id, !!ssr);
			if (!svelteRequest) {
				return;
			}
			const { filename, query } = svelteRequest;

			if (query.svelte) {
				if (query.type === 'style') {
					const css = cache.getCSS(svelteRequest);
					if (css) {
						log.debug(`transform returns css for ${filename}`);
						return css; // TODO return code arg instead? it's the code from load hook.
					}
				}
				log.error('failed to transform tagged svelte request', svelteRequest);
				throw new Error(`failed to transform tagged svelte request for id ${id}`);
			}
			const compileData = await compileSvelte(svelteRequest, code, options);
			logCompilerWarnings(compileData.compiled.warnings, options);
			cache.update(compileData);
			if (compileData.dependencies?.length && options.server) {
				compileData.dependencies.forEach((d) => this.addWatchFile(d));
			}
			log.debug(`transform returns compiled js for ${filename}`);
			return compileData.compiled.js;
		},

		handleHotUpdate(ctx: HmrContext): void | Promise<Array<ModuleNode> | void> {
			if (!options.hot || !options.emitCss) {
				return;
			}
			const svelteRequest = requestParser(ctx.file, false, ctx.timestamp);
			if (svelteRequest) {
				return handleHotUpdate(compileSvelte, ctx, svelteRequest, cache, options);
			}
		},

		/**
		 * All resolutions done; display warnings wrt `package.json` access.
		 */
		// TODO generateBundle isn't called by vite, is buildEnd enough or should it be logged once per violation in resolve
		buildEnd() {
			if (pkg_export_errors.size > 0) {
				log.warn(
					`The following packages did not export their \`package.json\` file so we could not check the "svelte" field. If you had difficulties importing svelte components from a package, then please contact the author and ask them to export the package.json file.`,
					Array.from(pkg_export_errors, (s) => `- ${s}`).join('\n')
				);
			}
		}
	};
}

export {
	Options,
	Preprocessor,
	PreprocessorGroup,
	CompileOptions,
	CssHashGetter,
	Arrayable,
	MarkupPreprocessor,
	ModuleFormat,
	Processed,
	Warning
} from './utils/options';
