import { describe, it, expect } from 'vitest';
import { findRootSvelteDependencies, needsOptimization } from '../dependencies';
import * as path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
const __dir = path.dirname(fileURLToPath(import.meta.url));
const e2eTestRoot = path.resolve(__dir, '../../../../../packages/e2e-tests');

describe('dependencies', () => {
	describe('findRootSvelteDependencies', () => {
		it('should find svelte dependencies in packages/e2e-test/hmr', () => {
			const deps = findRootSvelteDependencies(path.resolve('packages/e2e-tests/hmr'));
			expect(deps).toHaveLength(1);
			expect(deps[0].name).toBe('e2e-test-dep-svelte-simple');
			expect(deps[0].path).toEqual([]);
		});
		it('should find nested svelte dependencies in packages/e2e-test/package-json-svelte-field', () => {
			const deps = findRootSvelteDependencies(path.join(e2eTestRoot, 'package-json-svelte-field'));
			expect(deps).toHaveLength(3);
			const hybrid = deps.find((dep) => dep.name === 'e2e-test-dep-svelte-hybrid');
			expect(hybrid).toBeTruthy();
			expect(hybrid.path).toHaveLength(0);
			const nested = deps.find((dep) => dep.name === 'e2e-test-dep-svelte-nested');
			expect(nested).toBeTruthy();
			expect(nested.path).toHaveLength(0);
			const simple = deps.find((dep) => dep.name === 'e2e-test-dep-svelte-simple');
			expect(simple).toBeTruthy();
			expect(simple.path).toHaveLength(1);
			expect(simple.path[0]).toBe('e2e-test-dep-svelte-nested');
		});
	});
	describe('needsOptimization', () => {
		it('should optimize cjs deps only', () => {
			const testDepsPath = path.join(e2eTestRoot, 'dependencies/package.json');
			const localRequire = createRequire(testDepsPath);
			expect(needsOptimization('e2e-test-dep-cjs-and-esm', localRequire)).toBe(false);
			expect(needsOptimization('e2e-test-dep-cjs-only', localRequire)).toBe(true);
			expect(needsOptimization('e2e-test-dep-esm-only', localRequire)).toBe(false);
			expect(needsOptimization('e2e-test-dep-index-only', localRequire)).toBe(true);
			expect(needsOptimization('e2e-test-dep-types-only', localRequire)).toBe(false);
		});
	});
});
