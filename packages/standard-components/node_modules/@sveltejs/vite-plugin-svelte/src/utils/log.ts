/* eslint-disable no-unused-vars */
import { cyan, yellow, red } from 'kleur/colors';
import debug from 'debug';
import { ResolvedOptions, Warning } from './options';

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

export function logCompilerWarnings(warnings: Warning[], options: ResolvedOptions) {
	const { emitCss, onwarn, isBuild } = options;
	const warn = isBuild ? warnBuild : warnDev;
	warnings?.forEach((warning) => {
		if (!emitCss && warning.code === 'css-unused-selector') {
			return;
		}
		if (onwarn) {
			onwarn(warning, warn);
		} else {
			warn(warning);
		}
	});
}

function warnDev(w: Warning) {
	log.info.enabled && log.info(buildExtendedLogMessage(w));
}

function warnBuild(w: Warning) {
	log.warn.enabled && log.warn(buildExtendedLogMessage(w), w.frame);
}

function buildExtendedLogMessage(w: Warning) {
	const parts = [];
	if (w.filename) {
		parts.push(w.filename);
	}
	if (w.start) {
		parts.push(':', w.start.line, ':', w.start.column);
	}
	if (w.message) {
		parts.push(' ', w.message);
	}
	return parts.join('');
}
