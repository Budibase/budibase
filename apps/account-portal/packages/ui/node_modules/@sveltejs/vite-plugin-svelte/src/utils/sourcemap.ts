import MagicString, { MagicStringOptions } from 'magic-string';
import { log } from './log';

export async function buildMagicString(
	from: string,
	to: string,
	options?: MagicStringOptions
): Promise<MagicString | null> {
	let diff_match_patch, DIFF_DELETE: number, DIFF_INSERT: number;
	try {
		const dmpPkg = await import('diff-match-patch');
		diff_match_patch = dmpPkg.diff_match_patch;
		DIFF_INSERT = dmpPkg.DIFF_INSERT;
		DIFF_DELETE = dmpPkg.DIFF_DELETE;
	} catch (e) {
		log.error.once(
			'Failed to import optional dependency "diff-match-patch". Please install it to enable generated sourcemaps.'
		);
		return null;
	}

	const dmp = new diff_match_patch();
	const diffs = dmp.diff_main(from, to);
	dmp.diff_cleanupSemantic(diffs);
	const m = new MagicString(from, options);
	let pos = 0;
	for (let i = 0; i < diffs.length; i++) {
		const diff = diffs[i];
		const nextDiff = diffs[i + 1];
		if (diff[0] === DIFF_DELETE) {
			if (nextDiff?.[0] === DIFF_INSERT) {
				// delete followed by insert, use overwrite and skip ahead
				m.overwrite(pos, pos + diff[1].length, nextDiff[1]);
				i++;
			} else {
				m.remove(pos, pos + diff[1].length);
			}
			pos += diff[1].length;
		} else if (diff[0] === DIFF_INSERT) {
			if (nextDiff) {
				m.appendRight(pos, diff[1]);
			} else {
				m.append(diff[1]);
			}
		} else {
			// unchanged block, advance pos
			pos += diff[1].length;
		}
	}
	// at this point m.toString() === to
	return m;
}

export async function buildSourceMap(from: string, to: string, filename?: string) {
	// @ts-ignore
	const m = await buildMagicString(from, to, { filename });
	return m ? m.generateDecodedMap({ source: filename, hires: true, includeContent: false }) : null;
}
