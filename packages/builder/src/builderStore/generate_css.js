import { filter, map, reduce, toPairs } from "lodash/fp";
import { pipe } from "../common/core";

const self = n => n;
const join_with = delimiter => a => a.join(delimiter);
const empty_string_to_unset = s => s.length ? s : "unset";
const add_suffix = suffix => s => s === 'unset' ? s : s + suffix;

export const make_margin = (values) => pipe(values, [
	map(empty_string_to_unset),
	map(add_suffix('px')),
	join_with(' ')
]);

const tap = message => x => {
	console.log(x);
	return x;
}

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

export const generate_rule = ([name, values]) =>
	`${css_map[name].name}: ${css_map[name].generate(values)};`

const handle_grid = (acc, [name, value]) => {
	let tmp = [];

	if (name === 'row' || name === 'column') {
		if (value[0]) tmp.push([`${name}start`, value[0]]);
		if (value[1]) tmp.push([`${name}end`, value[1]]);
		return acc.concat(tmp)
	}

	return acc.concat([[name, value]]);
}

const object_to_css_string = [
	toPairs,

	reduce(handle_grid, []),
	filter(v => v[1].length),
	map(generate_rule),
	join_with('\n')
];

export const generate_css = ({ layout, position }) => ({
	layout: pipe(layout, object_to_css_string),
	position: pipe(position, object_to_css_string)
})

const apply_class = (id, name, styles) => `.${name}-${id} {\n${styles}\n}`;

export const generate_screen_css = (component_array) => {
	let styles = "";

	for (let i = 0; i < component_array.length; i += 1) {
		const { _styles, _id, _children } = component_array[i];
		const { layout, position } = generate_css(_styles);

		styles += apply_class(_id, 'pos', position) + "\n";
		styles += apply_class(_id, 'lay', layout) + "\n";

		if (_children && _children.length) {
			styles += generate_screen_css(_children) + "\n";
		}

	}
	return styles.trim();
}
