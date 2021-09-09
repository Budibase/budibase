import { ModuleNode, HmrContext } from 'vite';
import { Code, CompileData } from './utils/compile';
import { log, logCompilerWarnings } from './utils/log';
import { SvelteRequest } from './utils/id';
import { VitePluginSvelteCache } from './utils/vite-plugin-svelte-cache';
import { ResolvedOptions } from './utils/options';

/**
 * Vite-specific HMR handling
 */
export async function handleHotUpdate(
	compileSvelte: Function,
	ctx: HmrContext,
	svelteRequest: SvelteRequest,
	cache: VitePluginSvelteCache,
	options: ResolvedOptions
): Promise<ModuleNode[] | void> {
	const { read, server } = ctx;

	const cachedJS = cache.getJS(svelteRequest);
	if (!cachedJS) {
		// file hasn't been requested yet (e.g. async component)
		log.debug(`handleHotUpdate first call ${svelteRequest.id}`);
		return;
	}
	const cachedCss = cache.getCSS(svelteRequest);

	const content = await read();
	const compileData: CompileData = await compileSvelte(svelteRequest, content, options);
	cache.update(compileData);

	const affectedModules = new Set<ModuleNode | undefined>();

	const cssModule = server.moduleGraph.getModuleById(svelteRequest.cssId);
	const mainModule = server.moduleGraph.getModuleById(svelteRequest.id);
	const cssUpdated = cssModule && cssChanged(cachedCss, compileData.compiled.css);
	if (cssUpdated) {
		log.debug('handleHotUpdate css changed');
		affectedModules.add(cssModule);
	}
	const jsUpdated =
		mainModule && jsChanged(cachedJS, compileData.compiled.js, svelteRequest.filename);
	if (jsUpdated) {
		log.debug('handleHotUpdate js changed');
		affectedModules.add(mainModule);
	}

	if (!jsUpdated) {
		// transform won't be called, log warnings here
		logCompilerWarnings(compileData.compiled.warnings, options);
	}

	const result = [...affectedModules].filter(Boolean) as ModuleNode[];

	// TODO is this enough? see also: https://github.com/vitejs/vite/issues/2274
	const ssrModulesToInvalidate = result.filter((m) => !!m.ssrTransformResult);
	if (ssrModulesToInvalidate.length > 0) {
		log.debug(`invalidating modules ${ssrModulesToInvalidate.map((m) => m.id).join(', ')}`);
		ssrModulesToInvalidate.forEach((moduleNode) => server.moduleGraph.invalidateModule(moduleNode));
	}
	if (result.length > 0) {
		log.debug(
			`handleHotUpdate for ${svelteRequest.id} result: ${result.map((m) => m.id).join(', ')}`
		);
	}
	return result;
}

function cssChanged(prev?: Code, next?: Code): boolean {
	return !isCodeEqual(prev?.code, next?.code);
}

function jsChanged(prev?: Code, next?: Code, filename?: string): boolean {
	const prevJs = prev?.code;
	const nextJs = next?.code;
	const isStrictEqual = isCodeEqual(prevJs, nextJs);
	if (isStrictEqual) {
		return false;
	}
	const isLooseEqual = isCodeEqual(normalizeJsCode(prevJs), normalizeJsCode(nextJs));
	if (!isStrictEqual && isLooseEqual) {
		log.warn(
			`ignoring compiler output js change for ${filename} as it is equal to previous output after normalization`
		);
	}
	return !isLooseEqual;
}

function isCodeEqual(prev?: string, next?: string): boolean {
	if (!prev && !next) {
		return true;
	}
	if ((!prev && next) || (prev && !next)) {
		return false;
	}
	return prev === next;
}

/**
 * remove code that only changes metadata and does not require a js update for the component to keep working
 *
 * 1) add_location() calls. These add location metadata to elements, only useful for tooling like sapper studio
 * 2) ... maybe more (or less) in the future
 * @param code
 */
function normalizeJsCode(code?: string): string | undefined {
	if (!code) {
		return code;
	}
	return code.replace(/\s*\badd_location\s*\([^)]*\)\s*;?/g, '');
}
