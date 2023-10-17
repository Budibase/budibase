/* eslint-disable no-unused-vars,no-console */
import { cyan, yellow, red } from 'kleur/colors';
import debug from 'debug';
import { ResolvedOptions, Warning } from './options';
import { SvelteRequest } from './id';

const levels: string[] = ['debug', 'info', 'warn', 'error', 'silent'];
const prefix = 'vite-plugin-svelte';
const loggers: { [key: string]: any } = {
	debug: {
		log: debug(`vite:${prefix}`),
		enabled: false,
		isDebug: true
	},
	info: {
		color: cyan,
		log: console.log,
		enabled: true
	},
	warn: {
		color: yellow,
		log: console.warn,
		enabled: true
	},
	error: {
		color: red,
		log: console.error,
		enabled: true
	},
	silent: {
		enabled: false
	}
};

let _level: string = 'info';
function setLevel(level: string) {
	if (level === _level) {
		return;
	}
	const levelIndex = levels.indexOf(level);
	if (levelIndex > -1) {
		_level = level;
		for (let i = 0; i < levels.length; i++) {
			loggers[levels[i]].enabled = i >= levelIndex;
		}
	} else {
		_log(loggers.error, `invalid log level: ${level} `);
	}
}

function _log(logger: any, message: string, payload?: any) {
	if (!logger.enabled) {
		return;
	}
	if (logger.isDebug) {
		payload !== undefined ? logger.log(message, payload) : logger.log(message);
	} else {
		logger.log(logger.color(`${new Date().toLocaleTimeString()} [${prefix}] ${message}`));
		if (payload) {
			logger.log(payload);
		}
	}
}

export interface LogFn {
	(message: string, payload?: any): void;
	enabled: boolean;
	once: (message: string, payload?: any) => void;
}

function createLogger(level: string): LogFn {
	const logger = loggers[level];
	const logFn: LogFn = _log.bind(null, logger) as LogFn;
	const logged = new Set<String>();
	const once = function (message: string, payload?: any) {
		if (logged.has(message)) {
			return;
		}
		logged.add(message);
		logFn.apply(null, [message, payload]);
	};
	Object.defineProperty(logFn, 'enabled', {
		get() {
			return logger.enabled;
		}
	});
	Object.defineProperty(logFn, 'once', {
		get() {
			return once;
		}
	});
	return logFn;
}

export const log = {
	debug: createLogger('debug'),
	info: createLogger('info'),
	warn: createLogger('warn'),
	error: createLogger('error'),
	setLevel
};

export type SvelteWarningsMessage = {
	id: string;
	filename: string;
	normalizedFilename: string;
	timestamp: number;
	warnings: Warning[]; // allWarnings filtered by warnings where onwarn did not call the default handler
	allWarnings: Warning[]; // includes warnings filtered by onwarn and our extra vite plugin svelte warnings
	rawWarnings: Warning[]; // raw compiler output
};

export function logCompilerWarnings(
	svelteRequest: SvelteRequest,
	warnings: Warning[],
	options: ResolvedOptions
) {
	const { emitCss, onwarn, isBuild } = options;
	const sendViaWS = !isBuild && options.experimental?.sendWarningsToBrowser;
	let warn = isBuild ? warnBuild : warnDev;
	const handledByDefaultWarn: Warning[] = [];
	const notIgnored = warnings?.filter((w) => !ignoreCompilerWarning(w, isBuild, emitCss));
	const extra = buildExtraWarnings(warnings, isBuild);
	const allWarnings = [...notIgnored, ...extra];
	if (sendViaWS) {
		const _warn = warn;
		warn = (w: Warning) => {
			handledByDefaultWarn.push(w);
			_warn(w);
		};
	}
	allWarnings.forEach((warning) => {
		if (onwarn) {
			onwarn(warning, warn);
		} else {
			warn(warning);
		}
	});
	if (sendViaWS) {
		const message: SvelteWarningsMessage = {
			id: svelteRequest.id,
			filename: svelteRequest.filename,
			normalizedFilename: svelteRequest.normalizedFilename,
			timestamp: svelteRequest.timestamp,
			warnings: handledByDefaultWarn, // allWarnings filtered by warnings where onwarn did not call the default handler
			allWarnings, // includes warnings filtered by onwarn and our extra vite plugin svelte warnings
			rawWarnings: warnings // raw compiler output
		};
		log.debug(`sending svelte:warnings message for ${svelteRequest.normalizedFilename}`);
		options.server?.ws?.send('svelte:warnings', message);
	}
}

function ignoreCompilerWarning(
	warning: Warning,
	isBuild: boolean,
	emitCss: boolean | undefined
): boolean {
	return (
		(!emitCss && warning.code === 'css-unused-selector') || // same as rollup-plugin-svelte
		(!isBuild && isNoScopableElementWarning(warning))
	);
}

function isNoScopableElementWarning(warning: Warning) {
	// see https://github.com/sveltejs/vite-plugin-svelte/issues/153
	return warning.code === 'css-unused-selector' && warning.message.includes('"*"');
}

function buildExtraWarnings(warnings: Warning[], isBuild: boolean): Warning[] {
	const extraWarnings = [];
	if (!isBuild) {
		const noScopableElementWarnings = warnings.filter((w) => isNoScopableElementWarning(w));
		if (noScopableElementWarnings.length > 0) {
			// in case there are multiple, use last one as that is the one caused by our *{} rule
			const noScopableElementWarning =
				noScopableElementWarnings[noScopableElementWarnings.length - 1];
			extraWarnings.push({
				...noScopableElementWarning,
				code: 'vite-plugin-svelte-css-no-scopable-elements',
				message: `No scopable elements found in template. If you're using global styles in the style tag, you should move it into an external stylesheet file and import it in JS. See https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/faq.md#where-should-i-put-my-global-styles.`
			});
		}
	}
	return extraWarnings;
}

function warnDev(w: Warning) {
	log.info.enabled && log.info(buildExtendedLogMessage(w));
}

function warnBuild(w: Warning) {
	log.warn.enabled && log.warn(buildExtendedLogMessage(w), w.frame);
}

export function buildExtendedLogMessage(w: Warning) {
	const parts = [];
	if (w.filename) {
		parts.push(w.filename);
	}
	if (w.start) {
		parts.push(':', w.start.line, ':', w.start.column);
	}
	if (w.message) {
		if (parts.length > 0) {
			parts.push(' ');
		}
		parts.push(w.message);
	}
	return parts.join('');
}
