import {
	transformWithEsbuild,
	ESBuildOptions,
	ResolvedConfig,
	TransformResult,
	Plugin
} from 'vite';
import MagicString from 'magic-string';
import { preprocess } from 'svelte/compiler';
import { Preprocessor, PreprocessorGroup, Processed, ResolvedOptions } from './options';
import { TransformPluginContext } from 'rollup';
import { log } from './log';
import { buildSourceMap } from './sourcemap';
import path from 'path';

const supportedStyleLangs = ['css', 'less', 'sass', 'scss', 'styl', 'stylus', 'postcss'];

const supportedScriptLangs = ['ts'];

function createViteScriptPreprocessor(): Preprocessor {
	return async ({ attributes, content, filename = '' }) => {
		const lang = attributes.lang as string;
		if (!supportedScriptLangs.includes(lang)) return;
		const transformResult = await transformWithEsbuild(content, filename, {
			loader: lang as ESBuildOptions['loader'],
			tsconfigRaw: {
				compilerOptions: {
					// svelte typescript needs this flag to work with type imports
					importsNotUsedAsValues: 'preserve',
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

function createViteStylePreprocessor(config: ResolvedConfig): Preprocessor {
	const pluginName = 'vite:css';
	const plugin = config.plugins.find((p) => p.name === pluginName);
	if (!plugin) {
		throw new Error(`failed to find plugin ${pluginName}`);
	}
	if (!plugin.transform) {
		throw new Error(`plugin ${pluginName} has no transform`);
	}
	const pluginTransform = plugin.transform!.bind(null as unknown as TransformPluginContext);
	return async ({ attributes, content, filename = '' }) => {
		const lang = attributes.lang as string;
		if (!supportedStyleLangs.includes(lang)) return;
		const moduleId = `${filename}.${lang}`;
		const transformResult: TransformResult = (await pluginTransform(
			content,
			moduleId
		)) as TransformResult;
		// patch sourcemap source to point back to original filename
		if (transformResult.map?.sources?.[0] === moduleId) {
			transformResult.map.sources[0] = path.basename(filename);
		}
		return {
			code: transformResult.code,
			map: transformResult.map ?? undefined
		};
	};
}

function createVitePreprocessorGroup(config: ResolvedConfig): PreprocessorGroup {
	return {
		markup({ content, filename }) {
			return preprocess(
				content,
				{
					script: createViteScriptPreprocessor(),
					style: createViteStylePreprocessor(config)
				},
				{ filename }
			);
		}
	} as PreprocessorGroup;
}

/**
 * this appends a *{} rule to component styles to force the svelte compiler to add style classes to all nodes
 * That means adding/removing class rules from <style> node won't trigger js updates as the scope classes are not changed
 *
 * only used during dev with enabled css hmr
 */
function createInjectScopeEverythingRulePreprocessorGroup(): PreprocessorGroup {
	return {
		style({ content, filename }) {
			const s = new MagicString(content);
			s.append(' *{}');
			return {
				code: s.toString(),
				map: s.generateDecodedMap({
					source: filename ? path.basename(filename) : undefined,
					hires: true
				})
			};
		}
	};
}

function buildExtraPreprocessors(options: ResolvedOptions, config: ResolvedConfig) {
	const prependPreprocessors: PreprocessorGroup[] = [];
	const appendPreprocessors: PreprocessorGroup[] = [];

	if (options.experimental?.useVitePreprocess) {
		log.debug('adding vite preprocessor');
		prependPreprocessors.push(createVitePreprocessorGroup(config));
	}

	// @ts-ignore
	const pluginsWithPreprocessorsDeprecated = config.plugins.filter((p) => p?.sveltePreprocess);
	if (pluginsWithPreprocessorsDeprecated.length > 0) {
		log.warn(
			`The following plugins use the deprecated 'plugin.sveltePreprocess' field. Please contact their maintainers and ask them to move it to 'plugin.api.sveltePreprocess': ${pluginsWithPreprocessorsDeprecated
				.map((p) => p.name)
				.join(', ')}`
		);
		// patch plugin to avoid breaking
		pluginsWithPreprocessorsDeprecated.forEach((p) => {
			if (!p.api) {
				p.api = {};
			}
			if (p.api.sveltePreprocess === undefined) {
				// @ts-ignore
				p.api.sveltePreprocess = p.sveltePreprocess;
			} else {
				log.error(
					`ignoring plugin.sveltePreprocess of ${p.name} because it already defined plugin.api.sveltePreprocess.`
				);
			}
		});
	}

	const pluginsWithPreprocessors: Plugin[] = config.plugins.filter((p) => p?.api?.sveltePreprocess);
	const ignored: Plugin[] = [],
		included: Plugin[] = [];
	for (const p of pluginsWithPreprocessors) {
		if (
			options.ignorePluginPreprocessors === true ||
			(Array.isArray(options.ignorePluginPreprocessors) &&
				options.ignorePluginPreprocessors?.includes(p.name))
		) {
			ignored.push(p);
		} else {
			included.push(p);
		}
	}
	if (ignored.length > 0) {
		log.debug(
			`Ignoring svelte preprocessors defined by these vite plugins: ${ignored
				.map((p) => p.name)
				.join(', ')}`
		);
	}
	if (included.length > 0) {
		log.debug(
			`Adding svelte preprocessors defined by these vite plugins: ${included
				.map((p) => p.name)
				.join(', ')}`
		);
		appendPreprocessors.push(...pluginsWithPreprocessors.map((p) => p.api.sveltePreprocess));
	}

	if (options.hot && options.emitCss) {
		appendPreprocessors.push(createInjectScopeEverythingRulePreprocessorGroup());
	}

	return { prependPreprocessors, appendPreprocessors };
}

export function addExtraPreprocessors(options: ResolvedOptions, config: ResolvedConfig) {
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
	const generateMissingSourceMaps = !!options.experimental?.generateMissingPreprocessorSourcemaps;
	if (options.preprocess && generateMissingSourceMaps) {
		options.preprocess = Array.isArray(options.preprocess)
			? options.preprocess.map((p, i) => validateSourceMapOutputWrapper(p, i))
			: validateSourceMapOutputWrapper(options.preprocess, 0);
	}
}

function validateSourceMapOutputWrapper(group: PreprocessorGroup, i: number): PreprocessorGroup {
	const wrapper: PreprocessorGroup = {};

	for (const [processorType, processorFn] of Object.entries(group) as Array<
		// eslint-disable-next-line no-unused-vars
		[keyof PreprocessorGroup, (options: { filename?: string; content: string }) => Processed]
	>) {
		wrapper[processorType] = async (options) => {
			const result = await processorFn(options);

			if (result && result.code !== options.content) {
				let invalidMap = false;
				if (!result.map) {
					invalidMap = true;
					log.warn.enabled &&
						log.warn.once(
							`preprocessor at index ${i} did not return a sourcemap for ${processorType} transform`,
							{
								filename: options.filename,
								type: processorType,
								processor: processorFn.toString()
							}
						);
				} else if ((result.map as any)?.mappings === '') {
					invalidMap = true;
					log.warn.enabled &&
						log.warn.once(
							`preprocessor at index ${i} returned an invalid empty sourcemap for ${processorType} transform`,
							{
								filename: options.filename,
								type: processorType,
								processor: processorFn.toString()
							}
						);
				}
				if (invalidMap) {
					try {
						const map = await buildSourceMap(options.content, result.code, options.filename);
						if (map) {
							log.debug.enabled &&
								log.debug(
									`adding generated sourcemap to preprocesor result for ${options.filename}`
								);
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
