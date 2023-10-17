import { RollupError } from 'rollup';
import { ResolvedOptions, Warning } from './options';
import { buildExtendedLogMessage } from './log';
import { PartialMessage } from 'esbuild';

/**
 * convert an error thrown by svelte.compile to a RollupError so that vite displays it in a user friendly way
 * @param error a svelte compiler error, which is a mix of Warning and an error
 * @returns {RollupError} the converted error
 */
export function toRollupError(error: Warning & Error, options: ResolvedOptions): RollupError {
	const { filename, frame, start, code, name, stack } = error;
	const rollupError: RollupError = {
		name, // needed otherwise sveltekit coalesce_to_error turns it into a string
		id: filename,
		message: buildExtendedLogMessage(error), // include filename:line:column so that it's clickable
		frame: formatFrameForVite(frame),
		code,
		stack: options.isBuild || options.isDebug || !frame ? stack : ''
	};
	if (start) {
		rollupError.loc = {
			line: start.line,
			column: start.column,
			file: filename
		};
	}
	return rollupError;
}

/**
 * convert an error thrown by svelte.compile to an esbuild PartialMessage
 * @param error a svelte compiler error, which is a mix of Warning and an error
 * @returns {PartialMessage} the converted error
 */
export function toESBuildError(error: Warning & Error, options: ResolvedOptions): PartialMessage {
	const { filename, frame, start, stack } = error;
	const partialMessage: PartialMessage = {
		text: buildExtendedLogMessage(error)
	};
	if (start) {
		partialMessage.location = {
			line: start.line,
			column: start.column,
			file: filename,
			lineText: lineFromFrame(start.line, frame) // needed to get a meaningful error message on cli
		};
	}
	if (options.isBuild || options.isDebug || !frame) {
		partialMessage.detail = stack;
	}
	return partialMessage;
}

/**
 * extract line with number from codeframe
 */
function lineFromFrame(lineNo: number, frame?: string): string {
	if (!frame) {
		return '';
	}
	const lines = frame.split('\n');
	const errorLine = lines.find((line) => line.trimStart().startsWith(`${lineNo}: `));
	return errorLine ? errorLine.substring(errorLine.indexOf(': ') + 3) : '';
}

/**
 * vite error overlay expects a specific format to show frames
 * this reformats svelte frame (colon separated, less whitespace)
 * to one that vite displays on overlay ( pipe separated, more whitespace)
 * e.g.
 * ```
 * 1: foo
 * 2: bar;
 *       ^
 * 3: baz
 * ```
 * to
 * ```
 *  1 | foo
 *  2 | bar;
 *         ^
 *  3 | baz
 * ```
 * @see https://github.com/vitejs/vite/blob/96591bf9989529de839ba89958755eafe4c445ae/packages/vite/src/client/overlay.ts#L116
 */
function formatFrameForVite(frame?: string): string {
	if (!frame) {
		return '';
	}
	return frame
		.split('\n')
		.map((line) => (line.match(/^\s+\^/) ? '   ' + line : ' ' + line.replace(':', ' | ')))
		.join('\n');
}
