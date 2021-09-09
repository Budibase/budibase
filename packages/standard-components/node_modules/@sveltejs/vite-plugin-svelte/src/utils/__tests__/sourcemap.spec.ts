import { buildMagicString, buildSourceMap } from '../sourcemap';

describe('sourcemap', () => {
	describe('buildMagicString', () => {
		it('should return a valid magic string', async () => {
			const from = 'h1{color: blue}\nh2{color: green}\nh3{color: red}\n';
			const to = 'h1{color: blue}\ndiv{color: white}\nh3{color: red}\nh2{color: green}\n';
			const m = await buildMagicString(from, to);
			expect(m).toBeDefined();
			expect(m.original).toBe(from);
			expect(m.toString()).toBe(to);
		});
	});
	describe('buildSourceMap', () => {
		it('should return a map with mappings and filename', async () => {
			const map = await buildSourceMap('foo', 'bar', 'foo.txt');
			expect(map).toBeDefined();
			expect(map.mappings).toBeDefined();
			expect(map.mappings[0]).toBeDefined();
			expect(map.mappings[0][0]).toBeDefined();
			expect(map.sources[0]).toBe('foo.txt');
		});
	});
});
