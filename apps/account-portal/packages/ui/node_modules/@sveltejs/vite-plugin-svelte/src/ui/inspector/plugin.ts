import { Plugin, normalizePath } from 'vite';
import { log } from '../../utils/log';
import { InspectorOptions } from '../../utils/options';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const defaultInspectorOptions: InspectorOptions = {
	toggleKeyCombo: process.platform === 'win32' ? 'control-shift' : 'meta-shift',
	holdMode: false,
	showToggleButton: 'active',
	toggleButtonPos: 'top-right',
	customStyles: true
};

function getInspectorPath() {
	const pluginPath = normalizePath(path.dirname(fileURLToPath(import.meta.url)));
	return pluginPath.replace(/\/vite-plugin-svelte\/dist$/, '/vite-plugin-svelte/src/ui/inspector/');
}

export function svelteInspector(): Plugin {
	const inspectorPath = getInspectorPath();
	log.debug.enabled && log.debug(`svelte inspector path: ${inspectorPath}`);
	let inspectorOptions: InspectorOptions;
	let appendTo: string | undefined;
	let disabled = false;

	return {
		name: 'vite-plugin-svelte:inspector',
		apply: 'serve',
		enforce: 'pre',

		configResolved(config) {
			const vps = config.plugins.find((p) => p.name === 'vite-plugin-svelte');
			if (vps?.api?.options?.experimental?.inspector) {
				inspectorOptions = {
					...defaultInspectorOptions,
					...vps.api.options.experimental.inspector
				};
			}
			if (!vps || !inspectorOptions) {
				log.debug('inspector disabled, could not find config');
				disabled = true;
			} else {
				if (vps.api.options.kit && !inspectorOptions.appendTo) {
					const out_dir = path.basename(vps.api.options.kit.outDir || '.svelte-kit');
					inspectorOptions.appendTo = `${out_dir}/runtime/client/start.js`;
				}
				appendTo = inspectorOptions.appendTo;
			}
		},

		async resolveId(importee: string, importer, options) {
			if (options?.ssr || disabled) {
				return;
			}
			if (importee.startsWith('virtual:svelte-inspector-options')) {
				return importee;
			} else if (importee.startsWith('virtual:svelte-inspector-path:')) {
				const resolved = importee.replace('virtual:svelte-inspector-path:', inspectorPath);
				log.debug.enabled && log.debug(`resolved ${importee} with ${resolved}`);
				return resolved;
			}
		},

		async load(id, options) {
			if (options?.ssr || disabled) {
				return;
			}
			if (id === 'virtual:svelte-inspector-options') {
				return `export default ${JSON.stringify(inspectorOptions ?? {})}`;
			} else if (id.startsWith(inspectorPath)) {
				// read file ourselves to avoid getting shut out by vites fs.allow check
				return await fs.promises.readFile(id, 'utf-8');
			}
		},

		transform(code: string, id: string, options?: { ssr?: boolean }) {
			if (options?.ssr || disabled || !appendTo) {
				return;
			}
			if (id.endsWith(appendTo)) {
				return { code: `${code}\nimport 'virtual:svelte-inspector-path:load-inspector.js'` };
			}
		},
		transformIndexHtml(html) {
			if (disabled || appendTo) {
				return;
			}
			return {
				html,
				tags: [
					{
						tag: 'script',
						injectTo: 'body',
						attrs: {
							type: 'module',
							// /@id/ is needed, otherwise the virtual: is seen as protocol by browser and cors error happens
							src: '/@id/virtual:svelte-inspector-path:load-inspector.js'
						}
					}
				]
			};
		}
	};
}
