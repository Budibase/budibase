import { VitePluginSvelteCache } from './vite-plugin-svelte-cache';
import fs from 'fs';
import { log } from './log';
import { IdParser } from './id';
import { ResolvedOptions } from './options';
import { knownSvelteConfigNames } from './load-svelte-config';
import path from 'path';
import { FSWatcher } from 'vite';

export function setupWatchers(
	options: ResolvedOptions,
	cache: VitePluginSvelteCache,
	requestParser: IdParser
) {
	const { server, configFile: svelteConfigFile } = options;
	if (!server) {
		return;
	}
	const { watcher, ws } = server;
	const { root, server: serverConfig } = server.config;

	const emitChangeEventOnDependants = (filename: string) => {
		const dependants = cache.getDependants(filename);
		dependants.forEach((dependant) => {
			if (fs.existsSync(dependant)) {
				log.debug(
					`emitting virtual change event for "${dependant}" because depdendency "${filename}" changed`
				);
				watcher.emit('change', dependant);
			}
		});
	};

	const removeUnlinkedFromCache = (filename: string) => {
		const svelteRequest = requestParser(filename, false);
		if (svelteRequest) {
			const removedFromCache = cache.remove(svelteRequest);
			if (removedFromCache) {
				log.debug(`cleared VitePluginSvelteCache for deleted file ${filename}`);
			}
		}
	};

	const triggerViteRestart = (filename: string) => {
		if (serverConfig.middlewareMode) {
			// in middlewareMode we can't restart the server automatically
			// show the user an overlay instead
			const message =
				'Svelte config change detected, restart your dev process to apply the changes.';
			log.info(message, filename);
			ws.send({
				type: 'error',
				err: { message, stack: '', plugin: 'vite-plugin-svelte', id: filename }
			});
		} else {
			log.info(`svelte config changed: restarting vite server. - file: ${filename}`);
			server.restart();
		}
	};

	// collection of watcher listeners by event
	const listenerCollection = {
		add: [] as Array<Function>,
		change: [emitChangeEventOnDependants],
		unlink: [removeUnlinkedFromCache, emitChangeEventOnDependants]
	};

	if (svelteConfigFile !== false) {
		// configFile false means we ignore the file and external process is responsible
		const possibleSvelteConfigs = knownSvelteConfigNames.map((cfg) => path.join(root, cfg));
		const restartOnConfigAdd = (filename: string) => {
			if (possibleSvelteConfigs.includes(filename)) {
				triggerViteRestart(filename);
			}
		};

		const restartOnConfigChange = (filename: string) => {
			if (filename === svelteConfigFile) {
				triggerViteRestart(filename);
			}
		};

		if (svelteConfigFile) {
			listenerCollection.change.push(restartOnConfigChange);
			listenerCollection.unlink.push(restartOnConfigChange);
		} else {
			listenerCollection.add.push(restartOnConfigAdd);
		}
	}

	Object.entries(listenerCollection).forEach(([evt, listeners]) => {
		if (listeners.length > 0) {
			watcher.on(evt, (filename) => listeners.forEach((listener) => listener(filename)));
		}
	});
}
// taken from vite utils
export function ensureWatchedFile(watcher: FSWatcher, file: string | null, root: string): void {
	if (
		file &&
		// only need to watch if out of root
		!file.startsWith(root + '/') &&
		// some rollup plugins use null bytes for private resolved Ids
		!file.includes('\0') &&
		fs.existsSync(file)
	) {
		// resolve file to normalized system path
		watcher.add(path.resolve(file));
	}
}
