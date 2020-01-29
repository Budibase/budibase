import { generateCss, generate_rule, make_margin, make_grid_position } from '../src/builderStore/generateCss.js';

describe('make_margin', () => {
	test('it should generate a valid rule', () => {
		expect(make_margin(["1", "1", "1", "1"])).toEqual('1px 1px 1px 1px')
	})

	test('empty values should output 0', () => {
		expect(make_margin(["1", "1", "", ""])).toEqual('1px 1px unset unset')
		expect(make_margin(["1", "", "", "1"])).toEqual('1px unset unset 1px')
		expect(make_margin(["", "", "", ""])).toEqual('unset unset unset unset')
	})
})

describe('generateCss', () => {
	test('it should generate a valid css rule: grid-area', () => {
		expect(
			generateCss({ layout: { gridarea: ["", "", "", ""] } })
		).toEqual({
			layout: 'grid-area: unset unset unset unset;',
			position: ''
		});
	})

	test('it should generate a valid css rule: grid-gap', () => {
		expect(
			generateCss({ layout: { gap: "10" } })
		).toEqual({
			layout: 'grid-gap: 10px;',
			position: ''
		});
	})

	test('it should generate a valid css rule: column 1', () => {
		expect(
			generateCss({ position: { column: ["", ""] } }
			)).toEqual({ layout: '', position: '' });
	})

	test('it should generate a valid css rule: column 2', () => {
		expect(
			generateCss({ position: { column: ["1", ""] } })
		).toEqual({
			position: 'grid-column-start: 1;',
			layout: ''
		});
	})

	test('it should generate a valid css rule: column 3', () => {
		expect(
			generateCss({ position: { column: ["", "1"] } })
		).toEqual({
			position: 'grid-column-end: 1;',
			layout: ''
		});
	})

	test('it should generate a valid css rule: column 4', () => {
		expect(
			generateCss({ position: { column: ["1", "1"] } })
		).toEqual({
			position: 'grid-column-start: 1;\ngrid-column-end: 1;',
			layout: ''
		});
	})

	test('it should generate a valid css rule: row 1', () => {
		expect(
			generateCss({ position: { row: ["", ""] } })
		).toEqual({ layout: '', position: '' });
	})

	test('it should generate a valid css rule: row 2', () => {
		expect(
			generateCss({ position: { row: ["1", ""] } })
		).toEqual({
			position: 'grid-row-start: 1;',
			layout: ''
		});
	})

	test('it should generate a valid css rule: row 3', () => {
		expect(
			generateCss({ position: { row: ["", "1"] } })
		).toEqual({
			position: 'grid-row-end: 1;',
			layout: ''
		});
	})

	test('it should generate a valid css rule: row 4', () => {
		expect(
			generateCss({ position: { row: ["1", "1"] } })
		).toEqual({
			position: 'grid-row-start: 1;\ngrid-row-end: 1;',
			layout: ''
		});
	})

	test('it should generate a valid css rule: padding 1', () => {
		expect(
			generateCss({ position: { padding: ["1", "1", "1", "1"] } })
		).toEqual({
			position: 'padding: 1px 1px 1px 1px;',
			layout: ''
		});
	})

	test('it should generate a valid css rule: padding 2', () => {
		expect(
			generateCss({ position: { padding: ["1", "", "", "1"] } })
		).toEqual({
			position: 'padding: 1px unset unset 1px;',
			layout: ''
		});
	})

	test('it should generate a valid css rule: margin 1', () => {
		expect(
			generateCss({ position: { margin: ["1", "1", "1", "1"] } })
		).toEqual({
			position: 'margin: 1px 1px 1px 1px;',
			layout: ''
		});
	})

	test('it should generate a valid css rule: margin 2', () => {
		expect(
			generateCss({ position: { margin: ["1", "", "", "1"] } })
		).toEqual({
			position: 'margin: 1px unset unset 1px;',
			layout: ''
		});
	})

	test('it should generate a valid css rule: z-index 1', () => {
		expect(
			generateCss({ position: { zindex: "" } })
		).toEqual({
			position: '',
			layout: ''
		});
	})

	test('it should generate a valid css rule: z-index 2', () => {
		expect(
			generateCss({ position: { zindex: "1" } })
		).toEqual({
			position: 'z-index: 1;',
			layout: ''
		});
	})

})

const css_map = {
	gridarea: {
		name: 'grid-area',
		generate: make_margin
	},
	gap: {
		name: 'grid-gap',
		generate: n => `${n}px`
	},
	columnstart: {
		name: 'grid-column-start',
		generate: self
	},
	columnend: {
		name: 'grid-column-end',
		generate: self
	},
	rowstart: {
		name: 'grid-row-start',
		generate: self
	},
	rowend: {
		name: 'grid-row-end',
		generate: self
	},
	padding: {
		name: 'padding',
		generate: make_margin
	},
	margin: {
		name: 'margin',
		generate: make_margin
	},
	zindex: {
		name: 'z-index',
		generate: self
	}
}
