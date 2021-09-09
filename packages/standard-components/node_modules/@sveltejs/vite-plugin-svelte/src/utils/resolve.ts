import path from 'path';
import fs from 'fs';
// @ts-ignore
import relative from 'require-relative';

export function resolveViaPackageJsonSvelte(importee: string, importer?: string): string | void {
	if (importer && isBareImport(importee)) {
		const importeePkgFile = relative.resolve(`${importee}/package.json`, path.dirname(importer));
		const importeePkg = JSON.parse(fs.readFileSync(importeePkgFile, { encoding: 'utf-8' }));
		if (importeePkg.svelte) {
			return path.resolve(path.dirname(importeePkgFile), importeePkg.svelte);
		}
	}
}

function isBareImport(importee: string): boolean {
	if (!importee || importee[0] === '.' || importee[0] === '\0' || path.isAbsolute(importee)) {
		return false;
	}
	const parts = importee.split('/');
	switch (parts.length) {
		case 1:
			return true;
		case 2:
			return parts[0].startsWith('@');
		default:
			return false;
	}
}
