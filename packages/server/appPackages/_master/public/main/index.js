function noop() { }
function assign(tar, src) {
    // @ts-ignore
    for (const k in src)
        tar[k] = src[k];
    return tar;
}
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function create_slot(definition, ctx, fn) {
    if (definition) {
        const slot_ctx = get_slot_context(definition, ctx, fn);
        return definition[0](slot_ctx);
    }
}
function get_slot_context(definition, ctx, fn) {
    return definition[1]
        ? assign({}, assign(ctx.$$scope.ctx, definition[1](fn ? fn(ctx) : {})))
        : ctx.$$scope.ctx;
}
function get_slot_changes(definition, ctx, changed, fn) {
    return definition[1]
        ? assign({}, assign(ctx.$$scope.changed || {}, definition[1](fn ? fn(changed) : {})))
        : ctx.$$scope.changed || {};
}
function null_to_empty(value) {
    return value == null ? '' : value;
}

function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function svg_element(name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function empty() {
    return text('');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else
        node.setAttribute(attribute, value);
}
function children(element) {
    return Array.from(element.childNodes);
}
function claim_element(nodes, name, attributes, svg) {
    for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        if (node.nodeName === name) {
            for (let j = 0; j < node.attributes.length; j += 1) {
                const attribute = node.attributes[j];
                if (!attributes[attribute.name])
                    node.removeAttribute(attribute.name);
            }
            return nodes.splice(i, 1)[0]; // TODO strip unwanted attributes
        }
    }
    return svg ? svg_element(name) : element(name);
}
function claim_text(nodes, data) {
    for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        if (node.nodeType === 3) {
            node.data = '' + data;
            return nodes.splice(i, 1)[0];
        }
    }
    return text(data);
}
function claim_space(nodes) {
    return claim_text(nodes, ' ');
}
function set_data(text, data) {
    data = '' + data;
    if (text.data !== data)
        text.data = data;
}
function set_input_value(input, value) {
    if (value != null || input.value) {
        input.value = value;
    }
}
function set_style(node, key, value, important) {
    node.style.setProperty(key, value, important ? 'important' : '');
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error(`Function called outside component initialization`);
    return current_component;
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
// TODO figure out if we still want to support
// shorthand events, or if we want to implement
// a real bubbling mechanism
function bubble(component, event) {
    const callbacks = component.$$.callbacks[event.type];
    if (callbacks) {
        callbacks.slice().forEach(fn => fn(event));
    }
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
function flush() {
    const seen_callbacks = new Set();
    do {
        // first, call beforeUpdate functions
        // and update components
        while (dirty_components.length) {
            const component = dirty_components.shift();
            set_current_component(component);
            update(component.$$);
        }
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                callback();
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
}
function update($$) {
    if ($$.fragment) {
        $$.update($$.dirty);
        run_all($$.before_update);
        $$.fragment.p($$.dirty, $$.ctx);
        $$.dirty = null;
        $$.after_update.forEach(add_render_callback);
    }
}
const outroing = new Set();
let outros;
function group_outros() {
    outros = {
        r: 0,
        c: [],
        p: outros // parent group
    };
}
function check_outros() {
    if (!outros.r) {
        run_all(outros.c);
    }
    outros = outros.p;
}
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
}
function mount_component(component, target, anchor) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment.m(target, anchor);
    // onMount happens before the initial afterUpdate
    add_render_callback(() => {
        const new_on_destroy = on_mount.map(run).filter(is_function);
        if (on_destroy) {
            on_destroy.push(...new_on_destroy);
        }
        else {
            // Edge case - component was destroyed immediately,
            // most likely as a result of a binding initialising
            run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
    });
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    if (component.$$.fragment) {
        run_all(component.$$.on_destroy);
        component.$$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        component.$$.on_destroy = component.$$.fragment = null;
        component.$$.ctx = {};
    }
}
function make_dirty(component, key) {
    if (!component.$$.dirty) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty = blank_object();
    }
    component.$$.dirty[key] = true;
}
function init(component, options, instance, create_fragment, not_equal, prop_names) {
    const parent_component = current_component;
    set_current_component(component);
    const props = options.props || {};
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props: prop_names,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        before_update: [],
        after_update: [],
        context: new Map(parent_component ? parent_component.$$.context : []),
        // everything else
        callbacks: blank_object(),
        dirty: null
    };
    let ready = false;
    $$.ctx = instance
        ? instance(component, props, (key, ret, value = ret) => {
            if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                if ($$.bound[key])
                    $$.bound[key](value);
                if (ready)
                    make_dirty(component, key);
            }
            return ret;
        })
        : props;
    $$.update();
    ready = true;
    run_all($$.before_update);
    $$.fragment = create_fragment($$.ctx);
    if (options.target) {
        if (options.hydrate) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment.l(children(options.target));
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor);
        flush();
    }
    set_current_component(parent_component);
}
let SvelteElement;
if (typeof HTMLElement !== 'undefined') {
    SvelteElement = class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
        }
        connectedCallback() {
            // @ts-ignore todo: improve typings
            for (const key in this.$$.slotted) {
                // @ts-ignore todo: improve typings
                this.appendChild(this.$$.slotted[key]);
            }
        }
        attributeChangedCallback(attr, _oldValue, newValue) {
            this[attr] = newValue;
        }
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            // TODO should this delegate to addEventListener?
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    };
}
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set() {
        // overridden by instance, if it has props
    }
}

/* src\Button.svelte generated by Svelte v3.12.1 */

function add_css() {
	var style = element("style");
	style.id = 'svelte-1q8lga0-style';
	style.textContent = ".default.svelte-1q8lga0{font-family:inherit;font-size:inherit;padding:0.4em;margin:0 0 0.5em 0;box-sizing:border-box;border:1px solid #ccc;border-radius:2px;color:#333;background-color:#f4f4f4;outline:none}.default.svelte-1q8lga0:active{background-color:#ddd}.default.svelte-1q8lga0:focus{border-color:#666}";
	append(document.head, style);
}

// (30:4) {:else}
function create_else_block(ctx) {
	var current;

	const default_slot_template = ctx.$$slots.default;
	const default_slot = create_slot(default_slot_template, ctx, null);

	return {
		c() {
			if (default_slot) default_slot.c();
		},

		l(nodes) {
			if (default_slot) default_slot.l(nodes);
		},

		m(target, anchor) {
			if (default_slot) {
				default_slot.m(target, anchor);
			}

			current = true;
		},

		p(changed, ctx) {
			if (default_slot && default_slot.p && changed.$$scope) {
				default_slot.p(
					get_slot_changes(default_slot_template, ctx, changed, null),
					get_slot_context(default_slot_template, ctx, null)
				);
			}
		},

		i(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},

		o(local) {
			transition_out(default_slot, local);
			current = false;
		},

		d(detaching) {
			if (default_slot) default_slot.d(detaching);
		}
	};
}

// (28:26) 
function create_if_block_1(ctx) {
	var t;

	return {
		c() {
			t = text(ctx.contentText);
		},

		l(nodes) {
			t = claim_text(nodes, ctx.contentText);
		},

		m(target, anchor) {
			insert(target, t, anchor);
		},

		p(changed, ctx) {
			if (changed.contentText) {
				set_data(t, ctx.contentText);
			}
		},

		i: noop,
		o: noop,

		d(detaching) {
			if (detaching) {
				detach(t);
			}
		}
	};
}

// (25:4) {#if contentComponent && contentComponent._component}
function create_if_block(ctx) {
	var div;

	return {
		c() {
			div = element("div");
		},

		l(nodes) {
			div = claim_element(nodes, "DIV", {}, false);
			var div_nodes = children(div);

			div_nodes.forEach(detach);
		},

		m(target, anchor) {
			insert(target, div, anchor);
			ctx.div_binding(div);
		},

		p: noop,
		i: noop,
		o: noop,

		d(detaching) {
			if (detaching) {
				detach(div);
			}

			ctx.div_binding(null);
		}
	};
}

function create_fragment(ctx) {
	var button, current_block_type_index, if_block, button_class_value, current, dispose;

	var if_block_creators = [
		create_if_block,
		create_if_block_1,
		create_else_block
	];

	var if_blocks = [];

	function select_block_type(changed, ctx) {
		if (ctx.contentComponent && ctx.contentComponent._component) return 0;
		if (ctx.contentText) return 1;
		return 2;
	}

	current_block_type_index = select_block_type(null, ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	return {
		c() {
			button = element("button");
			if_block.c();
			this.h();
		},

		l(nodes) {
			button = claim_element(nodes, "BUTTON", { class: true, disabled: true }, false);
			var button_nodes = children(button);

			if_block.l(button_nodes);
			button_nodes.forEach(detach);
			this.h();
		},

		h() {
			attr(button, "class", button_class_value = "" + null_to_empty(ctx.className) + " svelte-1q8lga0");
			button.disabled = ctx.disabled;
			dispose = listen(button, "click", ctx.clickHandler);
		},

		m(target, anchor) {
			insert(target, button, anchor);
			if_blocks[current_block_type_index].m(button, null);
			current = true;
		},

		p(changed, ctx) {
			var previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(changed, ctx);
			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(changed, ctx);
			} else {
				group_outros();
				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});
				check_outros();

				if_block = if_blocks[current_block_type_index];
				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				}
				transition_in(if_block, 1);
				if_block.m(button, null);
			}

			if ((!current || changed.className) && button_class_value !== (button_class_value = "" + null_to_empty(ctx.className) + " svelte-1q8lga0")) {
				attr(button, "class", button_class_value);
			}

			if (!current || changed.disabled) {
				button.disabled = ctx.disabled;
			}
		},

		i(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},

		o(local) {
			transition_out(if_block);
			current = false;
		},

		d(detaching) {
			if (detaching) {
				detach(button);
			}

			if_blocks[current_block_type_index].d();
			dispose();
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { className = "default", disabled = false, contentText, contentComponent, onClick = () => {} } = $$props;

let { _bb } = $$props;
let contentComponentContainer;


const clickHandler = () => {
	if(onClick) onClick();
};

	let { $$slots = {}, $$scope } = $$props;

	function div_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			$$invalidate('contentComponentContainer', contentComponentContainer = $$value);
		});
	}

	$$self.$set = $$props => {
		if ('className' in $$props) $$invalidate('className', className = $$props.className);
		if ('disabled' in $$props) $$invalidate('disabled', disabled = $$props.disabled);
		if ('contentText' in $$props) $$invalidate('contentText', contentText = $$props.contentText);
		if ('contentComponent' in $$props) $$invalidate('contentComponent', contentComponent = $$props.contentComponent);
		if ('onClick' in $$props) $$invalidate('onClick', onClick = $$props.onClick);
		if ('_bb' in $$props) $$invalidate('_bb', _bb = $$props._bb);
		if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
	};

	$$self.$$.update = ($$dirty = { _bb: 1, contentComponentContainer: 1, contentComponent: 1 }) => {
		if ($$dirty._bb || $$dirty.contentComponentContainer || $$dirty.contentComponent) { {
			if(_bb && contentComponentContainer && contentComponent._component)
				_bb.initialiseComponent(contentComponent, contentComponentContainer);
		} }
	};

	return {
		className,
		disabled,
		contentText,
		contentComponent,
		onClick,
		_bb,
		contentComponentContainer,
		clickHandler,
		div_binding,
		$$slots,
		$$scope
	};
}

class Button extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-1q8lga0-style")) add_css();
		init(this, options, instance, create_fragment, safe_not_equal, ["className", "disabled", "contentText", "contentComponent", "onClick", "_bb"]);
	}
}

/* src\Textbox.svelte generated by Svelte v3.12.1 */

function add_css$1() {
	var style = element("style");
	style.id = 'svelte-1ec4wqj-style';
	style.textContent = ".default.svelte-1ec4wqj{width:100%;font-family:inherit;font-size:inherit;padding:0.4em;margin:0 0 0.5em 0;box-sizing:border-box;border:1px solid #ccc;border-radius:2px;width:100%}.default.svelte-1ec4wqj:disabled{color:#ccc}";
	append(document.head, style);
}

// (32:0) {:else}
function create_else_block$1(ctx) {
	var input, input_class_value;

	return {
		c() {
			input = element("input");
			this.h();
		},

		l(nodes) {
			input = claim_element(nodes, "INPUT", { class: true, type: true, value: true }, false);
			var input_nodes = children(input);

			input_nodes.forEach(detach);
			this.h();
		},

		h() {
			attr(input, "class", input_class_value = "" + null_to_empty(ctx.className) + " svelte-1ec4wqj");
			attr(input, "type", "text");
			input.value = ctx.actualValue;
		},

		m(target, anchor) {
			insert(target, input, anchor);
		},

		p(changed, ctx) {
			if ((changed.className) && input_class_value !== (input_class_value = "" + null_to_empty(ctx.className) + " svelte-1ec4wqj")) {
				attr(input, "class", input_class_value);
			}

			if (changed.actualValue) {
				input.value = ctx.actualValue;
			}
		},

		d(detaching) {
			if (detaching) {
				detach(input);
			}
		}
	};
}

// (28:0) {#if hideValue}
function create_if_block$1(ctx) {
	var input, input_class_value, dispose;

	return {
		c() {
			input = element("input");
			this.h();
		},

		l(nodes) {
			input = claim_element(nodes, "INPUT", { class: true, type: true, value: true }, false);
			var input_nodes = children(input);

			input_nodes.forEach(detach);
			this.h();
		},

		h() {
			attr(input, "class", input_class_value = "" + null_to_empty(ctx.className) + " svelte-1ec4wqj");
			attr(input, "type", "password");
			input.value = ctx.actualValue;
			dispose = listen(input, "change", ctx.change_handler);
		},

		m(target, anchor) {
			insert(target, input, anchor);
		},

		p(changed, ctx) {
			if ((changed.className) && input_class_value !== (input_class_value = "" + null_to_empty(ctx.className) + " svelte-1ec4wqj")) {
				attr(input, "class", input_class_value);
			}

			if (changed.actualValue) {
				input.value = ctx.actualValue;
			}
		},

		d(detaching) {
			if (detaching) {
				detach(input);
			}

			dispose();
		}
	};
}

function create_fragment$1(ctx) {
	var if_block_anchor;

	function select_block_type(changed, ctx) {
		if (ctx.hideValue) return create_if_block$1;
		return create_else_block$1;
	}

	var current_block_type = select_block_type(null, ctx);
	var if_block = current_block_type(ctx);

	return {
		c() {
			if_block.c();
			if_block_anchor = empty();
		},

		l(nodes) {
			if_block.l(nodes);
			if_block_anchor = empty();
		},

		m(target, anchor) {
			if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);
		},

		p(changed, ctx) {
			if (current_block_type === (current_block_type = select_block_type(changed, ctx)) && if_block) {
				if_block.p(changed, ctx);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);
				if (if_block) {
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			}
		},

		i: noop,
		o: noop,

		d(detaching) {
			if_block.d(detaching);

			if (detaching) {
				detach(if_block_anchor);
			}
		}
	};
}

function instance$1($$self, $$props, $$invalidate) {
	let { value="", hideValue = false, className = "default", _bb } = $$props;

let actualValue = "";

	function change_handler(event) {
		bubble($$self, event);
	}

	$$self.$set = $$props => {
		if ('value' in $$props) $$invalidate('value', value = $$props.value);
		if ('hideValue' in $$props) $$invalidate('hideValue', hideValue = $$props.hideValue);
		if ('className' in $$props) $$invalidate('className', className = $$props.className);
		if ('_bb' in $$props) $$invalidate('_bb', _bb = $$props._bb);
	};

	$$self.$$.update = ($$dirty = { _bb: 1, value: 1 }) => {
		if ($$dirty._bb || $$dirty.value) { {
			if(_bb && value._isstate) {
				_bb.store.subscribe(s => {
					$$invalidate('actualValue', actualValue = _bb.store.getValue(s, value));
				});
			}
		} }
	};

	return {
		value,
		hideValue,
		className,
		_bb,
		actualValue,
		change_handler
	};
}

class Textbox extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-1ec4wqj-style")) add_css$1();
		init(this, options, instance$1, create_fragment$1, safe_not_equal, ["value", "hideValue", "className", "_bb"]);
	}
}

/* src\Form.svelte generated by Svelte v3.12.1 */

function add_css$2() {
	var style = element("style");
	style.id = 'svelte-m9d6ue-style';
	style.textContent = ".form-root.svelte-m9d6ue{display:grid;grid-template-columns:[label] auto [control] 1fr}.label.svelte-m9d6ue{grid-column-start:label;padding:5px 10px;vertical-align:middle}.control.svelte-m9d6ue{grid-column-start:control;padding:5px 10px}.overflow.svelte-m9d6ue{grid-column-start:overflow}.full-width.svelte-m9d6ue{width:100%}";
	append(document.head, style);
}

function get_each_context(ctx, list, i) {
	const child_ctx = Object.create(ctx);
	child_ctx.child = list[i];
	child_ctx.index = i;
	return child_ctx;
}

// (30:4) {#each formControls as child, index}
function create_each_block(ctx) {
	var div0, t0_value = ctx.labels[ctx.index] + "", t0, t1, div1, index = ctx.index;

	const assign_div1 = () => ctx.div1_binding(div1, index);
	const unassign_div1 = () => ctx.div1_binding(null, index);

	return {
		c() {
			div0 = element("div");
			t0 = text(t0_value);
			t1 = space();
			div1 = element("div");
			this.h();
		},

		l(nodes) {
			div0 = claim_element(nodes, "DIV", { class: true }, false);
			var div0_nodes = children(div0);

			t0 = claim_text(div0_nodes, t0_value);
			div0_nodes.forEach(detach);
			t1 = claim_space(nodes);

			div1 = claim_element(nodes, "DIV", { class: true }, false);
			var div1_nodes = children(div1);

			div1_nodes.forEach(detach);
			this.h();
		},

		h() {
			attr(div0, "class", "label svelte-m9d6ue");
			attr(div1, "class", "control svelte-m9d6ue");
		},

		m(target, anchor) {
			insert(target, div0, anchor);
			append(div0, t0);
			insert(target, t1, anchor);
			insert(target, div1, anchor);
			assign_div1();
		},

		p(changed, new_ctx) {
			ctx = new_ctx;
			if ((changed.labels) && t0_value !== (t0_value = ctx.labels[ctx.index] + "")) {
				set_data(t0, t0_value);
			}

			if (index !== ctx.index) {
				unassign_div1();
				index = ctx.index;
				assign_div1();
			}
		},

		d(detaching) {
			if (detaching) {
				detach(div0);
				detach(t1);
				detach(div1);
			}

			unassign_div1();
		}
	};
}

function create_fragment$2(ctx) {
	var div, div_class_value;

	let each_value = ctx.formControls;

	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	return {
		c() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}
			this.h();
		},

		l(nodes) {
			div = claim_element(nodes, "DIV", { class: true }, false);
			var div_nodes = children(div);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].l(div_nodes);
			}

			div_nodes.forEach(detach);
			this.h();
		},

		h() {
			attr(div, "class", div_class_value = "form-root " + ctx.containerClass + " svelte-m9d6ue");
		},

		m(target, anchor) {
			insert(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},

		p(changed, ctx) {
			if (changed.htmlElements || changed.labels || changed.formControls) {
				each_value = ctx.formControls;

				let i;
				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(changed, child_ctx);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}
				each_blocks.length = each_value.length;
			}

			if ((changed.containerClass) && div_class_value !== (div_class_value = "form-root " + ctx.containerClass + " svelte-m9d6ue")) {
				attr(div, "class", div_class_value);
			}
		},

		i: noop,
		o: noop,

		d(detaching) {
			if (detaching) {
				detach(div);
			}

			destroy_each(each_blocks, detaching);
		}
	};
}

function instance$2($$self, $$props, $$invalidate) {
	let { containerClass = "", formControls = [], _bb } = $$props;

let htmlElements = {};
let labels = {};

	function div1_binding($$value, index) {
		if (htmlElements[index] === $$value) return;
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			htmlElements[index] = $$value;
			$$invalidate('htmlElements', htmlElements);
		});
	}

	$$self.$set = $$props => {
		if ('containerClass' in $$props) $$invalidate('containerClass', containerClass = $$props.containerClass);
		if ('formControls' in $$props) $$invalidate('formControls', formControls = $$props.formControls);
		if ('_bb' in $$props) $$invalidate('_bb', _bb = $$props._bb);
	};

	$$self.$$.update = ($$dirty = { formControls: 1, _bb: 1, htmlElements: 1 }) => {
		if ($$dirty.formControls || $$dirty._bb || $$dirty.htmlElements) { {
            let cIndex = 0;
            for(let c of formControls) {
                $$invalidate('labels', labels[cIndex] = c.label, labels);
                cIndex++;
            }
        
            if(_bb && htmlElements) {
                for(let el in htmlElements) {
                    _bb.initialiseComponent(
                        formControls[el].control,
                        htmlElements[el]
                    );
                }
            }
        } }
	};

	return {
		containerClass,
		formControls,
		_bb,
		htmlElements,
		labels,
		div1_binding
	};
}

class Form extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-m9d6ue-style")) add_css$2();
		init(this, options, instance$2, create_fragment$2, safe_not_equal, ["containerClass", "formControls", "_bb"]);
	}
}

/* src\Login.svelte generated by Svelte v3.12.1 */

function add_css$3() {
	var style = element("style");
	style.id = 'svelte-crnq0a-style';
	style.textContent = ".root.svelte-crnq0a{height:100%;display:grid;grid-template-columns:[left] 1fr [middle] auto [right] 1fr;grid-template-rows:[top] 1fr [center] auto [bottom] 1fr}.content.svelte-crnq0a{grid-column-start:middle;grid-row-start:center;width:400px}.logo-container.svelte-crnq0a{margin-bottom:20px\n}.logo-container.svelte-crnq0a>img.svelte-crnq0a{max-width:100%}.login-button-container.svelte-crnq0a{text-align:right;margin-top:20px}.incorrect-details-panel.svelte-crnq0a{margin-top:30px;padding:10px;border-style:solid;border-width:1px;border-color:maroon;border-radius:1px;text-align:center;color:maroon;background-color:mistyrose}.form-root.svelte-crnq0a{display:grid;grid-template-columns:[label] auto [control] 1fr}.label.svelte-crnq0a{grid-column-start:label;padding:5px 10px;vertical-align:middle}.control.svelte-crnq0a{grid-column-start:control;padding:5px 10px}.default-input.svelte-crnq0a{font-family:inherit;font-size:inherit;padding:0.4em;margin:0 0 0.5em 0;box-sizing:border-box;border:1px solid #ccc;border-radius:2px;width:100%}.default-button.svelte-crnq0a{font-family:inherit;font-size:inherit;padding:0.4em;margin:0 0 0.5em 0;box-sizing:border-box;border:1px solid #ccc;border-radius:2px;color:#333;background-color:#f4f4f4;outline:none}.default-button.svelte-crnq0a:active{background-color:#ddd}.default-button.svelte-crnq0a:focus{border-color:#666}";
	append(document.head, style);
}

// (57:8) {#if _logo}
function create_if_block_1$1(ctx) {
	var div, img;

	return {
		c() {
			div = element("div");
			img = element("img");
			this.h();
		},

		l(nodes) {
			div = claim_element(nodes, "DIV", { class: true }, false);
			var div_nodes = children(div);

			img = claim_element(div_nodes, "IMG", { src: true, alt: true, class: true }, false);
			var img_nodes = children(img);

			img_nodes.forEach(detach);
			div_nodes.forEach(detach);
			this.h();
		},

		h() {
			attr(img, "src", ctx._logo);
			attr(img, "alt", "logo");
			attr(img, "class", "svelte-crnq0a");
			attr(div, "class", "logo-container svelte-crnq0a");
		},

		m(target, anchor) {
			insert(target, div, anchor);
			append(div, img);
		},

		p(changed, ctx) {
			if (changed._logo) {
				attr(img, "src", ctx._logo);
			}
		},

		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (86:8) {#if incorrect}
function create_if_block$2(ctx) {
	var div, t;

	return {
		c() {
			div = element("div");
			t = text("Incorrect username or password");
			this.h();
		},

		l(nodes) {
			div = claim_element(nodes, "DIV", { class: true }, false);
			var div_nodes = children(div);

			t = claim_text(div_nodes, "Incorrect username or password");
			div_nodes.forEach(detach);
			this.h();
		},

		h() {
			attr(div, "class", "incorrect-details-panel svelte-crnq0a");
		},

		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t);
		},

		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

function create_fragment$3(ctx) {
	var div7, div6, t0, div4, div0, t1, t2, div1, input0, input0_class_value, t3, div2, t4, t5, div3, input1, input1_class_value, t6, div5, button, t7, button_class_value, t8, dispose;

	var if_block0 = (ctx._logo) && create_if_block_1$1(ctx);

	var if_block1 = (ctx.incorrect) && create_if_block$2();

	return {
		c() {
			div7 = element("div");
			div6 = element("div");
			if (if_block0) if_block0.c();
			t0 = space();
			div4 = element("div");
			div0 = element("div");
			t1 = text(ctx.usernameLabel);
			t2 = space();
			div1 = element("div");
			input0 = element("input");
			t3 = space();
			div2 = element("div");
			t4 = text(ctx.passwordLabel);
			t5 = space();
			div3 = element("div");
			input1 = element("input");
			t6 = space();
			div5 = element("div");
			button = element("button");
			t7 = text(ctx.loginButtonLabel);
			t8 = space();
			if (if_block1) if_block1.c();
			this.h();
		},

		l(nodes) {
			div7 = claim_element(nodes, "DIV", { class: true }, false);
			var div7_nodes = children(div7);

			div6 = claim_element(div7_nodes, "DIV", { class: true }, false);
			var div6_nodes = children(div6);

			if (if_block0) if_block0.l(div6_nodes);
			t0 = claim_space(div6_nodes);

			div4 = claim_element(div6_nodes, "DIV", { class: true }, false);
			var div4_nodes = children(div4);

			div0 = claim_element(div4_nodes, "DIV", { class: true }, false);
			var div0_nodes = children(div0);

			t1 = claim_text(div0_nodes, ctx.usernameLabel);
			div0_nodes.forEach(detach);
			t2 = claim_space(div4_nodes);

			div1 = claim_element(div4_nodes, "DIV", { class: true }, false);
			var div1_nodes = children(div1);

			input0 = claim_element(div1_nodes, "INPUT", { type: true, class: true }, false);
			var input0_nodes = children(input0);

			input0_nodes.forEach(detach);
			div1_nodes.forEach(detach);
			t3 = claim_space(div4_nodes);

			div2 = claim_element(div4_nodes, "DIV", { class: true }, false);
			var div2_nodes = children(div2);

			t4 = claim_text(div2_nodes, ctx.passwordLabel);
			div2_nodes.forEach(detach);
			t5 = claim_space(div4_nodes);

			div3 = claim_element(div4_nodes, "DIV", { class: true }, false);
			var div3_nodes = children(div3);

			input1 = claim_element(div3_nodes, "INPUT", { type: true, class: true }, false);
			var input1_nodes = children(input1);

			input1_nodes.forEach(detach);
			div3_nodes.forEach(detach);
			div4_nodes.forEach(detach);
			t6 = claim_space(div6_nodes);

			div5 = claim_element(div6_nodes, "DIV", { class: true }, false);
			var div5_nodes = children(div5);

			button = claim_element(div5_nodes, "BUTTON", { disabled: true, class: true }, false);
			var button_nodes = children(button);

			t7 = claim_text(button_nodes, ctx.loginButtonLabel);
			button_nodes.forEach(detach);
			div5_nodes.forEach(detach);
			t8 = claim_space(div6_nodes);
			if (if_block1) if_block1.l(div6_nodes);
			div6_nodes.forEach(detach);
			div7_nodes.forEach(detach);
			this.h();
		},

		h() {
			attr(div0, "class", "label svelte-crnq0a");
			attr(input0, "type", "text");
			attr(input0, "class", input0_class_value = "" + null_to_empty(ctx._inputClass) + " svelte-crnq0a");
			attr(div1, "class", "control svelte-crnq0a");
			attr(div2, "class", "label svelte-crnq0a");
			attr(input1, "type", "password");
			attr(input1, "class", input1_class_value = "" + null_to_empty(ctx._inputClass) + " svelte-crnq0a");
			attr(div3, "class", "control svelte-crnq0a");
			attr(div4, "class", "form-root svelte-crnq0a");
			button.disabled = ctx.busy;
			attr(button, "class", button_class_value = "" + null_to_empty(ctx._buttonClass) + " svelte-crnq0a");
			attr(div5, "class", "login-button-container svelte-crnq0a");
			attr(div6, "class", "content svelte-crnq0a");
			attr(div7, "class", "root svelte-crnq0a");

			dispose = [
				listen(input0, "input", ctx.input0_input_handler),
				listen(input1, "input", ctx.input1_input_handler),
				listen(button, "click", ctx.login)
			];
		},

		m(target, anchor) {
			insert(target, div7, anchor);
			append(div7, div6);
			if (if_block0) if_block0.m(div6, null);
			append(div6, t0);
			append(div6, div4);
			append(div4, div0);
			append(div0, t1);
			append(div4, t2);
			append(div4, div1);
			append(div1, input0);

			set_input_value(input0, ctx.username);

			append(div4, t3);
			append(div4, div2);
			append(div2, t4);
			append(div4, t5);
			append(div4, div3);
			append(div3, input1);

			set_input_value(input1, ctx.password);

			append(div6, t6);
			append(div6, div5);
			append(div5, button);
			append(button, t7);
			append(div6, t8);
			if (if_block1) if_block1.m(div6, null);
		},

		p(changed, ctx) {
			if (ctx._logo) {
				if (if_block0) {
					if_block0.p(changed, ctx);
				} else {
					if_block0 = create_if_block_1$1(ctx);
					if_block0.c();
					if_block0.m(div6, t0);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (changed.usernameLabel) {
				set_data(t1, ctx.usernameLabel);
			}

			if (changed.username && (input0.value !== ctx.username)) set_input_value(input0, ctx.username);

			if ((changed._inputClass) && input0_class_value !== (input0_class_value = "" + null_to_empty(ctx._inputClass) + " svelte-crnq0a")) {
				attr(input0, "class", input0_class_value);
			}

			if (changed.passwordLabel) {
				set_data(t4, ctx.passwordLabel);
			}

			if (changed.password && (input1.value !== ctx.password)) set_input_value(input1, ctx.password);

			if ((changed._inputClass) && input1_class_value !== (input1_class_value = "" + null_to_empty(ctx._inputClass) + " svelte-crnq0a")) {
				attr(input1, "class", input1_class_value);
			}

			if (changed.loginButtonLabel) {
				set_data(t7, ctx.loginButtonLabel);
			}

			if (changed.busy) {
				button.disabled = ctx.busy;
			}

			if ((changed._buttonClass) && button_class_value !== (button_class_value = "" + null_to_empty(ctx._buttonClass) + " svelte-crnq0a")) {
				attr(button, "class", button_class_value);
			}

			if (ctx.incorrect) {
				if (!if_block1) {
					if_block1 = create_if_block$2();
					if_block1.c();
					if_block1.m(div6, null);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}
		},

		i: noop,
		o: noop,

		d(detaching) {
			if (detaching) {
				detach(div7);
			}

			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			run_all(dispose);
		}
	};
}

function instance$3($$self, $$props, $$invalidate) {
	

let { usernameLabel = "Username", passwordLabel = "Password", loginButtonLabel = "Login", loginRedirect = "", logo = "", buttonClass = "", inputClass="", _bb } = $$props;

let username = "";
let password = "";
let busy = false;
let incorrect = false;
let _logo = "";
let _buttonClass = "";
let _inputClass = "";

const login = () => {
    $$invalidate('busy', busy = true);
    _bb.api.post("/api/authenticate", {username, password})
    .then(r => {
        $$invalidate('busy', busy = false);
        if(r.status === 200) {
            return r.json();
        } else {
            $$invalidate('incorrect', incorrect = true);
            return;
        }
    })
    .then(user => {
        if(user) {
            localStorage.setItem("budibase:user", user);
            location.reload();
        }
    });
};

	function input0_input_handler() {
		username = this.value;
		$$invalidate('username', username);
	}

	function input1_input_handler() {
		password = this.value;
		$$invalidate('password', password);
	}

	$$self.$set = $$props => {
		if ('usernameLabel' in $$props) $$invalidate('usernameLabel', usernameLabel = $$props.usernameLabel);
		if ('passwordLabel' in $$props) $$invalidate('passwordLabel', passwordLabel = $$props.passwordLabel);
		if ('loginButtonLabel' in $$props) $$invalidate('loginButtonLabel', loginButtonLabel = $$props.loginButtonLabel);
		if ('loginRedirect' in $$props) $$invalidate('loginRedirect', loginRedirect = $$props.loginRedirect);
		if ('logo' in $$props) $$invalidate('logo', logo = $$props.logo);
		if ('buttonClass' in $$props) $$invalidate('buttonClass', buttonClass = $$props.buttonClass);
		if ('inputClass' in $$props) $$invalidate('inputClass', inputClass = $$props.inputClass);
		if ('_bb' in $$props) $$invalidate('_bb', _bb = $$props._bb);
	};

	$$self.$$.update = ($$dirty = { _bb: 1, logo: 1, buttonClass: 1, inputClass: 1 }) => {
		if ($$dirty._bb || $$dirty.logo || $$dirty.buttonClass || $$dirty.inputClass) { {
            $$invalidate('_logo', _logo = _bb.relativeUrl(logo));
            $$invalidate('_buttonClass', _buttonClass = buttonClass || "default-button");
            $$invalidate('_inputClass', _inputClass = inputClass || "default-input");
        } }
	};

	return {
		usernameLabel,
		passwordLabel,
		loginButtonLabel,
		loginRedirect,
		logo,
		buttonClass,
		inputClass,
		_bb,
		username,
		password,
		busy,
		incorrect,
		_logo,
		_buttonClass,
		_inputClass,
		login,
		input0_input_handler,
		input1_input_handler
	};
}

class Login extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-crnq0a-style")) add_css$3();
		init(this, options, instance$3, create_fragment$3, safe_not_equal, ["usernameLabel", "passwordLabel", "loginButtonLabel", "loginRedirect", "logo", "buttonClass", "inputClass", "_bb"]);
	}
}

const buildStyle = (styles) => {
    let str = "";
    for(let s in styles) {
        if(styles[s]) {
            str += `${s}: ${styles[s]}; `;
        }
    }
    return str;
};

/* src\Grid.svelte generated by Svelte v3.12.1 */

function add_css$4() {
	var style = element("style");
	style.id = 'svelte-10kw8to-style';
	style.textContent = ".root.svelte-10kw8to{display:grid}";
	append(document.head, style);
}

function get_each_context$1(ctx, list, i) {
	const child_ctx = Object.create(ctx);
	child_ctx.child = list[i];
	child_ctx.index = i;
	return child_ctx;
}

// (49:4) {#each children as child, index}
function create_each_block$1(ctx) {
	var div, index = ctx.index, div_class_value, div_style_value;

	const assign_div = () => ctx.div_binding(div, index);
	const unassign_div = () => ctx.div_binding(null, index);

	return {
		c() {
			div = element("div");
			this.h();
		},

		l(nodes) {
			div = claim_element(nodes, "DIV", { class: true, style: true }, false);
			var div_nodes = children(div);

			div_nodes.forEach(detach);
			this.h();
		},

		h() {
			attr(div, "class", div_class_value = "" + null_to_empty(ctx.itemContainerClass) + " svelte-10kw8to");
			attr(div, "style", div_style_value = ctx.childStyle(ctx.child));
		},

		m(target, anchor) {
			insert(target, div, anchor);
			assign_div();
		},

		p(changed, new_ctx) {
			ctx = new_ctx;
			if (index !== ctx.index) {
				unassign_div();
				index = ctx.index;
				assign_div();
			}

			if ((changed.itemContainerClass) && div_class_value !== (div_class_value = "" + null_to_empty(ctx.itemContainerClass) + " svelte-10kw8to")) {
				attr(div, "class", div_class_value);
			}

			if ((changed.children) && div_style_value !== (div_style_value = ctx.childStyle(ctx.child))) {
				attr(div, "style", div_style_value);
			}
		},

		d(detaching) {
			if (detaching) {
				detach(div);
			}

			unassign_div();
		}
	};
}

function create_fragment$4(ctx) {
	var div, div_class_value;

	let each_value = ctx.children;

	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
	}

	return {
		c() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}
			this.h();
		},

		l(nodes) {
			div = claim_element(nodes, "DIV", { class: true, style: true }, false);
			var div_nodes = children(div);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].l(div_nodes);
			}

			div_nodes.forEach(detach);
			this.h();
		},

		h() {
			attr(div, "class", div_class_value = "root " + ctx.containerClass + " svelte-10kw8to");
			set_style(div, "width", ctx.width);
			set_style(div, "height", ctx.height);
			set_style(div, "grid-template-columns", ctx.gridTemplateColumns);
			set_style(div, "grid-template-rows", ctx.gridTemplateRows);
		},

		m(target, anchor) {
			insert(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},

		p(changed, ctx) {
			if (changed.itemContainerClass || changed.childStyle || changed.children || changed.htmlElements) {
				each_value = ctx.children;

				let i;
				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$1(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(changed, child_ctx);
					} else {
						each_blocks[i] = create_each_block$1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}
				each_blocks.length = each_value.length;
			}

			if ((changed.containerClass) && div_class_value !== (div_class_value = "root " + ctx.containerClass + " svelte-10kw8to")) {
				attr(div, "class", div_class_value);
			}

			if (changed.width) {
				set_style(div, "width", ctx.width);
			}

			if (changed.height) {
				set_style(div, "height", ctx.height);
			}

			if (changed.gridTemplateColumns) {
				set_style(div, "grid-template-columns", ctx.gridTemplateColumns);
			}

			if (changed.gridTemplateRows) {
				set_style(div, "grid-template-rows", ctx.gridTemplateRows);
			}
		},

		i: noop,
		o: noop,

		d(detaching) {
			if (detaching) {
				detach(div);
			}

			destroy_each(each_blocks, detaching);
		}
	};
}

function instance$4($$self, $$props, $$invalidate) {
	

let { gridTemplateRows ="", gridTemplateColumns ="", children = [], width = "auto", height = "auto", containerClass="", itemContainerClass="", _bb } = $$props;
let htmlElements = {};

const childStyle = child => 
    buildStyle({
        "grid-column-start": child.gridColumnStart,
        "grid-column-end": child.gridColumnEnd,
        "grid-column": child.gridColumn,
        "grid-row-start": child.gridRowStart,
        "grid-row-end": child.gridRowStart,
        "grid-row": child.gridRow,
    });

	function div_binding($$value, index) {
		if (htmlElements[index] === $$value) return;
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			htmlElements[index] = $$value;
			$$invalidate('htmlElements', htmlElements);
		});
	}

	$$self.$set = $$props => {
		if ('gridTemplateRows' in $$props) $$invalidate('gridTemplateRows', gridTemplateRows = $$props.gridTemplateRows);
		if ('gridTemplateColumns' in $$props) $$invalidate('gridTemplateColumns', gridTemplateColumns = $$props.gridTemplateColumns);
		if ('children' in $$props) $$invalidate('children', children = $$props.children);
		if ('width' in $$props) $$invalidate('width', width = $$props.width);
		if ('height' in $$props) $$invalidate('height', height = $$props.height);
		if ('containerClass' in $$props) $$invalidate('containerClass', containerClass = $$props.containerClass);
		if ('itemContainerClass' in $$props) $$invalidate('itemContainerClass', itemContainerClass = $$props.itemContainerClass);
		if ('_bb' in $$props) $$invalidate('_bb', _bb = $$props._bb);
	};

	$$self.$$.update = ($$dirty = { _bb: 1, htmlElements: 1, children: 1 }) => {
		if ($$dirty._bb || $$dirty.htmlElements || $$dirty.children) { {
            if(_bb && htmlElements) {
                for(let el in htmlElements) {
                    _bb.initialiseComponent(
                        children[el].control,
                        htmlElements[el]
                    );
                }
            }
        } }
	};

	return {
		gridTemplateRows,
		gridTemplateColumns,
		children,
		width,
		height,
		containerClass,
		itemContainerClass,
		_bb,
		htmlElements,
		childStyle,
		div_binding
	};
}

class Grid extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-10kw8to-style")) add_css$4();
		init(this, options, instance$4, create_fragment$4, safe_not_equal, ["gridTemplateRows", "gridTemplateColumns", "children", "width", "height", "containerClass", "itemContainerClass", "_bb"]);
	}
}

/* src\StackPanel.svelte generated by Svelte v3.12.1 */

function add_css$5() {
	var style = element("style");
	style.id = 'svelte-osi0db-style';
	style.textContent = ".horizontal.svelte-osi0db{display:inline-block}.vertical.svelte-osi0db{display:block}";
	append(document.head, style);
}

function get_each_context$2(ctx, list, i) {
	const child_ctx = Object.create(ctx);
	child_ctx.child = list[i];
	child_ctx.index = i;
	return child_ctx;
}

// (32:4) {#each children as child, index}
function create_each_block$2(ctx) {
	var div1, div0, index = ctx.index, div0_class_value, t, div1_class_value;

	const assign_div0 = () => ctx.div0_binding(div0, index);
	const unassign_div0 = () => ctx.div0_binding(null, index);

	return {
		c() {
			div1 = element("div");
			div0 = element("div");
			t = space();
			this.h();
		},

		l(nodes) {
			div1 = claim_element(nodes, "DIV", { class: true }, false);
			var div1_nodes = children(div1);

			div0 = claim_element(div1_nodes, "DIV", { class: true }, false);
			var div0_nodes = children(div0);

			div0_nodes.forEach(detach);
			t = claim_space(div1_nodes);
			div1_nodes.forEach(detach);
			this.h();
		},

		h() {
			attr(div0, "class", div0_class_value = "" + null_to_empty(ctx.itemContainerClass) + " svelte-osi0db");
			attr(div1, "class", div1_class_value = "" + null_to_empty(ctx.direction) + " svelte-osi0db");
		},

		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, div0);
			assign_div0();
			append(div1, t);
		},

		p(changed, new_ctx) {
			ctx = new_ctx;
			if (index !== ctx.index) {
				unassign_div0();
				index = ctx.index;
				assign_div0();
			}

			if ((changed.itemContainerClass) && div0_class_value !== (div0_class_value = "" + null_to_empty(ctx.itemContainerClass) + " svelte-osi0db")) {
				attr(div0, "class", div0_class_value);
			}

			if ((changed.direction) && div1_class_value !== (div1_class_value = "" + null_to_empty(ctx.direction) + " svelte-osi0db")) {
				attr(div1, "class", div1_class_value);
			}
		},

		d(detaching) {
			if (detaching) {
				detach(div1);
			}

			unassign_div0();
		}
	};
}

function create_fragment$5(ctx) {
	var div, div_class_value;

	let each_value = ctx.children;

	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
	}

	return {
		c() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}
			this.h();
		},

		l(nodes) {
			div = claim_element(nodes, "DIV", { class: true, style: true }, false);
			var div_nodes = children(div);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].l(div_nodes);
			}

			div_nodes.forEach(detach);
			this.h();
		},

		h() {
			attr(div, "class", div_class_value = "root " + ctx.containerClass + " svelte-osi0db");
			set_style(div, "width", ctx.width);
			set_style(div, "height", ctx.height);
		},

		m(target, anchor) {
			insert(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},

		p(changed, ctx) {
			if (changed.direction || changed.itemContainerClass || changed.htmlElements || changed.children) {
				each_value = ctx.children;

				let i;
				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$2(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(changed, child_ctx);
					} else {
						each_blocks[i] = create_each_block$2(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}
				each_blocks.length = each_value.length;
			}

			if ((changed.containerClass) && div_class_value !== (div_class_value = "root " + ctx.containerClass + " svelte-osi0db")) {
				attr(div, "class", div_class_value);
			}

			if (changed.width) {
				set_style(div, "width", ctx.width);
			}

			if (changed.height) {
				set_style(div, "height", ctx.height);
			}
		},

		i: noop,
		o: noop,

		d(detaching) {
			if (detaching) {
				detach(div);
			}

			destroy_each(each_blocks, detaching);
		}
	};
}

function instance$5($$self, $$props, $$invalidate) {
	let { direction = "horizontal", children = [], width = "auto", height = "auto", containerClass="", itemContainerClass="", _bb } = $$props;

let htmlElements = {};

onMount(() => {
    if(_bb && htmlElements) {
        for(let el in htmlElements) {
            _bb.initialiseComponent(
                children[el].control,
                htmlElements[el]
            );
        }
    }
});

	function div0_binding($$value, index) {
		if (htmlElements[index] === $$value) return;
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			htmlElements[index] = $$value;
			$$invalidate('htmlElements', htmlElements);
		});
	}

	$$self.$set = $$props => {
		if ('direction' in $$props) $$invalidate('direction', direction = $$props.direction);
		if ('children' in $$props) $$invalidate('children', children = $$props.children);
		if ('width' in $$props) $$invalidate('width', width = $$props.width);
		if ('height' in $$props) $$invalidate('height', height = $$props.height);
		if ('containerClass' in $$props) $$invalidate('containerClass', containerClass = $$props.containerClass);
		if ('itemContainerClass' in $$props) $$invalidate('itemContainerClass', itemContainerClass = $$props.itemContainerClass);
		if ('_bb' in $$props) $$invalidate('_bb', _bb = $$props._bb);
	};

	return {
		direction,
		children,
		width,
		height,
		containerClass,
		itemContainerClass,
		_bb,
		htmlElements,
		div0_binding
	};
}

class StackPanel extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-osi0db-style")) add_css$5();
		init(this, options, instance$5, create_fragment$5, safe_not_equal, ["direction", "children", "width", "height", "containerClass", "itemContainerClass", "_bb"]);
	}
}

export { Button as button, Form as form, Grid as grid, Login as login, StackPanel as stackpanel, Textbox as textbox };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9zdmVsdGUvaW50ZXJuYWwvaW5kZXgubWpzIiwiLi4vc3JjL0J1dHRvbi5zdmVsdGUiLCIuLi9zcmMvVGV4dGJveC5zdmVsdGUiLCIuLi9zcmMvRm9ybS5zdmVsdGUiLCIuLi9zcmMvTG9naW4uc3ZlbHRlIiwiLi4vc3JjL2J1aWxkU3R5bGUuanMiLCIuLi9zcmMvR3JpZC5zdmVsdGUiLCIuLi9zcmMvU3RhY2tQYW5lbC5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gbm9vcCgpIHsgfVxuY29uc3QgaWRlbnRpdHkgPSB4ID0+IHg7XG5mdW5jdGlvbiBhc3NpZ24odGFyLCBzcmMpIHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgZm9yIChjb25zdCBrIGluIHNyYylcbiAgICAgICAgdGFyW2tdID0gc3JjW2tdO1xuICAgIHJldHVybiB0YXI7XG59XG5mdW5jdGlvbiBpc19wcm9taXNlKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIHZhbHVlLnRoZW4gPT09ICdmdW5jdGlvbic7XG59XG5mdW5jdGlvbiBhZGRfbG9jYXRpb24oZWxlbWVudCwgZmlsZSwgbGluZSwgY29sdW1uLCBjaGFyKSB7XG4gICAgZWxlbWVudC5fX3N2ZWx0ZV9tZXRhID0ge1xuICAgICAgICBsb2M6IHsgZmlsZSwgbGluZSwgY29sdW1uLCBjaGFyIH1cbiAgICB9O1xufVxuZnVuY3Rpb24gcnVuKGZuKSB7XG4gICAgcmV0dXJuIGZuKCk7XG59XG5mdW5jdGlvbiBibGFua19vYmplY3QoKSB7XG4gICAgcmV0dXJuIE9iamVjdC5jcmVhdGUobnVsbCk7XG59XG5mdW5jdGlvbiBydW5fYWxsKGZucykge1xuICAgIGZucy5mb3JFYWNoKHJ1bik7XG59XG5mdW5jdGlvbiBpc19mdW5jdGlvbih0aGluZykge1xuICAgIHJldHVybiB0eXBlb2YgdGhpbmcgPT09ICdmdW5jdGlvbic7XG59XG5mdW5jdGlvbiBzYWZlX25vdF9lcXVhbChhLCBiKSB7XG4gICAgcmV0dXJuIGEgIT0gYSA/IGIgPT0gYiA6IGEgIT09IGIgfHwgKChhICYmIHR5cGVvZiBhID09PSAnb2JqZWN0JykgfHwgdHlwZW9mIGEgPT09ICdmdW5jdGlvbicpO1xufVxuZnVuY3Rpb24gbm90X2VxdWFsKGEsIGIpIHtcbiAgICByZXR1cm4gYSAhPSBhID8gYiA9PSBiIDogYSAhPT0gYjtcbn1cbmZ1bmN0aW9uIHZhbGlkYXRlX3N0b3JlKHN0b3JlLCBuYW1lKSB7XG4gICAgaWYgKCFzdG9yZSB8fCB0eXBlb2Ygc3RvcmUuc3Vic2NyaWJlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJyR7bmFtZX0nIGlzIG5vdCBhIHN0b3JlIHdpdGggYSAnc3Vic2NyaWJlJyBtZXRob2RgKTtcbiAgICB9XG59XG5mdW5jdGlvbiBzdWJzY3JpYmUoc3RvcmUsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgdW5zdWIgPSBzdG9yZS5zdWJzY3JpYmUoY2FsbGJhY2spO1xuICAgIHJldHVybiB1bnN1Yi51bnN1YnNjcmliZSA/ICgpID0+IHVuc3ViLnVuc3Vic2NyaWJlKCkgOiB1bnN1Yjtcbn1cbmZ1bmN0aW9uIGdldF9zdG9yZV92YWx1ZShzdG9yZSkge1xuICAgIGxldCB2YWx1ZTtcbiAgICBzdWJzY3JpYmUoc3RvcmUsIF8gPT4gdmFsdWUgPSBfKSgpO1xuICAgIHJldHVybiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIGNvbXBvbmVudF9zdWJzY3JpYmUoY29tcG9uZW50LCBzdG9yZSwgY2FsbGJhY2spIHtcbiAgICBjb21wb25lbnQuJCQub25fZGVzdHJveS5wdXNoKHN1YnNjcmliZShzdG9yZSwgY2FsbGJhY2spKTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZV9zbG90KGRlZmluaXRpb24sIGN0eCwgZm4pIHtcbiAgICBpZiAoZGVmaW5pdGlvbikge1xuICAgICAgICBjb25zdCBzbG90X2N0eCA9IGdldF9zbG90X2NvbnRleHQoZGVmaW5pdGlvbiwgY3R4LCBmbik7XG4gICAgICAgIHJldHVybiBkZWZpbml0aW9uWzBdKHNsb3RfY3R4KTtcbiAgICB9XG59XG5mdW5jdGlvbiBnZXRfc2xvdF9jb250ZXh0KGRlZmluaXRpb24sIGN0eCwgZm4pIHtcbiAgICByZXR1cm4gZGVmaW5pdGlvblsxXVxuICAgICAgICA/IGFzc2lnbih7fSwgYXNzaWduKGN0eC4kJHNjb3BlLmN0eCwgZGVmaW5pdGlvblsxXShmbiA/IGZuKGN0eCkgOiB7fSkpKVxuICAgICAgICA6IGN0eC4kJHNjb3BlLmN0eDtcbn1cbmZ1bmN0aW9uIGdldF9zbG90X2NoYW5nZXMoZGVmaW5pdGlvbiwgY3R4LCBjaGFuZ2VkLCBmbikge1xuICAgIHJldHVybiBkZWZpbml0aW9uWzFdXG4gICAgICAgID8gYXNzaWduKHt9LCBhc3NpZ24oY3R4LiQkc2NvcGUuY2hhbmdlZCB8fCB7fSwgZGVmaW5pdGlvblsxXShmbiA/IGZuKGNoYW5nZWQpIDoge30pKSlcbiAgICAgICAgOiBjdHguJCRzY29wZS5jaGFuZ2VkIHx8IHt9O1xufVxuZnVuY3Rpb24gZXhjbHVkZV9pbnRlcm5hbF9wcm9wcyhwcm9wcykge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIGZvciAoY29uc3QgayBpbiBwcm9wcylcbiAgICAgICAgaWYgKGtbMF0gIT09ICckJylcbiAgICAgICAgICAgIHJlc3VsdFtrXSA9IHByb3BzW2tdO1xuICAgIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBvbmNlKGZuKSB7XG4gICAgbGV0IHJhbiA9IGZhbHNlO1xuICAgIHJldHVybiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICBpZiAocmFuKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICByYW4gPSB0cnVlO1xuICAgICAgICBmbi5jYWxsKHRoaXMsIC4uLmFyZ3MpO1xuICAgIH07XG59XG5mdW5jdGlvbiBudWxsX3RvX2VtcHR5KHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09IG51bGwgPyAnJyA6IHZhbHVlO1xufVxuZnVuY3Rpb24gc2V0X3N0b3JlX3ZhbHVlKHN0b3JlLCByZXQsIHZhbHVlID0gcmV0KSB7XG4gICAgc3RvcmUuc2V0KHZhbHVlKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG5jb25zdCBpc19jbGllbnQgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJztcbmxldCBub3cgPSBpc19jbGllbnRcbiAgICA/ICgpID0+IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKVxuICAgIDogKCkgPT4gRGF0ZS5ub3coKTtcbmxldCByYWYgPSBpc19jbGllbnQgPyBjYiA9PiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2IpIDogbm9vcDtcbi8vIHVzZWQgaW50ZXJuYWxseSBmb3IgdGVzdGluZ1xuZnVuY3Rpb24gc2V0X25vdyhmbikge1xuICAgIG5vdyA9IGZuO1xufVxuZnVuY3Rpb24gc2V0X3JhZihmbikge1xuICAgIHJhZiA9IGZuO1xufVxuXG5jb25zdCB0YXNrcyA9IG5ldyBTZXQoKTtcbmxldCBydW5uaW5nID0gZmFsc2U7XG5mdW5jdGlvbiBydW5fdGFza3MoKSB7XG4gICAgdGFza3MuZm9yRWFjaCh0YXNrID0+IHtcbiAgICAgICAgaWYgKCF0YXNrWzBdKG5vdygpKSkge1xuICAgICAgICAgICAgdGFza3MuZGVsZXRlKHRhc2spO1xuICAgICAgICAgICAgdGFza1sxXSgpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcnVubmluZyA9IHRhc2tzLnNpemUgPiAwO1xuICAgIGlmIChydW5uaW5nKVxuICAgICAgICByYWYocnVuX3Rhc2tzKTtcbn1cbmZ1bmN0aW9uIGNsZWFyX2xvb3BzKCkge1xuICAgIC8vIGZvciB0ZXN0aW5nLi4uXG4gICAgdGFza3MuZm9yRWFjaCh0YXNrID0+IHRhc2tzLmRlbGV0ZSh0YXNrKSk7XG4gICAgcnVubmluZyA9IGZhbHNlO1xufVxuZnVuY3Rpb24gbG9vcChmbikge1xuICAgIGxldCB0YXNrO1xuICAgIGlmICghcnVubmluZykge1xuICAgICAgICBydW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgcmFmKHJ1bl90YXNrcyk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIHByb21pc2U6IG5ldyBQcm9taXNlKGZ1bGZpbCA9PiB7XG4gICAgICAgICAgICB0YXNrcy5hZGQodGFzayA9IFtmbiwgZnVsZmlsXSk7XG4gICAgICAgIH0pLFxuICAgICAgICBhYm9ydCgpIHtcbiAgICAgICAgICAgIHRhc2tzLmRlbGV0ZSh0YXNrKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmZ1bmN0aW9uIGFwcGVuZCh0YXJnZXQsIG5vZGUpIHtcbiAgICB0YXJnZXQuYXBwZW5kQ2hpbGQobm9kZSk7XG59XG5mdW5jdGlvbiBpbnNlcnQodGFyZ2V0LCBub2RlLCBhbmNob3IpIHtcbiAgICB0YXJnZXQuaW5zZXJ0QmVmb3JlKG5vZGUsIGFuY2hvciB8fCBudWxsKTtcbn1cbmZ1bmN0aW9uIGRldGFjaChub2RlKSB7XG4gICAgbm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xufVxuZnVuY3Rpb24gZGVzdHJveV9lYWNoKGl0ZXJhdGlvbnMsIGRldGFjaGluZykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlcmF0aW9ucy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBpZiAoaXRlcmF0aW9uc1tpXSlcbiAgICAgICAgICAgIGl0ZXJhdGlvbnNbaV0uZChkZXRhY2hpbmcpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGVsZW1lbnQobmFtZSkge1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5hbWUpO1xufVxuZnVuY3Rpb24gZWxlbWVudF9pcyhuYW1lLCBpcykge1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5hbWUsIHsgaXMgfSk7XG59XG5mdW5jdGlvbiBvYmplY3Rfd2l0aG91dF9wcm9wZXJ0aWVzKG9iaiwgZXhjbHVkZSkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tb2JqZWN0LWxpdGVyYWwtdHlwZS1hc3NlcnRpb25cbiAgICBjb25zdCB0YXJnZXQgPSB7fTtcbiAgICBmb3IgKGNvbnN0IGsgaW4gb2JqKSB7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrKVxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgJiYgZXhjbHVkZS5pbmRleE9mKGspID09PSAtMSkge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgdGFyZ2V0W2tdID0gb2JqW2tdO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG59XG5mdW5jdGlvbiBzdmdfZWxlbWVudChuYW1lKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCBuYW1lKTtcbn1cbmZ1bmN0aW9uIHRleHQoZGF0YSkge1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkYXRhKTtcbn1cbmZ1bmN0aW9uIHNwYWNlKCkge1xuICAgIHJldHVybiB0ZXh0KCcgJyk7XG59XG5mdW5jdGlvbiBlbXB0eSgpIHtcbiAgICByZXR1cm4gdGV4dCgnJyk7XG59XG5mdW5jdGlvbiBsaXN0ZW4obm9kZSwgZXZlbnQsIGhhbmRsZXIsIG9wdGlvbnMpIHtcbiAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIsIG9wdGlvbnMpO1xuICAgIHJldHVybiAoKSA9PiBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIsIG9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcHJldmVudF9kZWZhdWx0KGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHJldHVybiBmbi5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgICB9O1xufVxuZnVuY3Rpb24gc3RvcF9wcm9wYWdhdGlvbihmbikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgcmV0dXJuIGZuLmNhbGwodGhpcywgZXZlbnQpO1xuICAgIH07XG59XG5mdW5jdGlvbiBzZWxmKGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGlmIChldmVudC50YXJnZXQgPT09IHRoaXMpXG4gICAgICAgICAgICBmbi5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgICB9O1xufVxuZnVuY3Rpb24gYXR0cihub2RlLCBhdHRyaWJ1dGUsIHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwpXG4gICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZSk7XG4gICAgZWxzZVxuICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGUsIHZhbHVlKTtcbn1cbmZ1bmN0aW9uIHNldF9hdHRyaWJ1dGVzKG5vZGUsIGF0dHJpYnV0ZXMpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIGlmIChrZXkgPT09ICdzdHlsZScpIHtcbiAgICAgICAgICAgIG5vZGUuc3R5bGUuY3NzVGV4dCA9IGF0dHJpYnV0ZXNba2V5XTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChrZXkgaW4gbm9kZSkge1xuICAgICAgICAgICAgbm9kZVtrZXldID0gYXR0cmlidXRlc1trZXldO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYXR0cihub2RlLCBrZXksIGF0dHJpYnV0ZXNba2V5XSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBzZXRfc3ZnX2F0dHJpYnV0ZXMobm9kZSwgYXR0cmlidXRlcykge1xuICAgIGZvciAoY29uc3Qga2V5IGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgYXR0cihub2RlLCBrZXksIGF0dHJpYnV0ZXNba2V5XSk7XG4gICAgfVxufVxuZnVuY3Rpb24gc2V0X2N1c3RvbV9lbGVtZW50X2RhdGEobm9kZSwgcHJvcCwgdmFsdWUpIHtcbiAgICBpZiAocHJvcCBpbiBub2RlKSB7XG4gICAgICAgIG5vZGVbcHJvcF0gPSB2YWx1ZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGF0dHIobm9kZSwgcHJvcCwgdmFsdWUpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHhsaW5rX2F0dHIobm9kZSwgYXR0cmlidXRlLCB2YWx1ZSkge1xuICAgIG5vZGUuc2V0QXR0cmlidXRlTlMoJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnLCBhdHRyaWJ1dGUsIHZhbHVlKTtcbn1cbmZ1bmN0aW9uIGdldF9iaW5kaW5nX2dyb3VwX3ZhbHVlKGdyb3VwKSB7XG4gICAgY29uc3QgdmFsdWUgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdyb3VwLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGlmIChncm91cFtpXS5jaGVja2VkKVxuICAgICAgICAgICAgdmFsdWUucHVzaChncm91cFtpXS5fX3ZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xufVxuZnVuY3Rpb24gdG9fbnVtYmVyKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSAnJyA/IHVuZGVmaW5lZCA6ICt2YWx1ZTtcbn1cbmZ1bmN0aW9uIHRpbWVfcmFuZ2VzX3RvX2FycmF5KHJhbmdlcykge1xuICAgIGNvbnN0IGFycmF5ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByYW5nZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgYXJyYXkucHVzaCh7IHN0YXJ0OiByYW5nZXMuc3RhcnQoaSksIGVuZDogcmFuZ2VzLmVuZChpKSB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5O1xufVxuZnVuY3Rpb24gY2hpbGRyZW4oZWxlbWVudCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKGVsZW1lbnQuY2hpbGROb2Rlcyk7XG59XG5mdW5jdGlvbiBjbGFpbV9lbGVtZW50KG5vZGVzLCBuYW1lLCBhdHRyaWJ1dGVzLCBzdmcpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgaWYgKG5vZGUubm9kZU5hbWUgPT09IG5hbWUpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbm9kZS5hdHRyaWJ1dGVzLmxlbmd0aDsgaiArPSAxKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXR0cmlidXRlID0gbm9kZS5hdHRyaWJ1dGVzW2pdO1xuICAgICAgICAgICAgICAgIGlmICghYXR0cmlidXRlc1thdHRyaWJ1dGUubmFtZV0pXG4gICAgICAgICAgICAgICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZS5uYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBub2Rlcy5zcGxpY2UoaSwgMSlbMF07IC8vIFRPRE8gc3RyaXAgdW53YW50ZWQgYXR0cmlidXRlc1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdmcgPyBzdmdfZWxlbWVudChuYW1lKSA6IGVsZW1lbnQobmFtZSk7XG59XG5mdW5jdGlvbiBjbGFpbV90ZXh0KG5vZGVzLCBkYXRhKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBub2RlID0gbm9kZXNbaV07XG4gICAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAzKSB7XG4gICAgICAgICAgICBub2RlLmRhdGEgPSAnJyArIGRhdGE7XG4gICAgICAgICAgICByZXR1cm4gbm9kZXMuc3BsaWNlKGksIDEpWzBdO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0ZXh0KGRhdGEpO1xufVxuZnVuY3Rpb24gY2xhaW1fc3BhY2Uobm9kZXMpIHtcbiAgICByZXR1cm4gY2xhaW1fdGV4dChub2RlcywgJyAnKTtcbn1cbmZ1bmN0aW9uIHNldF9kYXRhKHRleHQsIGRhdGEpIHtcbiAgICBkYXRhID0gJycgKyBkYXRhO1xuICAgIGlmICh0ZXh0LmRhdGEgIT09IGRhdGEpXG4gICAgICAgIHRleHQuZGF0YSA9IGRhdGE7XG59XG5mdW5jdGlvbiBzZXRfaW5wdXRfdmFsdWUoaW5wdXQsIHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlICE9IG51bGwgfHwgaW5wdXQudmFsdWUpIHtcbiAgICAgICAgaW5wdXQudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG59XG5mdW5jdGlvbiBzZXRfaW5wdXRfdHlwZShpbnB1dCwgdHlwZSkge1xuICAgIHRyeSB7XG4gICAgICAgIGlucHV0LnR5cGUgPSB0eXBlO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICAvLyBkbyBub3RoaW5nXG4gICAgfVxufVxuZnVuY3Rpb24gc2V0X3N0eWxlKG5vZGUsIGtleSwgdmFsdWUsIGltcG9ydGFudCkge1xuICAgIG5vZGUuc3R5bGUuc2V0UHJvcGVydHkoa2V5LCB2YWx1ZSwgaW1wb3J0YW50ID8gJ2ltcG9ydGFudCcgOiAnJyk7XG59XG5mdW5jdGlvbiBzZWxlY3Rfb3B0aW9uKHNlbGVjdCwgdmFsdWUpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlbGVjdC5vcHRpb25zLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbiA9IHNlbGVjdC5vcHRpb25zW2ldO1xuICAgICAgICBpZiAob3B0aW9uLl9fdmFsdWUgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICBvcHRpb24uc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gc2VsZWN0X29wdGlvbnMoc2VsZWN0LCB2YWx1ZSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0Lm9wdGlvbnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uID0gc2VsZWN0Lm9wdGlvbnNbaV07XG4gICAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IH52YWx1ZS5pbmRleE9mKG9wdGlvbi5fX3ZhbHVlKTtcbiAgICB9XG59XG5mdW5jdGlvbiBzZWxlY3RfdmFsdWUoc2VsZWN0KSB7XG4gICAgY29uc3Qgc2VsZWN0ZWRfb3B0aW9uID0gc2VsZWN0LnF1ZXJ5U2VsZWN0b3IoJzpjaGVja2VkJykgfHwgc2VsZWN0Lm9wdGlvbnNbMF07XG4gICAgcmV0dXJuIHNlbGVjdGVkX29wdGlvbiAmJiBzZWxlY3RlZF9vcHRpb24uX192YWx1ZTtcbn1cbmZ1bmN0aW9uIHNlbGVjdF9tdWx0aXBsZV92YWx1ZShzZWxlY3QpIHtcbiAgICByZXR1cm4gW10ubWFwLmNhbGwoc2VsZWN0LnF1ZXJ5U2VsZWN0b3JBbGwoJzpjaGVja2VkJyksIG9wdGlvbiA9PiBvcHRpb24uX192YWx1ZSk7XG59XG5mdW5jdGlvbiBhZGRfcmVzaXplX2xpc3RlbmVyKGVsZW1lbnQsIGZuKSB7XG4gICAgaWYgKGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkucG9zaXRpb24gPT09ICdzdGF0aWMnKSB7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuICAgIH1cbiAgICBjb25zdCBvYmplY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvYmplY3QnKTtcbiAgICBvYmplY3Quc2V0QXR0cmlidXRlKCdzdHlsZScsICdkaXNwbGF5OiBibG9jazsgcG9zaXRpb246IGFic29sdXRlOyB0b3A6IDA7IGxlZnQ6IDA7IGhlaWdodDogMTAwJTsgd2lkdGg6IDEwMCU7IG92ZXJmbG93OiBoaWRkZW47IHBvaW50ZXItZXZlbnRzOiBub25lOyB6LWluZGV4OiAtMTsnKTtcbiAgICBvYmplY3QudHlwZSA9ICd0ZXh0L2h0bWwnO1xuICAgIG9iamVjdC50YWJJbmRleCA9IC0xO1xuICAgIGxldCB3aW47XG4gICAgb2JqZWN0Lm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgd2luID0gb2JqZWN0LmNvbnRlbnREb2N1bWVudC5kZWZhdWx0VmlldztcbiAgICAgICAgd2luLmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGZuKTtcbiAgICB9O1xuICAgIGlmICgvVHJpZGVudC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSkge1xuICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKG9iamVjdCk7XG4gICAgICAgIG9iamVjdC5kYXRhID0gJ2Fib3V0OmJsYW5rJztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIG9iamVjdC5kYXRhID0gJ2Fib3V0OmJsYW5rJztcbiAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChvYmplY3QpO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBjYW5jZWw6ICgpID0+IHtcbiAgICAgICAgICAgIHdpbiAmJiB3aW4ucmVtb3ZlRXZlbnRMaXN0ZW5lciAmJiB3aW4ucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZm4pO1xuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVDaGlsZChvYmplY3QpO1xuICAgICAgICB9XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHRvZ2dsZV9jbGFzcyhlbGVtZW50LCBuYW1lLCB0b2dnbGUpIHtcbiAgICBlbGVtZW50LmNsYXNzTGlzdFt0b2dnbGUgPyAnYWRkJyA6ICdyZW1vdmUnXShuYW1lKTtcbn1cbmZ1bmN0aW9uIGN1c3RvbV9ldmVudCh0eXBlLCBkZXRhaWwpIHtcbiAgICBjb25zdCBlID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0N1c3RvbUV2ZW50Jyk7XG4gICAgZS5pbml0Q3VzdG9tRXZlbnQodHlwZSwgZmFsc2UsIGZhbHNlLCBkZXRhaWwpO1xuICAgIHJldHVybiBlO1xufVxuY2xhc3MgSHRtbFRhZyB7XG4gICAgY29uc3RydWN0b3IoaHRtbCwgYW5jaG9yID0gbnVsbCkge1xuICAgICAgICB0aGlzLmUgPSBlbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy5hID0gYW5jaG9yO1xuICAgICAgICB0aGlzLnUoaHRtbCk7XG4gICAgfVxuICAgIG0odGFyZ2V0LCBhbmNob3IgPSBudWxsKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5uLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBpbnNlcnQodGFyZ2V0LCB0aGlzLm5baV0sIGFuY2hvcik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50ID0gdGFyZ2V0O1xuICAgIH1cbiAgICB1KGh0bWwpIHtcbiAgICAgICAgdGhpcy5lLmlubmVySFRNTCA9IGh0bWw7XG4gICAgICAgIHRoaXMubiA9IEFycmF5LmZyb20odGhpcy5lLmNoaWxkTm9kZXMpO1xuICAgIH1cbiAgICBwKGh0bWwpIHtcbiAgICAgICAgdGhpcy5kKCk7XG4gICAgICAgIHRoaXMudShodG1sKTtcbiAgICAgICAgdGhpcy5tKHRoaXMudCwgdGhpcy5hKTtcbiAgICB9XG4gICAgZCgpIHtcbiAgICAgICAgdGhpcy5uLmZvckVhY2goZGV0YWNoKTtcbiAgICB9XG59XG5cbmxldCBzdHlsZXNoZWV0O1xubGV0IGFjdGl2ZSA9IDA7XG5sZXQgY3VycmVudF9ydWxlcyA9IHt9O1xuLy8gaHR0cHM6Ly9naXRodWIuY29tL2Rhcmtza3lhcHAvc3RyaW5nLWhhc2gvYmxvYi9tYXN0ZXIvaW5kZXguanNcbmZ1bmN0aW9uIGhhc2goc3RyKSB7XG4gICAgbGV0IGhhc2ggPSA1MzgxO1xuICAgIGxldCBpID0gc3RyLmxlbmd0aDtcbiAgICB3aGlsZSAoaS0tKVxuICAgICAgICBoYXNoID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgXiBzdHIuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4gaGFzaCA+Pj4gMDtcbn1cbmZ1bmN0aW9uIGNyZWF0ZV9ydWxlKG5vZGUsIGEsIGIsIGR1cmF0aW9uLCBkZWxheSwgZWFzZSwgZm4sIHVpZCA9IDApIHtcbiAgICBjb25zdCBzdGVwID0gMTYuNjY2IC8gZHVyYXRpb247XG4gICAgbGV0IGtleWZyYW1lcyA9ICd7XFxuJztcbiAgICBmb3IgKGxldCBwID0gMDsgcCA8PSAxOyBwICs9IHN0ZXApIHtcbiAgICAgICAgY29uc3QgdCA9IGEgKyAoYiAtIGEpICogZWFzZShwKTtcbiAgICAgICAga2V5ZnJhbWVzICs9IHAgKiAxMDAgKyBgJXske2ZuKHQsIDEgLSB0KX19XFxuYDtcbiAgICB9XG4gICAgY29uc3QgcnVsZSA9IGtleWZyYW1lcyArIGAxMDAlIHske2ZuKGIsIDEgLSBiKX19XFxufWA7XG4gICAgY29uc3QgbmFtZSA9IGBfX3N2ZWx0ZV8ke2hhc2gocnVsZSl9XyR7dWlkfWA7XG4gICAgaWYgKCFjdXJyZW50X3J1bGVzW25hbWVdKSB7XG4gICAgICAgIGlmICghc3R5bGVzaGVldCkge1xuICAgICAgICAgICAgY29uc3Qgc3R5bGUgPSBlbGVtZW50KCdzdHlsZScpO1xuICAgICAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgICAgICAgICBzdHlsZXNoZWV0ID0gc3R5bGUuc2hlZXQ7XG4gICAgICAgIH1cbiAgICAgICAgY3VycmVudF9ydWxlc1tuYW1lXSA9IHRydWU7XG4gICAgICAgIHN0eWxlc2hlZXQuaW5zZXJ0UnVsZShgQGtleWZyYW1lcyAke25hbWV9ICR7cnVsZX1gLCBzdHlsZXNoZWV0LmNzc1J1bGVzLmxlbmd0aCk7XG4gICAgfVxuICAgIGNvbnN0IGFuaW1hdGlvbiA9IG5vZGUuc3R5bGUuYW5pbWF0aW9uIHx8ICcnO1xuICAgIG5vZGUuc3R5bGUuYW5pbWF0aW9uID0gYCR7YW5pbWF0aW9uID8gYCR7YW5pbWF0aW9ufSwgYCA6IGBgfSR7bmFtZX0gJHtkdXJhdGlvbn1tcyBsaW5lYXIgJHtkZWxheX1tcyAxIGJvdGhgO1xuICAgIGFjdGl2ZSArPSAxO1xuICAgIHJldHVybiBuYW1lO1xufVxuZnVuY3Rpb24gZGVsZXRlX3J1bGUobm9kZSwgbmFtZSkge1xuICAgIG5vZGUuc3R5bGUuYW5pbWF0aW9uID0gKG5vZGUuc3R5bGUuYW5pbWF0aW9uIHx8ICcnKVxuICAgICAgICAuc3BsaXQoJywgJylcbiAgICAgICAgLmZpbHRlcihuYW1lXG4gICAgICAgID8gYW5pbSA9PiBhbmltLmluZGV4T2YobmFtZSkgPCAwIC8vIHJlbW92ZSBzcGVjaWZpYyBhbmltYXRpb25cbiAgICAgICAgOiBhbmltID0+IGFuaW0uaW5kZXhPZignX19zdmVsdGUnKSA9PT0gLTEgLy8gcmVtb3ZlIGFsbCBTdmVsdGUgYW5pbWF0aW9uc1xuICAgIClcbiAgICAgICAgLmpvaW4oJywgJyk7XG4gICAgaWYgKG5hbWUgJiYgIS0tYWN0aXZlKVxuICAgICAgICBjbGVhcl9ydWxlcygpO1xufVxuZnVuY3Rpb24gY2xlYXJfcnVsZXMoKSB7XG4gICAgcmFmKCgpID0+IHtcbiAgICAgICAgaWYgKGFjdGl2ZSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgbGV0IGkgPSBzdHlsZXNoZWV0LmNzc1J1bGVzLmxlbmd0aDtcbiAgICAgICAgd2hpbGUgKGktLSlcbiAgICAgICAgICAgIHN0eWxlc2hlZXQuZGVsZXRlUnVsZShpKTtcbiAgICAgICAgY3VycmVudF9ydWxlcyA9IHt9O1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVfYW5pbWF0aW9uKG5vZGUsIGZyb20sIGZuLCBwYXJhbXMpIHtcbiAgICBpZiAoIWZyb20pXG4gICAgICAgIHJldHVybiBub29wO1xuICAgIGNvbnN0IHRvID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBpZiAoZnJvbS5sZWZ0ID09PSB0by5sZWZ0ICYmIGZyb20ucmlnaHQgPT09IHRvLnJpZ2h0ICYmIGZyb20udG9wID09PSB0by50b3AgJiYgZnJvbS5ib3R0b20gPT09IHRvLmJvdHRvbSlcbiAgICAgICAgcmV0dXJuIG5vb3A7XG4gICAgY29uc3QgeyBkZWxheSA9IDAsIGR1cmF0aW9uID0gMzAwLCBlYXNpbmcgPSBpZGVudGl0eSwgXG4gICAgLy8gQHRzLWlnbm9yZSB0b2RvOiBzaG91bGQgdGhpcyBiZSBzZXBhcmF0ZWQgZnJvbSBkZXN0cnVjdHVyaW5nPyBPciBzdGFydC9lbmQgYWRkZWQgdG8gcHVibGljIGFwaSBhbmQgZG9jdW1lbnRhdGlvbj9cbiAgICBzdGFydDogc3RhcnRfdGltZSA9IG5vdygpICsgZGVsYXksIFxuICAgIC8vIEB0cy1pZ25vcmUgdG9kbzpcbiAgICBlbmQgPSBzdGFydF90aW1lICsgZHVyYXRpb24sIHRpY2sgPSBub29wLCBjc3MgfSA9IGZuKG5vZGUsIHsgZnJvbSwgdG8gfSwgcGFyYW1zKTtcbiAgICBsZXQgcnVubmluZyA9IHRydWU7XG4gICAgbGV0IHN0YXJ0ZWQgPSBmYWxzZTtcbiAgICBsZXQgbmFtZTtcbiAgICBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgICAgaWYgKGNzcykge1xuICAgICAgICAgICAgbmFtZSA9IGNyZWF0ZV9ydWxlKG5vZGUsIDAsIDEsIGR1cmF0aW9uLCBkZWxheSwgZWFzaW5nLCBjc3MpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZGVsYXkpIHtcbiAgICAgICAgICAgIHN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHN0b3AoKSB7XG4gICAgICAgIGlmIChjc3MpXG4gICAgICAgICAgICBkZWxldGVfcnVsZShub2RlLCBuYW1lKTtcbiAgICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgIH1cbiAgICBsb29wKG5vdyA9PiB7XG4gICAgICAgIGlmICghc3RhcnRlZCAmJiBub3cgPj0gc3RhcnRfdGltZSkge1xuICAgICAgICAgICAgc3RhcnRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0YXJ0ZWQgJiYgbm93ID49IGVuZCkge1xuICAgICAgICAgICAgdGljaygxLCAwKTtcbiAgICAgICAgICAgIHN0b3AoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXJ1bm5pbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RhcnRlZCkge1xuICAgICAgICAgICAgY29uc3QgcCA9IG5vdyAtIHN0YXJ0X3RpbWU7XG4gICAgICAgICAgICBjb25zdCB0ID0gMCArIDEgKiBlYXNpbmcocCAvIGR1cmF0aW9uKTtcbiAgICAgICAgICAgIHRpY2sodCwgMSAtIHQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICAgIHN0YXJ0KCk7XG4gICAgdGljaygwLCAxKTtcbiAgICByZXR1cm4gc3RvcDtcbn1cbmZ1bmN0aW9uIGZpeF9wb3NpdGlvbihub2RlKSB7XG4gICAgY29uc3Qgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKG5vZGUpO1xuICAgIGlmIChzdHlsZS5wb3NpdGlvbiAhPT0gJ2Fic29sdXRlJyAmJiBzdHlsZS5wb3NpdGlvbiAhPT0gJ2ZpeGVkJykge1xuICAgICAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IHN0eWxlO1xuICAgICAgICBjb25zdCBhID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgbm9kZS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIG5vZGUuc3R5bGUud2lkdGggPSB3aWR0aDtcbiAgICAgICAgbm9kZS5zdHlsZS5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgIGFkZF90cmFuc2Zvcm0obm9kZSwgYSk7XG4gICAgfVxufVxuZnVuY3Rpb24gYWRkX3RyYW5zZm9ybShub2RlLCBhKSB7XG4gICAgY29uc3QgYiA9IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgaWYgKGEubGVmdCAhPT0gYi5sZWZ0IHx8IGEudG9wICE9PSBiLnRvcCkge1xuICAgICAgICBjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IHN0eWxlLnRyYW5zZm9ybSA9PT0gJ25vbmUnID8gJycgOiBzdHlsZS50cmFuc2Zvcm07XG4gICAgICAgIG5vZGUuc3R5bGUudHJhbnNmb3JtID0gYCR7dHJhbnNmb3JtfSB0cmFuc2xhdGUoJHthLmxlZnQgLSBiLmxlZnR9cHgsICR7YS50b3AgLSBiLnRvcH1weClgO1xuICAgIH1cbn1cblxubGV0IGN1cnJlbnRfY29tcG9uZW50O1xuZnVuY3Rpb24gc2V0X2N1cnJlbnRfY29tcG9uZW50KGNvbXBvbmVudCkge1xuICAgIGN1cnJlbnRfY29tcG9uZW50ID0gY29tcG9uZW50O1xufVxuZnVuY3Rpb24gZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkge1xuICAgIGlmICghY3VycmVudF9jb21wb25lbnQpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgRnVuY3Rpb24gY2FsbGVkIG91dHNpZGUgY29tcG9uZW50IGluaXRpYWxpemF0aW9uYCk7XG4gICAgcmV0dXJuIGN1cnJlbnRfY29tcG9uZW50O1xufVxuZnVuY3Rpb24gYmVmb3JlVXBkYXRlKGZuKSB7XG4gICAgZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQuYmVmb3JlX3VwZGF0ZS5wdXNoKGZuKTtcbn1cbmZ1bmN0aW9uIG9uTW91bnQoZm4pIHtcbiAgICBnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5vbl9tb3VudC5wdXNoKGZuKTtcbn1cbmZ1bmN0aW9uIGFmdGVyVXBkYXRlKGZuKSB7XG4gICAgZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQuYWZ0ZXJfdXBkYXRlLnB1c2goZm4pO1xufVxuZnVuY3Rpb24gb25EZXN0cm95KGZuKSB7XG4gICAgZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQub25fZGVzdHJveS5wdXNoKGZuKTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUV2ZW50RGlzcGF0Y2hlcigpIHtcbiAgICBjb25zdCBjb21wb25lbnQgPSBjdXJyZW50X2NvbXBvbmVudDtcbiAgICByZXR1cm4gKHR5cGUsIGRldGFpbCkgPT4ge1xuICAgICAgICBjb25zdCBjYWxsYmFja3MgPSBjb21wb25lbnQuJCQuY2FsbGJhY2tzW3R5cGVdO1xuICAgICAgICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgICAgICAgICAvLyBUT0RPIGFyZSB0aGVyZSBzaXR1YXRpb25zIHdoZXJlIGV2ZW50cyBjb3VsZCBiZSBkaXNwYXRjaGVkXG4gICAgICAgICAgICAvLyBpbiBhIHNlcnZlciAobm9uLURPTSkgZW52aXJvbm1lbnQ/XG4gICAgICAgICAgICBjb25zdCBldmVudCA9IGN1c3RvbV9ldmVudCh0eXBlLCBkZXRhaWwpO1xuICAgICAgICAgICAgY2FsbGJhY2tzLnNsaWNlKCkuZm9yRWFjaChmbiA9PiB7XG4gICAgICAgICAgICAgICAgZm4uY2FsbChjb21wb25lbnQsIGV2ZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHNldENvbnRleHQoa2V5LCBjb250ZXh0KSB7XG4gICAgZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQuY29udGV4dC5zZXQoa2V5LCBjb250ZXh0KTtcbn1cbmZ1bmN0aW9uIGdldENvbnRleHQoa2V5KSB7XG4gICAgcmV0dXJuIGdldF9jdXJyZW50X2NvbXBvbmVudCgpLiQkLmNvbnRleHQuZ2V0KGtleSk7XG59XG4vLyBUT0RPIGZpZ3VyZSBvdXQgaWYgd2Ugc3RpbGwgd2FudCB0byBzdXBwb3J0XG4vLyBzaG9ydGhhbmQgZXZlbnRzLCBvciBpZiB3ZSB3YW50IHRvIGltcGxlbWVudFxuLy8gYSByZWFsIGJ1YmJsaW5nIG1lY2hhbmlzbVxuZnVuY3Rpb24gYnViYmxlKGNvbXBvbmVudCwgZXZlbnQpIHtcbiAgICBjb25zdCBjYWxsYmFja3MgPSBjb21wb25lbnQuJCQuY2FsbGJhY2tzW2V2ZW50LnR5cGVdO1xuICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgICAgY2FsbGJhY2tzLnNsaWNlKCkuZm9yRWFjaChmbiA9PiBmbihldmVudCkpO1xuICAgIH1cbn1cblxuY29uc3QgZGlydHlfY29tcG9uZW50cyA9IFtdO1xuY29uc3QgaW50cm9zID0geyBlbmFibGVkOiBmYWxzZSB9O1xuY29uc3QgYmluZGluZ19jYWxsYmFja3MgPSBbXTtcbmNvbnN0IHJlbmRlcl9jYWxsYmFja3MgPSBbXTtcbmNvbnN0IGZsdXNoX2NhbGxiYWNrcyA9IFtdO1xuY29uc3QgcmVzb2x2ZWRfcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xubGV0IHVwZGF0ZV9zY2hlZHVsZWQgPSBmYWxzZTtcbmZ1bmN0aW9uIHNjaGVkdWxlX3VwZGF0ZSgpIHtcbiAgICBpZiAoIXVwZGF0ZV9zY2hlZHVsZWQpIHtcbiAgICAgICAgdXBkYXRlX3NjaGVkdWxlZCA9IHRydWU7XG4gICAgICAgIHJlc29sdmVkX3Byb21pc2UudGhlbihmbHVzaCk7XG4gICAgfVxufVxuZnVuY3Rpb24gdGljaygpIHtcbiAgICBzY2hlZHVsZV91cGRhdGUoKTtcbiAgICByZXR1cm4gcmVzb2x2ZWRfcHJvbWlzZTtcbn1cbmZ1bmN0aW9uIGFkZF9yZW5kZXJfY2FsbGJhY2soZm4pIHtcbiAgICByZW5kZXJfY2FsbGJhY2tzLnB1c2goZm4pO1xufVxuZnVuY3Rpb24gYWRkX2ZsdXNoX2NhbGxiYWNrKGZuKSB7XG4gICAgZmx1c2hfY2FsbGJhY2tzLnB1c2goZm4pO1xufVxuZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgY29uc3Qgc2Vlbl9jYWxsYmFja3MgPSBuZXcgU2V0KCk7XG4gICAgZG8ge1xuICAgICAgICAvLyBmaXJzdCwgY2FsbCBiZWZvcmVVcGRhdGUgZnVuY3Rpb25zXG4gICAgICAgIC8vIGFuZCB1cGRhdGUgY29tcG9uZW50c1xuICAgICAgICB3aGlsZSAoZGlydHlfY29tcG9uZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGRpcnR5X2NvbXBvbmVudHMuc2hpZnQoKTtcbiAgICAgICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChjb21wb25lbnQpO1xuICAgICAgICAgICAgdXBkYXRlKGNvbXBvbmVudC4kJCk7XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKGJpbmRpbmdfY2FsbGJhY2tzLmxlbmd0aClcbiAgICAgICAgICAgIGJpbmRpbmdfY2FsbGJhY2tzLnBvcCgpKCk7XG4gICAgICAgIC8vIHRoZW4sIG9uY2UgY29tcG9uZW50cyBhcmUgdXBkYXRlZCwgY2FsbFxuICAgICAgICAvLyBhZnRlclVwZGF0ZSBmdW5jdGlvbnMuIFRoaXMgbWF5IGNhdXNlXG4gICAgICAgIC8vIHN1YnNlcXVlbnQgdXBkYXRlcy4uLlxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlbmRlcl9jYWxsYmFja3MubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrID0gcmVuZGVyX2NhbGxiYWNrc1tpXTtcbiAgICAgICAgICAgIGlmICghc2Vlbl9jYWxsYmFja3MuaGFzKGNhbGxiYWNrKSkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgLy8gLi4uc28gZ3VhcmQgYWdhaW5zdCBpbmZpbml0ZSBsb29wc1xuICAgICAgICAgICAgICAgIHNlZW5fY2FsbGJhY2tzLmFkZChjYWxsYmFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVuZGVyX2NhbGxiYWNrcy5sZW5ndGggPSAwO1xuICAgIH0gd2hpbGUgKGRpcnR5X2NvbXBvbmVudHMubGVuZ3RoKTtcbiAgICB3aGlsZSAoZmx1c2hfY2FsbGJhY2tzLmxlbmd0aCkge1xuICAgICAgICBmbHVzaF9jYWxsYmFja3MucG9wKCkoKTtcbiAgICB9XG4gICAgdXBkYXRlX3NjaGVkdWxlZCA9IGZhbHNlO1xufVxuZnVuY3Rpb24gdXBkYXRlKCQkKSB7XG4gICAgaWYgKCQkLmZyYWdtZW50KSB7XG4gICAgICAgICQkLnVwZGF0ZSgkJC5kaXJ0eSk7XG4gICAgICAgIHJ1bl9hbGwoJCQuYmVmb3JlX3VwZGF0ZSk7XG4gICAgICAgICQkLmZyYWdtZW50LnAoJCQuZGlydHksICQkLmN0eCk7XG4gICAgICAgICQkLmRpcnR5ID0gbnVsbDtcbiAgICAgICAgJCQuYWZ0ZXJfdXBkYXRlLmZvckVhY2goYWRkX3JlbmRlcl9jYWxsYmFjayk7XG4gICAgfVxufVxuXG5sZXQgcHJvbWlzZTtcbmZ1bmN0aW9uIHdhaXQoKSB7XG4gICAgaWYgKCFwcm9taXNlKSB7XG4gICAgICAgIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHByb21pc2UgPSBudWxsO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHByb21pc2U7XG59XG5mdW5jdGlvbiBkaXNwYXRjaChub2RlLCBkaXJlY3Rpb24sIGtpbmQpIHtcbiAgICBub2RlLmRpc3BhdGNoRXZlbnQoY3VzdG9tX2V2ZW50KGAke2RpcmVjdGlvbiA/ICdpbnRybycgOiAnb3V0cm8nfSR7a2luZH1gKSk7XG59XG5jb25zdCBvdXRyb2luZyA9IG5ldyBTZXQoKTtcbmxldCBvdXRyb3M7XG5mdW5jdGlvbiBncm91cF9vdXRyb3MoKSB7XG4gICAgb3V0cm9zID0ge1xuICAgICAgICByOiAwLFxuICAgICAgICBjOiBbXSxcbiAgICAgICAgcDogb3V0cm9zIC8vIHBhcmVudCBncm91cFxuICAgIH07XG59XG5mdW5jdGlvbiBjaGVja19vdXRyb3MoKSB7XG4gICAgaWYgKCFvdXRyb3Mucikge1xuICAgICAgICBydW5fYWxsKG91dHJvcy5jKTtcbiAgICB9XG4gICAgb3V0cm9zID0gb3V0cm9zLnA7XG59XG5mdW5jdGlvbiB0cmFuc2l0aW9uX2luKGJsb2NrLCBsb2NhbCkge1xuICAgIGlmIChibG9jayAmJiBibG9jay5pKSB7XG4gICAgICAgIG91dHJvaW5nLmRlbGV0ZShibG9jayk7XG4gICAgICAgIGJsb2NrLmkobG9jYWwpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHRyYW5zaXRpb25fb3V0KGJsb2NrLCBsb2NhbCwgZGV0YWNoLCBjYWxsYmFjaykge1xuICAgIGlmIChibG9jayAmJiBibG9jay5vKSB7XG4gICAgICAgIGlmIChvdXRyb2luZy5oYXMoYmxvY2spKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBvdXRyb2luZy5hZGQoYmxvY2spO1xuICAgICAgICBvdXRyb3MuYy5wdXNoKCgpID0+IHtcbiAgICAgICAgICAgIG91dHJvaW5nLmRlbGV0ZShibG9jayk7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBpZiAoZGV0YWNoKVxuICAgICAgICAgICAgICAgICAgICBibG9jay5kKDEpO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBibG9jay5vKGxvY2FsKTtcbiAgICB9XG59XG5jb25zdCBudWxsX3RyYW5zaXRpb24gPSB7IGR1cmF0aW9uOiAwIH07XG5mdW5jdGlvbiBjcmVhdGVfaW5fdHJhbnNpdGlvbihub2RlLCBmbiwgcGFyYW1zKSB7XG4gICAgbGV0IGNvbmZpZyA9IGZuKG5vZGUsIHBhcmFtcyk7XG4gICAgbGV0IHJ1bm5pbmcgPSBmYWxzZTtcbiAgICBsZXQgYW5pbWF0aW9uX25hbWU7XG4gICAgbGV0IHRhc2s7XG4gICAgbGV0IHVpZCA9IDA7XG4gICAgZnVuY3Rpb24gY2xlYW51cCgpIHtcbiAgICAgICAgaWYgKGFuaW1hdGlvbl9uYW1lKVxuICAgICAgICAgICAgZGVsZXRlX3J1bGUobm9kZSwgYW5pbWF0aW9uX25hbWUpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnbygpIHtcbiAgICAgICAgY29uc3QgeyBkZWxheSA9IDAsIGR1cmF0aW9uID0gMzAwLCBlYXNpbmcgPSBpZGVudGl0eSwgdGljayA9IG5vb3AsIGNzcyB9ID0gY29uZmlnIHx8IG51bGxfdHJhbnNpdGlvbjtcbiAgICAgICAgaWYgKGNzcylcbiAgICAgICAgICAgIGFuaW1hdGlvbl9uYW1lID0gY3JlYXRlX3J1bGUobm9kZSwgMCwgMSwgZHVyYXRpb24sIGRlbGF5LCBlYXNpbmcsIGNzcywgdWlkKyspO1xuICAgICAgICB0aWNrKDAsIDEpO1xuICAgICAgICBjb25zdCBzdGFydF90aW1lID0gbm93KCkgKyBkZWxheTtcbiAgICAgICAgY29uc3QgZW5kX3RpbWUgPSBzdGFydF90aW1lICsgZHVyYXRpb247XG4gICAgICAgIGlmICh0YXNrKVxuICAgICAgICAgICAgdGFzay5hYm9ydCgpO1xuICAgICAgICBydW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgYWRkX3JlbmRlcl9jYWxsYmFjaygoKSA9PiBkaXNwYXRjaChub2RlLCB0cnVlLCAnc3RhcnQnKSk7XG4gICAgICAgIHRhc2sgPSBsb29wKG5vdyA9PiB7XG4gICAgICAgICAgICBpZiAocnVubmluZykge1xuICAgICAgICAgICAgICAgIGlmIChub3cgPj0gZW5kX3RpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGljaygxLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2gobm9kZSwgdHJ1ZSwgJ2VuZCcpO1xuICAgICAgICAgICAgICAgICAgICBjbGVhbnVwKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBydW5uaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChub3cgPj0gc3RhcnRfdGltZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ID0gZWFzaW5nKChub3cgLSBzdGFydF90aW1lKSAvIGR1cmF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgdGljayh0LCAxIC0gdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJ1bm5pbmc7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBsZXQgc3RhcnRlZCA9IGZhbHNlO1xuICAgIHJldHVybiB7XG4gICAgICAgIHN0YXJ0KCkge1xuICAgICAgICAgICAgaWYgKHN0YXJ0ZWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgZGVsZXRlX3J1bGUobm9kZSk7XG4gICAgICAgICAgICBpZiAoaXNfZnVuY3Rpb24oY29uZmlnKSkge1xuICAgICAgICAgICAgICAgIGNvbmZpZyA9IGNvbmZpZygpO1xuICAgICAgICAgICAgICAgIHdhaXQoKS50aGVuKGdvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGdvKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGludmFsaWRhdGUoKSB7XG4gICAgICAgICAgICBzdGFydGVkID0gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIGVuZCgpIHtcbiAgICAgICAgICAgIGlmIChydW5uaW5nKSB7XG4gICAgICAgICAgICAgICAgY2xlYW51cCgpO1xuICAgICAgICAgICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59XG5mdW5jdGlvbiBjcmVhdGVfb3V0X3RyYW5zaXRpb24obm9kZSwgZm4sIHBhcmFtcykge1xuICAgIGxldCBjb25maWcgPSBmbihub2RlLCBwYXJhbXMpO1xuICAgIGxldCBydW5uaW5nID0gdHJ1ZTtcbiAgICBsZXQgYW5pbWF0aW9uX25hbWU7XG4gICAgY29uc3QgZ3JvdXAgPSBvdXRyb3M7XG4gICAgZ3JvdXAuciArPSAxO1xuICAgIGZ1bmN0aW9uIGdvKCkge1xuICAgICAgICBjb25zdCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSAzMDAsIGVhc2luZyA9IGlkZW50aXR5LCB0aWNrID0gbm9vcCwgY3NzIH0gPSBjb25maWcgfHwgbnVsbF90cmFuc2l0aW9uO1xuICAgICAgICBpZiAoY3NzKVxuICAgICAgICAgICAgYW5pbWF0aW9uX25hbWUgPSBjcmVhdGVfcnVsZShub2RlLCAxLCAwLCBkdXJhdGlvbiwgZGVsYXksIGVhc2luZywgY3NzKTtcbiAgICAgICAgY29uc3Qgc3RhcnRfdGltZSA9IG5vdygpICsgZGVsYXk7XG4gICAgICAgIGNvbnN0IGVuZF90aW1lID0gc3RhcnRfdGltZSArIGR1cmF0aW9uO1xuICAgICAgICBhZGRfcmVuZGVyX2NhbGxiYWNrKCgpID0+IGRpc3BhdGNoKG5vZGUsIGZhbHNlLCAnc3RhcnQnKSk7XG4gICAgICAgIGxvb3Aobm93ID0+IHtcbiAgICAgICAgICAgIGlmIChydW5uaW5nKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5vdyA+PSBlbmRfdGltZSkge1xuICAgICAgICAgICAgICAgICAgICB0aWNrKDAsIDEpO1xuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChub2RlLCBmYWxzZSwgJ2VuZCcpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIS0tZ3JvdXAucikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcyB3aWxsIHJlc3VsdCBpbiBgZW5kKClgIGJlaW5nIGNhbGxlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNvIHdlIGRvbid0IG5lZWQgdG8gY2xlYW4gdXAgaGVyZVxuICAgICAgICAgICAgICAgICAgICAgICAgcnVuX2FsbChncm91cC5jKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChub3cgPj0gc3RhcnRfdGltZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ID0gZWFzaW5nKChub3cgLSBzdGFydF90aW1lKSAvIGR1cmF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgdGljaygxIC0gdCwgdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJ1bm5pbmc7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoaXNfZnVuY3Rpb24oY29uZmlnKSkge1xuICAgICAgICB3YWl0KCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBjb25maWcgPSBjb25maWcoKTtcbiAgICAgICAgICAgIGdvKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZ28oKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZW5kKHJlc2V0KSB7XG4gICAgICAgICAgICBpZiAocmVzZXQgJiYgY29uZmlnLnRpY2spIHtcbiAgICAgICAgICAgICAgICBjb25maWcudGljaygxLCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChydW5uaW5nKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFuaW1hdGlvbl9uYW1lKVxuICAgICAgICAgICAgICAgICAgICBkZWxldGVfcnVsZShub2RlLCBhbmltYXRpb25fbmFtZSk7XG4gICAgICAgICAgICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZV9iaWRpcmVjdGlvbmFsX3RyYW5zaXRpb24obm9kZSwgZm4sIHBhcmFtcywgaW50cm8pIHtcbiAgICBsZXQgY29uZmlnID0gZm4obm9kZSwgcGFyYW1zKTtcbiAgICBsZXQgdCA9IGludHJvID8gMCA6IDE7XG4gICAgbGV0IHJ1bm5pbmdfcHJvZ3JhbSA9IG51bGw7XG4gICAgbGV0IHBlbmRpbmdfcHJvZ3JhbSA9IG51bGw7XG4gICAgbGV0IGFuaW1hdGlvbl9uYW1lID0gbnVsbDtcbiAgICBmdW5jdGlvbiBjbGVhcl9hbmltYXRpb24oKSB7XG4gICAgICAgIGlmIChhbmltYXRpb25fbmFtZSlcbiAgICAgICAgICAgIGRlbGV0ZV9ydWxlKG5vZGUsIGFuaW1hdGlvbl9uYW1lKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaW5pdChwcm9ncmFtLCBkdXJhdGlvbikge1xuICAgICAgICBjb25zdCBkID0gcHJvZ3JhbS5iIC0gdDtcbiAgICAgICAgZHVyYXRpb24gKj0gTWF0aC5hYnMoZCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhOiB0LFxuICAgICAgICAgICAgYjogcHJvZ3JhbS5iLFxuICAgICAgICAgICAgZCxcbiAgICAgICAgICAgIGR1cmF0aW9uLFxuICAgICAgICAgICAgc3RhcnQ6IHByb2dyYW0uc3RhcnQsXG4gICAgICAgICAgICBlbmQ6IHByb2dyYW0uc3RhcnQgKyBkdXJhdGlvbixcbiAgICAgICAgICAgIGdyb3VwOiBwcm9ncmFtLmdyb3VwXG4gICAgICAgIH07XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdvKGIpIHtcbiAgICAgICAgY29uc3QgeyBkZWxheSA9IDAsIGR1cmF0aW9uID0gMzAwLCBlYXNpbmcgPSBpZGVudGl0eSwgdGljayA9IG5vb3AsIGNzcyB9ID0gY29uZmlnIHx8IG51bGxfdHJhbnNpdGlvbjtcbiAgICAgICAgY29uc3QgcHJvZ3JhbSA9IHtcbiAgICAgICAgICAgIHN0YXJ0OiBub3coKSArIGRlbGF5LFxuICAgICAgICAgICAgYlxuICAgICAgICB9O1xuICAgICAgICBpZiAoIWIpIHtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmUgdG9kbzogaW1wcm92ZSB0eXBpbmdzXG4gICAgICAgICAgICBwcm9ncmFtLmdyb3VwID0gb3V0cm9zO1xuICAgICAgICAgICAgb3V0cm9zLnIgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocnVubmluZ19wcm9ncmFtKSB7XG4gICAgICAgICAgICBwZW5kaW5nX3Byb2dyYW0gPSBwcm9ncmFtO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gaWYgdGhpcyBpcyBhbiBpbnRybywgYW5kIHRoZXJlJ3MgYSBkZWxheSwgd2UgbmVlZCB0byBkb1xuICAgICAgICAgICAgLy8gYW4gaW5pdGlhbCB0aWNrIGFuZC9vciBhcHBseSBDU1MgYW5pbWF0aW9uIGltbWVkaWF0ZWx5XG4gICAgICAgICAgICBpZiAoY3NzKSB7XG4gICAgICAgICAgICAgICAgY2xlYXJfYW5pbWF0aW9uKCk7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uX25hbWUgPSBjcmVhdGVfcnVsZShub2RlLCB0LCBiLCBkdXJhdGlvbiwgZGVsYXksIGVhc2luZywgY3NzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChiKVxuICAgICAgICAgICAgICAgIHRpY2soMCwgMSk7XG4gICAgICAgICAgICBydW5uaW5nX3Byb2dyYW0gPSBpbml0KHByb2dyYW0sIGR1cmF0aW9uKTtcbiAgICAgICAgICAgIGFkZF9yZW5kZXJfY2FsbGJhY2soKCkgPT4gZGlzcGF0Y2gobm9kZSwgYiwgJ3N0YXJ0JykpO1xuICAgICAgICAgICAgbG9vcChub3cgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChwZW5kaW5nX3Byb2dyYW0gJiYgbm93ID4gcGVuZGluZ19wcm9ncmFtLnN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJ1bm5pbmdfcHJvZ3JhbSA9IGluaXQocGVuZGluZ19wcm9ncmFtLCBkdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIHBlbmRpbmdfcHJvZ3JhbSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKG5vZGUsIHJ1bm5pbmdfcHJvZ3JhbS5iLCAnc3RhcnQnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJfYW5pbWF0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb25fbmFtZSA9IGNyZWF0ZV9ydWxlKG5vZGUsIHQsIHJ1bm5pbmdfcHJvZ3JhbS5iLCBydW5uaW5nX3Byb2dyYW0uZHVyYXRpb24sIDAsIGVhc2luZywgY29uZmlnLmNzcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJ1bm5pbmdfcHJvZ3JhbSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobm93ID49IHJ1bm5pbmdfcHJvZ3JhbS5lbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpY2sodCA9IHJ1bm5pbmdfcHJvZ3JhbS5iLCAxIC0gdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChub2RlLCBydW5uaW5nX3Byb2dyYW0uYiwgJ2VuZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFwZW5kaW5nX3Byb2dyYW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3ZSdyZSBkb25lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJ1bm5pbmdfcHJvZ3JhbS5iKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGludHJvIOKAlCB3ZSBjYW4gdGlkeSB1cCBpbW1lZGlhdGVseVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhcl9hbmltYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG91dHJvIOKAlCBuZWVkcyB0byBiZSBjb29yZGluYXRlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIS0tcnVubmluZ19wcm9ncmFtLmdyb3VwLnIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBydW5fYWxsKHJ1bm5pbmdfcHJvZ3JhbS5ncm91cC5jKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBydW5uaW5nX3Byb2dyYW0gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKG5vdyA+PSBydW5uaW5nX3Byb2dyYW0uc3RhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHAgPSBub3cgLSBydW5uaW5nX3Byb2dyYW0uc3RhcnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ID0gcnVubmluZ19wcm9ncmFtLmEgKyBydW5uaW5nX3Byb2dyYW0uZCAqIGVhc2luZyhwIC8gcnVubmluZ19wcm9ncmFtLmR1cmF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpY2sodCwgMSAtIHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAhIShydW5uaW5nX3Byb2dyYW0gfHwgcGVuZGluZ19wcm9ncmFtKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIHJ1bihiKSB7XG4gICAgICAgICAgICBpZiAoaXNfZnVuY3Rpb24oY29uZmlnKSkge1xuICAgICAgICAgICAgICAgIHdhaXQoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICBjb25maWcgPSBjb25maWcoKTtcbiAgICAgICAgICAgICAgICAgICAgZ28oYik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBnbyhiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZW5kKCkge1xuICAgICAgICAgICAgY2xlYXJfYW5pbWF0aW9uKCk7XG4gICAgICAgICAgICBydW5uaW5nX3Byb2dyYW0gPSBwZW5kaW5nX3Byb2dyYW0gPSBudWxsO1xuICAgICAgICB9XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlX3Byb21pc2UocHJvbWlzZSwgaW5mbykge1xuICAgIGNvbnN0IHRva2VuID0gaW5mby50b2tlbiA9IHt9O1xuICAgIGZ1bmN0aW9uIHVwZGF0ZSh0eXBlLCBpbmRleCwga2V5LCB2YWx1ZSkge1xuICAgICAgICBpZiAoaW5mby50b2tlbiAhPT0gdG9rZW4pXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGluZm8ucmVzb2x2ZWQgPSBrZXkgJiYgeyBba2V5XTogdmFsdWUgfTtcbiAgICAgICAgY29uc3QgY2hpbGRfY3R4ID0gYXNzaWduKGFzc2lnbih7fSwgaW5mby5jdHgpLCBpbmZvLnJlc29sdmVkKTtcbiAgICAgICAgY29uc3QgYmxvY2sgPSB0eXBlICYmIChpbmZvLmN1cnJlbnQgPSB0eXBlKShjaGlsZF9jdHgpO1xuICAgICAgICBpZiAoaW5mby5ibG9jaykge1xuICAgICAgICAgICAgaWYgKGluZm8uYmxvY2tzKSB7XG4gICAgICAgICAgICAgICAgaW5mby5ibG9ja3MuZm9yRWFjaCgoYmxvY2ssIGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgIT09IGluZGV4ICYmIGJsb2NrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cF9vdXRyb3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb25fb3V0KGJsb2NrLCAxLCAxLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mby5ibG9ja3NbaV0gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja19vdXRyb3MoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaW5mby5ibG9jay5kKDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYmxvY2suYygpO1xuICAgICAgICAgICAgdHJhbnNpdGlvbl9pbihibG9jaywgMSk7XG4gICAgICAgICAgICBibG9jay5tKGluZm8ubW91bnQoKSwgaW5mby5hbmNob3IpO1xuICAgICAgICAgICAgZmx1c2goKTtcbiAgICAgICAgfVxuICAgICAgICBpbmZvLmJsb2NrID0gYmxvY2s7XG4gICAgICAgIGlmIChpbmZvLmJsb2NrcylcbiAgICAgICAgICAgIGluZm8uYmxvY2tzW2luZGV4XSA9IGJsb2NrO1xuICAgIH1cbiAgICBpZiAoaXNfcHJvbWlzZShwcm9taXNlKSkge1xuICAgICAgICBjb25zdCBjdXJyZW50X2NvbXBvbmVudCA9IGdldF9jdXJyZW50X2NvbXBvbmVudCgpO1xuICAgICAgICBwcm9taXNlLnRoZW4odmFsdWUgPT4ge1xuICAgICAgICAgICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KGN1cnJlbnRfY29tcG9uZW50KTtcbiAgICAgICAgICAgIHVwZGF0ZShpbmZvLnRoZW4sIDEsIGluZm8udmFsdWUsIHZhbHVlKTtcbiAgICAgICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChudWxsKTtcbiAgICAgICAgfSwgZXJyb3IgPT4ge1xuICAgICAgICAgICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KGN1cnJlbnRfY29tcG9uZW50KTtcbiAgICAgICAgICAgIHVwZGF0ZShpbmZvLmNhdGNoLCAyLCBpbmZvLmVycm9yLCBlcnJvcik7XG4gICAgICAgICAgICBzZXRfY3VycmVudF9jb21wb25lbnQobnVsbCk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBpZiB3ZSBwcmV2aW91c2x5IGhhZCBhIHRoZW4vY2F0Y2ggYmxvY2ssIGRlc3Ryb3kgaXRcbiAgICAgICAgaWYgKGluZm8uY3VycmVudCAhPT0gaW5mby5wZW5kaW5nKSB7XG4gICAgICAgICAgICB1cGRhdGUoaW5mby5wZW5kaW5nLCAwKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZiAoaW5mby5jdXJyZW50ICE9PSBpbmZvLnRoZW4pIHtcbiAgICAgICAgICAgIHVwZGF0ZShpbmZvLnRoZW4sIDEsIGluZm8udmFsdWUsIHByb21pc2UpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaW5mby5yZXNvbHZlZCA9IHsgW2luZm8udmFsdWVdOiBwcm9taXNlIH07XG4gICAgfVxufVxuXG5jb25zdCBnbG9iYWxzID0gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93IDogZ2xvYmFsKTtcblxuZnVuY3Rpb24gZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKSB7XG4gICAgYmxvY2suZCgxKTtcbiAgICBsb29rdXAuZGVsZXRlKGJsb2NrLmtleSk7XG59XG5mdW5jdGlvbiBvdXRyb19hbmRfZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKSB7XG4gICAgdHJhbnNpdGlvbl9vdXQoYmxvY2ssIDEsIDEsICgpID0+IHtcbiAgICAgICAgbG9va3VwLmRlbGV0ZShibG9jay5rZXkpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZml4X2FuZF9kZXN0cm95X2Jsb2NrKGJsb2NrLCBsb29rdXApIHtcbiAgICBibG9jay5mKCk7XG4gICAgZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKTtcbn1cbmZ1bmN0aW9uIGZpeF9hbmRfb3V0cm9fYW5kX2Rlc3Ryb3lfYmxvY2soYmxvY2ssIGxvb2t1cCkge1xuICAgIGJsb2NrLmYoKTtcbiAgICBvdXRyb19hbmRfZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZV9rZXllZF9lYWNoKG9sZF9ibG9ja3MsIGNoYW5nZWQsIGdldF9rZXksIGR5bmFtaWMsIGN0eCwgbGlzdCwgbG9va3VwLCBub2RlLCBkZXN0cm95LCBjcmVhdGVfZWFjaF9ibG9jaywgbmV4dCwgZ2V0X2NvbnRleHQpIHtcbiAgICBsZXQgbyA9IG9sZF9ibG9ja3MubGVuZ3RoO1xuICAgIGxldCBuID0gbGlzdC5sZW5ndGg7XG4gICAgbGV0IGkgPSBvO1xuICAgIGNvbnN0IG9sZF9pbmRleGVzID0ge307XG4gICAgd2hpbGUgKGktLSlcbiAgICAgICAgb2xkX2luZGV4ZXNbb2xkX2Jsb2Nrc1tpXS5rZXldID0gaTtcbiAgICBjb25zdCBuZXdfYmxvY2tzID0gW107XG4gICAgY29uc3QgbmV3X2xvb2t1cCA9IG5ldyBNYXAoKTtcbiAgICBjb25zdCBkZWx0YXMgPSBuZXcgTWFwKCk7XG4gICAgaSA9IG47XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgICBjb25zdCBjaGlsZF9jdHggPSBnZXRfY29udGV4dChjdHgsIGxpc3QsIGkpO1xuICAgICAgICBjb25zdCBrZXkgPSBnZXRfa2V5KGNoaWxkX2N0eCk7XG4gICAgICAgIGxldCBibG9jayA9IGxvb2t1cC5nZXQoa2V5KTtcbiAgICAgICAgaWYgKCFibG9jaykge1xuICAgICAgICAgICAgYmxvY2sgPSBjcmVhdGVfZWFjaF9ibG9jayhrZXksIGNoaWxkX2N0eCk7XG4gICAgICAgICAgICBibG9jay5jKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZHluYW1pYykge1xuICAgICAgICAgICAgYmxvY2sucChjaGFuZ2VkLCBjaGlsZF9jdHgpO1xuICAgICAgICB9XG4gICAgICAgIG5ld19sb29rdXAuc2V0KGtleSwgbmV3X2Jsb2Nrc1tpXSA9IGJsb2NrKTtcbiAgICAgICAgaWYgKGtleSBpbiBvbGRfaW5kZXhlcylcbiAgICAgICAgICAgIGRlbHRhcy5zZXQoa2V5LCBNYXRoLmFicyhpIC0gb2xkX2luZGV4ZXNba2V5XSkpO1xuICAgIH1cbiAgICBjb25zdCB3aWxsX21vdmUgPSBuZXcgU2V0KCk7XG4gICAgY29uc3QgZGlkX21vdmUgPSBuZXcgU2V0KCk7XG4gICAgZnVuY3Rpb24gaW5zZXJ0KGJsb2NrKSB7XG4gICAgICAgIHRyYW5zaXRpb25faW4oYmxvY2ssIDEpO1xuICAgICAgICBibG9jay5tKG5vZGUsIG5leHQpO1xuICAgICAgICBsb29rdXAuc2V0KGJsb2NrLmtleSwgYmxvY2spO1xuICAgICAgICBuZXh0ID0gYmxvY2suZmlyc3Q7XG4gICAgICAgIG4tLTtcbiAgICB9XG4gICAgd2hpbGUgKG8gJiYgbikge1xuICAgICAgICBjb25zdCBuZXdfYmxvY2sgPSBuZXdfYmxvY2tzW24gLSAxXTtcbiAgICAgICAgY29uc3Qgb2xkX2Jsb2NrID0gb2xkX2Jsb2Nrc1tvIC0gMV07XG4gICAgICAgIGNvbnN0IG5ld19rZXkgPSBuZXdfYmxvY2sua2V5O1xuICAgICAgICBjb25zdCBvbGRfa2V5ID0gb2xkX2Jsb2NrLmtleTtcbiAgICAgICAgaWYgKG5ld19ibG9jayA9PT0gb2xkX2Jsb2NrKSB7XG4gICAgICAgICAgICAvLyBkbyBub3RoaW5nXG4gICAgICAgICAgICBuZXh0ID0gbmV3X2Jsb2NrLmZpcnN0O1xuICAgICAgICAgICAgby0tO1xuICAgICAgICAgICAgbi0tO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCFuZXdfbG9va3VwLmhhcyhvbGRfa2V5KSkge1xuICAgICAgICAgICAgLy8gcmVtb3ZlIG9sZCBibG9ja1xuICAgICAgICAgICAgZGVzdHJveShvbGRfYmxvY2ssIGxvb2t1cCk7XG4gICAgICAgICAgICBvLS07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIWxvb2t1cC5oYXMobmV3X2tleSkgfHwgd2lsbF9tb3ZlLmhhcyhuZXdfa2V5KSkge1xuICAgICAgICAgICAgaW5zZXJ0KG5ld19ibG9jayk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGlkX21vdmUuaGFzKG9sZF9rZXkpKSB7XG4gICAgICAgICAgICBvLS07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGVsdGFzLmdldChuZXdfa2V5KSA+IGRlbHRhcy5nZXQob2xkX2tleSkpIHtcbiAgICAgICAgICAgIGRpZF9tb3ZlLmFkZChuZXdfa2V5KTtcbiAgICAgICAgICAgIGluc2VydChuZXdfYmxvY2spO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgd2lsbF9tb3ZlLmFkZChvbGRfa2V5KTtcbiAgICAgICAgICAgIG8tLTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB3aGlsZSAoby0tKSB7XG4gICAgICAgIGNvbnN0IG9sZF9ibG9jayA9IG9sZF9ibG9ja3Nbb107XG4gICAgICAgIGlmICghbmV3X2xvb2t1cC5oYXMob2xkX2Jsb2NrLmtleSkpXG4gICAgICAgICAgICBkZXN0cm95KG9sZF9ibG9jaywgbG9va3VwKTtcbiAgICB9XG4gICAgd2hpbGUgKG4pXG4gICAgICAgIGluc2VydChuZXdfYmxvY2tzW24gLSAxXSk7XG4gICAgcmV0dXJuIG5ld19ibG9ja3M7XG59XG5mdW5jdGlvbiBtZWFzdXJlKGJsb2Nrcykge1xuICAgIGNvbnN0IHJlY3RzID0ge307XG4gICAgbGV0IGkgPSBibG9ja3MubGVuZ3RoO1xuICAgIHdoaWxlIChpLS0pXG4gICAgICAgIHJlY3RzW2Jsb2Nrc1tpXS5rZXldID0gYmxvY2tzW2ldLm5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgcmV0dXJuIHJlY3RzO1xufVxuXG5mdW5jdGlvbiBnZXRfc3ByZWFkX3VwZGF0ZShsZXZlbHMsIHVwZGF0ZXMpIHtcbiAgICBjb25zdCB1cGRhdGUgPSB7fTtcbiAgICBjb25zdCB0b19udWxsX291dCA9IHt9O1xuICAgIGNvbnN0IGFjY291bnRlZF9mb3IgPSB7ICQkc2NvcGU6IDEgfTtcbiAgICBsZXQgaSA9IGxldmVscy5sZW5ndGg7XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgICBjb25zdCBvID0gbGV2ZWxzW2ldO1xuICAgICAgICBjb25zdCBuID0gdXBkYXRlc1tpXTtcbiAgICAgICAgaWYgKG4pIHtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIG8pIHtcbiAgICAgICAgICAgICAgICBpZiAoIShrZXkgaW4gbikpXG4gICAgICAgICAgICAgICAgICAgIHRvX251bGxfb3V0W2tleV0gPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gbikge1xuICAgICAgICAgICAgICAgIGlmICghYWNjb3VudGVkX2ZvcltrZXldKSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVtrZXldID0gbltrZXldO1xuICAgICAgICAgICAgICAgICAgICBhY2NvdW50ZWRfZm9yW2tleV0gPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldmVsc1tpXSA9IG47XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBvKSB7XG4gICAgICAgICAgICAgICAgYWNjb3VudGVkX2ZvcltrZXldID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IGtleSBpbiB0b19udWxsX291dCkge1xuICAgICAgICBpZiAoIShrZXkgaW4gdXBkYXRlKSlcbiAgICAgICAgICAgIHVwZGF0ZVtrZXldID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gdXBkYXRlO1xufVxuZnVuY3Rpb24gZ2V0X3NwcmVhZF9vYmplY3Qoc3ByZWFkX3Byb3BzKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBzcHJlYWRfcHJvcHMgPT09ICdvYmplY3QnICYmIHNwcmVhZF9wcm9wcyAhPT0gbnVsbCA/IHNwcmVhZF9wcm9wcyA6IHt9O1xufVxuXG5jb25zdCBpbnZhbGlkX2F0dHJpYnV0ZV9uYW1lX2NoYXJhY3RlciA9IC9bXFxzJ1wiPi89XFx1e0ZERDB9LVxcdXtGREVGfVxcdXtGRkZFfVxcdXtGRkZGfVxcdXsxRkZGRX1cXHV7MUZGRkZ9XFx1ezJGRkZFfVxcdXsyRkZGRn1cXHV7M0ZGRkV9XFx1ezNGRkZGfVxcdXs0RkZGRX1cXHV7NEZGRkZ9XFx1ezVGRkZFfVxcdXs1RkZGRn1cXHV7NkZGRkV9XFx1ezZGRkZGfVxcdXs3RkZGRX1cXHV7N0ZGRkZ9XFx1ezhGRkZFfVxcdXs4RkZGRn1cXHV7OUZGRkV9XFx1ezlGRkZGfVxcdXtBRkZGRX1cXHV7QUZGRkZ9XFx1e0JGRkZFfVxcdXtCRkZGRn1cXHV7Q0ZGRkV9XFx1e0NGRkZGfVxcdXtERkZGRX1cXHV7REZGRkZ9XFx1e0VGRkZFfVxcdXtFRkZGRn1cXHV7RkZGRkV9XFx1e0ZGRkZGfVxcdXsxMEZGRkV9XFx1ezEwRkZGRn1dL3U7XG4vLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9zeW50YXguaHRtbCNhdHRyaWJ1dGVzLTJcbi8vIGh0dHBzOi8vaW5mcmEuc3BlYy53aGF0d2cub3JnLyNub25jaGFyYWN0ZXJcbmZ1bmN0aW9uIHNwcmVhZChhcmdzKSB7XG4gICAgY29uc3QgYXR0cmlidXRlcyA9IE9iamVjdC5hc3NpZ24oe30sIC4uLmFyZ3MpO1xuICAgIGxldCBzdHIgPSAnJztcbiAgICBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgICBpZiAoaW52YWxpZF9hdHRyaWJ1dGVfbmFtZV9jaGFyYWN0ZXIudGVzdChuYW1lKSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBhdHRyaWJ1dGVzW25hbWVdO1xuICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaWYgKHZhbHVlID09PSB0cnVlKVxuICAgICAgICAgICAgc3RyICs9IFwiIFwiICsgbmFtZTtcbiAgICAgICAgY29uc3QgZXNjYXBlZCA9IFN0cmluZyh2YWx1ZSlcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cIi9nLCAnJiMzNDsnKVxuICAgICAgICAgICAgLnJlcGxhY2UoLycvZywgJyYjMzk7Jyk7XG4gICAgICAgIHN0ciArPSBcIiBcIiArIG5hbWUgKyBcIj1cIiArIEpTT04uc3RyaW5naWZ5KGVzY2FwZWQpO1xuICAgIH0pO1xuICAgIHJldHVybiBzdHI7XG59XG5jb25zdCBlc2NhcGVkID0ge1xuICAgICdcIic6ICcmcXVvdDsnLFxuICAgIFwiJ1wiOiAnJiMzOTsnLFxuICAgICcmJzogJyZhbXA7JyxcbiAgICAnPCc6ICcmbHQ7JyxcbiAgICAnPic6ICcmZ3Q7J1xufTtcbmZ1bmN0aW9uIGVzY2FwZShodG1sKSB7XG4gICAgcmV0dXJuIFN0cmluZyhodG1sKS5yZXBsYWNlKC9bXCInJjw+XS9nLCBtYXRjaCA9PiBlc2NhcGVkW21hdGNoXSk7XG59XG5mdW5jdGlvbiBlYWNoKGl0ZW1zLCBmbikge1xuICAgIGxldCBzdHIgPSAnJztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIHN0ciArPSBmbihpdGVtc1tpXSwgaSk7XG4gICAgfVxuICAgIHJldHVybiBzdHI7XG59XG5jb25zdCBtaXNzaW5nX2NvbXBvbmVudCA9IHtcbiAgICAkJHJlbmRlcjogKCkgPT4gJydcbn07XG5mdW5jdGlvbiB2YWxpZGF0ZV9jb21wb25lbnQoY29tcG9uZW50LCBuYW1lKSB7XG4gICAgaWYgKCFjb21wb25lbnQgfHwgIWNvbXBvbmVudC4kJHJlbmRlcikge1xuICAgICAgICBpZiAobmFtZSA9PT0gJ3N2ZWx0ZTpjb21wb25lbnQnKVxuICAgICAgICAgICAgbmFtZSArPSAnIHRoaXM9ey4uLn0nO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYDwke25hbWV9PiBpcyBub3QgYSB2YWxpZCBTU1IgY29tcG9uZW50LiBZb3UgbWF5IG5lZWQgdG8gcmV2aWV3IHlvdXIgYnVpbGQgY29uZmlnIHRvIGVuc3VyZSB0aGF0IGRlcGVuZGVuY2llcyBhcmUgY29tcGlsZWQsIHJhdGhlciB0aGFuIGltcG9ydGVkIGFzIHByZS1jb21waWxlZCBtb2R1bGVzYCk7XG4gICAgfVxuICAgIHJldHVybiBjb21wb25lbnQ7XG59XG5mdW5jdGlvbiBkZWJ1ZyhmaWxlLCBsaW5lLCBjb2x1bW4sIHZhbHVlcykge1xuICAgIGNvbnNvbGUubG9nKGB7QGRlYnVnfSAke2ZpbGUgPyBmaWxlICsgJyAnIDogJyd9KCR7bGluZX06JHtjb2x1bW59KWApOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICBjb25zb2xlLmxvZyh2YWx1ZXMpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICByZXR1cm4gJyc7XG59XG5sZXQgb25fZGVzdHJveTtcbmZ1bmN0aW9uIGNyZWF0ZV9zc3JfY29tcG9uZW50KGZuKSB7XG4gICAgZnVuY3Rpb24gJCRyZW5kZXIocmVzdWx0LCBwcm9wcywgYmluZGluZ3MsIHNsb3RzKSB7XG4gICAgICAgIGNvbnN0IHBhcmVudF9jb21wb25lbnQgPSBjdXJyZW50X2NvbXBvbmVudDtcbiAgICAgICAgY29uc3QgJCQgPSB7XG4gICAgICAgICAgICBvbl9kZXN0cm95LFxuICAgICAgICAgICAgY29udGV4dDogbmV3IE1hcChwYXJlbnRfY29tcG9uZW50ID8gcGFyZW50X2NvbXBvbmVudC4kJC5jb250ZXh0IDogW10pLFxuICAgICAgICAgICAgLy8gdGhlc2Ugd2lsbCBiZSBpbW1lZGlhdGVseSBkaXNjYXJkZWRcbiAgICAgICAgICAgIG9uX21vdW50OiBbXSxcbiAgICAgICAgICAgIGJlZm9yZV91cGRhdGU6IFtdLFxuICAgICAgICAgICAgYWZ0ZXJfdXBkYXRlOiBbXSxcbiAgICAgICAgICAgIGNhbGxiYWNrczogYmxhbmtfb2JqZWN0KClcbiAgICAgICAgfTtcbiAgICAgICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KHsgJCQgfSk7XG4gICAgICAgIGNvbnN0IGh0bWwgPSBmbihyZXN1bHQsIHByb3BzLCBiaW5kaW5ncywgc2xvdHMpO1xuICAgICAgICBzZXRfY3VycmVudF9jb21wb25lbnQocGFyZW50X2NvbXBvbmVudCk7XG4gICAgICAgIHJldHVybiBodG1sO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICByZW5kZXI6IChwcm9wcyA9IHt9LCBvcHRpb25zID0ge30pID0+IHtcbiAgICAgICAgICAgIG9uX2Rlc3Ryb3kgPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHsgaGVhZDogJycsIGNzczogbmV3IFNldCgpIH07XG4gICAgICAgICAgICBjb25zdCBodG1sID0gJCRyZW5kZXIocmVzdWx0LCBwcm9wcywge30sIG9wdGlvbnMpO1xuICAgICAgICAgICAgcnVuX2FsbChvbl9kZXN0cm95KTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgaHRtbCxcbiAgICAgICAgICAgICAgICBjc3M6IHtcbiAgICAgICAgICAgICAgICAgICAgY29kZTogQXJyYXkuZnJvbShyZXN1bHQuY3NzKS5tYXAoY3NzID0+IGNzcy5jb2RlKS5qb2luKCdcXG4nKSxcbiAgICAgICAgICAgICAgICAgICAgbWFwOiBudWxsIC8vIFRPRE9cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGhlYWQ6IHJlc3VsdC5oZWFkXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgICAgICAkJHJlbmRlclxuICAgIH07XG59XG5mdW5jdGlvbiBhZGRfYXR0cmlidXRlKG5hbWUsIHZhbHVlLCBib29sZWFuKSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwgfHwgKGJvb2xlYW4gJiYgIXZhbHVlKSlcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIHJldHVybiBgICR7bmFtZX0ke3ZhbHVlID09PSB0cnVlID8gJycgOiBgPSR7dHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyA/IEpTT04uc3RyaW5naWZ5KGVzY2FwZSh2YWx1ZSkpIDogYFwiJHt2YWx1ZX1cImB9YH1gO1xufVxuZnVuY3Rpb24gYWRkX2NsYXNzZXMoY2xhc3Nlcykge1xuICAgIHJldHVybiBjbGFzc2VzID8gYCBjbGFzcz1cIiR7Y2xhc3Nlc31cImAgOiBgYDtcbn1cblxuZnVuY3Rpb24gYmluZChjb21wb25lbnQsIG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgaWYgKGNvbXBvbmVudC4kJC5wcm9wcy5pbmRleE9mKG5hbWUpID09PSAtMSlcbiAgICAgICAgcmV0dXJuO1xuICAgIGNvbXBvbmVudC4kJC5ib3VuZFtuYW1lXSA9IGNhbGxiYWNrO1xuICAgIGNhbGxiYWNrKGNvbXBvbmVudC4kJC5jdHhbbmFtZV0pO1xufVxuZnVuY3Rpb24gbW91bnRfY29tcG9uZW50KGNvbXBvbmVudCwgdGFyZ2V0LCBhbmNob3IpIHtcbiAgICBjb25zdCB7IGZyYWdtZW50LCBvbl9tb3VudCwgb25fZGVzdHJveSwgYWZ0ZXJfdXBkYXRlIH0gPSBjb21wb25lbnQuJCQ7XG4gICAgZnJhZ21lbnQubSh0YXJnZXQsIGFuY2hvcik7XG4gICAgLy8gb25Nb3VudCBoYXBwZW5zIGJlZm9yZSB0aGUgaW5pdGlhbCBhZnRlclVwZGF0ZVxuICAgIGFkZF9yZW5kZXJfY2FsbGJhY2soKCkgPT4ge1xuICAgICAgICBjb25zdCBuZXdfb25fZGVzdHJveSA9IG9uX21vdW50Lm1hcChydW4pLmZpbHRlcihpc19mdW5jdGlvbik7XG4gICAgICAgIGlmIChvbl9kZXN0cm95KSB7XG4gICAgICAgICAgICBvbl9kZXN0cm95LnB1c2goLi4ubmV3X29uX2Rlc3Ryb3kpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gRWRnZSBjYXNlIC0gY29tcG9uZW50IHdhcyBkZXN0cm95ZWQgaW1tZWRpYXRlbHksXG4gICAgICAgICAgICAvLyBtb3N0IGxpa2VseSBhcyBhIHJlc3VsdCBvZiBhIGJpbmRpbmcgaW5pdGlhbGlzaW5nXG4gICAgICAgICAgICBydW5fYWxsKG5ld19vbl9kZXN0cm95KTtcbiAgICAgICAgfVxuICAgICAgICBjb21wb25lbnQuJCQub25fbW91bnQgPSBbXTtcbiAgICB9KTtcbiAgICBhZnRlcl91cGRhdGUuZm9yRWFjaChhZGRfcmVuZGVyX2NhbGxiYWNrKTtcbn1cbmZ1bmN0aW9uIGRlc3Ryb3lfY29tcG9uZW50KGNvbXBvbmVudCwgZGV0YWNoaW5nKSB7XG4gICAgaWYgKGNvbXBvbmVudC4kJC5mcmFnbWVudCkge1xuICAgICAgICBydW5fYWxsKGNvbXBvbmVudC4kJC5vbl9kZXN0cm95KTtcbiAgICAgICAgY29tcG9uZW50LiQkLmZyYWdtZW50LmQoZGV0YWNoaW5nKTtcbiAgICAgICAgLy8gVE9ETyBudWxsIG91dCBvdGhlciByZWZzLCBpbmNsdWRpbmcgY29tcG9uZW50LiQkIChidXQgbmVlZCB0b1xuICAgICAgICAvLyBwcmVzZXJ2ZSBmaW5hbCBzdGF0ZT8pXG4gICAgICAgIGNvbXBvbmVudC4kJC5vbl9kZXN0cm95ID0gY29tcG9uZW50LiQkLmZyYWdtZW50ID0gbnVsbDtcbiAgICAgICAgY29tcG9uZW50LiQkLmN0eCA9IHt9O1xuICAgIH1cbn1cbmZ1bmN0aW9uIG1ha2VfZGlydHkoY29tcG9uZW50LCBrZXkpIHtcbiAgICBpZiAoIWNvbXBvbmVudC4kJC5kaXJ0eSkge1xuICAgICAgICBkaXJ0eV9jb21wb25lbnRzLnB1c2goY29tcG9uZW50KTtcbiAgICAgICAgc2NoZWR1bGVfdXBkYXRlKCk7XG4gICAgICAgIGNvbXBvbmVudC4kJC5kaXJ0eSA9IGJsYW5rX29iamVjdCgpO1xuICAgIH1cbiAgICBjb21wb25lbnQuJCQuZGlydHlba2V5XSA9IHRydWU7XG59XG5mdW5jdGlvbiBpbml0KGNvbXBvbmVudCwgb3B0aW9ucywgaW5zdGFuY2UsIGNyZWF0ZV9mcmFnbWVudCwgbm90X2VxdWFsLCBwcm9wX25hbWVzKSB7XG4gICAgY29uc3QgcGFyZW50X2NvbXBvbmVudCA9IGN1cnJlbnRfY29tcG9uZW50O1xuICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChjb21wb25lbnQpO1xuICAgIGNvbnN0IHByb3BzID0gb3B0aW9ucy5wcm9wcyB8fCB7fTtcbiAgICBjb25zdCAkJCA9IGNvbXBvbmVudC4kJCA9IHtcbiAgICAgICAgZnJhZ21lbnQ6IG51bGwsXG4gICAgICAgIGN0eDogbnVsbCxcbiAgICAgICAgLy8gc3RhdGVcbiAgICAgICAgcHJvcHM6IHByb3BfbmFtZXMsXG4gICAgICAgIHVwZGF0ZTogbm9vcCxcbiAgICAgICAgbm90X2VxdWFsLFxuICAgICAgICBib3VuZDogYmxhbmtfb2JqZWN0KCksXG4gICAgICAgIC8vIGxpZmVjeWNsZVxuICAgICAgICBvbl9tb3VudDogW10sXG4gICAgICAgIG9uX2Rlc3Ryb3k6IFtdLFxuICAgICAgICBiZWZvcmVfdXBkYXRlOiBbXSxcbiAgICAgICAgYWZ0ZXJfdXBkYXRlOiBbXSxcbiAgICAgICAgY29udGV4dDogbmV3IE1hcChwYXJlbnRfY29tcG9uZW50ID8gcGFyZW50X2NvbXBvbmVudC4kJC5jb250ZXh0IDogW10pLFxuICAgICAgICAvLyBldmVyeXRoaW5nIGVsc2VcbiAgICAgICAgY2FsbGJhY2tzOiBibGFua19vYmplY3QoKSxcbiAgICAgICAgZGlydHk6IG51bGxcbiAgICB9O1xuICAgIGxldCByZWFkeSA9IGZhbHNlO1xuICAgICQkLmN0eCA9IGluc3RhbmNlXG4gICAgICAgID8gaW5zdGFuY2UoY29tcG9uZW50LCBwcm9wcywgKGtleSwgcmV0LCB2YWx1ZSA9IHJldCkgPT4ge1xuICAgICAgICAgICAgaWYgKCQkLmN0eCAmJiBub3RfZXF1YWwoJCQuY3R4W2tleV0sICQkLmN0eFtrZXldID0gdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQkLmJvdW5kW2tleV0pXG4gICAgICAgICAgICAgICAgICAgICQkLmJvdW5kW2tleV0odmFsdWUpO1xuICAgICAgICAgICAgICAgIGlmIChyZWFkeSlcbiAgICAgICAgICAgICAgICAgICAgbWFrZV9kaXJ0eShjb21wb25lbnQsIGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9KVxuICAgICAgICA6IHByb3BzO1xuICAgICQkLnVwZGF0ZSgpO1xuICAgIHJlYWR5ID0gdHJ1ZTtcbiAgICBydW5fYWxsKCQkLmJlZm9yZV91cGRhdGUpO1xuICAgICQkLmZyYWdtZW50ID0gY3JlYXRlX2ZyYWdtZW50KCQkLmN0eCk7XG4gICAgaWYgKG9wdGlvbnMudGFyZ2V0KSB7XG4gICAgICAgIGlmIChvcHRpb25zLmh5ZHJhdGUpIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uXG4gICAgICAgICAgICAkJC5mcmFnbWVudC5sKGNoaWxkcmVuKG9wdGlvbnMudGFyZ2V0KSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLW5vbi1udWxsLWFzc2VydGlvblxuICAgICAgICAgICAgJCQuZnJhZ21lbnQuYygpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLmludHJvKVxuICAgICAgICAgICAgdHJhbnNpdGlvbl9pbihjb21wb25lbnQuJCQuZnJhZ21lbnQpO1xuICAgICAgICBtb3VudF9jb21wb25lbnQoY29tcG9uZW50LCBvcHRpb25zLnRhcmdldCwgb3B0aW9ucy5hbmNob3IpO1xuICAgICAgICBmbHVzaCgpO1xuICAgIH1cbiAgICBzZXRfY3VycmVudF9jb21wb25lbnQocGFyZW50X2NvbXBvbmVudCk7XG59XG5sZXQgU3ZlbHRlRWxlbWVudDtcbmlmICh0eXBlb2YgSFRNTEVsZW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgU3ZlbHRlRWxlbWVudCA9IGNsYXNzIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgICAgICB0aGlzLmF0dGFjaFNoYWRvdyh7IG1vZGU6ICdvcGVuJyB9KTtcbiAgICAgICAgfVxuICAgICAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmUgdG9kbzogaW1wcm92ZSB0eXBpbmdzXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLiQkLnNsb3R0ZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlIHRvZG86IGltcHJvdmUgdHlwaW5nc1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQodGhpcy4kJC5zbG90dGVkW2tleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhhdHRyLCBfb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzW2F0dHJdID0gbmV3VmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgJGRlc3Ryb3koKSB7XG4gICAgICAgICAgICBkZXN0cm95X2NvbXBvbmVudCh0aGlzLCAxKTtcbiAgICAgICAgICAgIHRoaXMuJGRlc3Ryb3kgPSBub29wO1xuICAgICAgICB9XG4gICAgICAgICRvbih0eXBlLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgLy8gVE9ETyBzaG91bGQgdGhpcyBkZWxlZ2F0ZSB0byBhZGRFdmVudExpc3RlbmVyP1xuICAgICAgICAgICAgY29uc3QgY2FsbGJhY2tzID0gKHRoaXMuJCQuY2FsbGJhY2tzW3R5cGVdIHx8ICh0aGlzLiQkLmNhbGxiYWNrc1t0eXBlXSA9IFtdKSk7XG4gICAgICAgICAgICBjYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gY2FsbGJhY2tzLmluZGV4T2YoY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICAkc2V0KCkge1xuICAgICAgICAgICAgLy8gb3ZlcnJpZGRlbiBieSBpbnN0YW5jZSwgaWYgaXQgaGFzIHByb3BzXG4gICAgICAgIH1cbiAgICB9O1xufVxuY2xhc3MgU3ZlbHRlQ29tcG9uZW50IHtcbiAgICAkZGVzdHJveSgpIHtcbiAgICAgICAgZGVzdHJveV9jb21wb25lbnQodGhpcywgMSk7XG4gICAgICAgIHRoaXMuJGRlc3Ryb3kgPSBub29wO1xuICAgIH1cbiAgICAkb24odHlwZSwgY2FsbGJhY2spIHtcbiAgICAgICAgY29uc3QgY2FsbGJhY2tzID0gKHRoaXMuJCQuY2FsbGJhY2tzW3R5cGVdIHx8ICh0aGlzLiQkLmNhbGxiYWNrc1t0eXBlXSA9IFtdKSk7XG4gICAgICAgIGNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gY2FsbGJhY2tzLmluZGV4T2YoY2FsbGJhY2spO1xuICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSlcbiAgICAgICAgICAgICAgICBjYWxsYmFja3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgJHNldCgpIHtcbiAgICAgICAgLy8gb3ZlcnJpZGRlbiBieSBpbnN0YW5jZSwgaWYgaXQgaGFzIHByb3BzXG4gICAgfVxufVxuXG5mdW5jdGlvbiBkaXNwYXRjaF9kZXYodHlwZSwgZGV0YWlsKSB7XG4gICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChjdXN0b21fZXZlbnQodHlwZSwgZGV0YWlsKSk7XG59XG5mdW5jdGlvbiBhcHBlbmRfZGV2KHRhcmdldCwgbm9kZSkge1xuICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTUluc2VydFwiLCB7IHRhcmdldCwgbm9kZSB9KTtcbiAgICBhcHBlbmQodGFyZ2V0LCBub2RlKTtcbn1cbmZ1bmN0aW9uIGluc2VydF9kZXYodGFyZ2V0LCBub2RlLCBhbmNob3IpIHtcbiAgICBkaXNwYXRjaF9kZXYoXCJTdmVsdGVET01JbnNlcnRcIiwgeyB0YXJnZXQsIG5vZGUsIGFuY2hvciB9KTtcbiAgICBpbnNlcnQodGFyZ2V0LCBub2RlLCBhbmNob3IpO1xufVxuZnVuY3Rpb24gZGV0YWNoX2Rldihub2RlKSB7XG4gICAgZGlzcGF0Y2hfZGV2KFwiU3ZlbHRlRE9NUmVtb3ZlXCIsIHsgbm9kZSB9KTtcbiAgICBkZXRhY2gobm9kZSk7XG59XG5mdW5jdGlvbiBkZXRhY2hfYmV0d2Vlbl9kZXYoYmVmb3JlLCBhZnRlcikge1xuICAgIHdoaWxlIChiZWZvcmUubmV4dFNpYmxpbmcgJiYgYmVmb3JlLm5leHRTaWJsaW5nICE9PSBhZnRlcikge1xuICAgICAgICBkZXRhY2hfZGV2KGJlZm9yZS5uZXh0U2libGluZyk7XG4gICAgfVxufVxuZnVuY3Rpb24gZGV0YWNoX2JlZm9yZV9kZXYoYWZ0ZXIpIHtcbiAgICB3aGlsZSAoYWZ0ZXIucHJldmlvdXNTaWJsaW5nKSB7XG4gICAgICAgIGRldGFjaF9kZXYoYWZ0ZXIucHJldmlvdXNTaWJsaW5nKTtcbiAgICB9XG59XG5mdW5jdGlvbiBkZXRhY2hfYWZ0ZXJfZGV2KGJlZm9yZSkge1xuICAgIHdoaWxlIChiZWZvcmUubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgZGV0YWNoX2RldihiZWZvcmUubmV4dFNpYmxpbmcpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGxpc3Rlbl9kZXYobm9kZSwgZXZlbnQsIGhhbmRsZXIsIG9wdGlvbnMsIGhhc19wcmV2ZW50X2RlZmF1bHQsIGhhc19zdG9wX3Byb3BhZ2F0aW9uKSB7XG4gICAgY29uc3QgbW9kaWZpZXJzID0gb3B0aW9ucyA9PT0gdHJ1ZSA/IFtcImNhcHR1cmVcIl0gOiBvcHRpb25zID8gQXJyYXkuZnJvbShPYmplY3Qua2V5cyhvcHRpb25zKSkgOiBbXTtcbiAgICBpZiAoaGFzX3ByZXZlbnRfZGVmYXVsdClcbiAgICAgICAgbW9kaWZpZXJzLnB1c2goJ3ByZXZlbnREZWZhdWx0Jyk7XG4gICAgaWYgKGhhc19zdG9wX3Byb3BhZ2F0aW9uKVxuICAgICAgICBtb2RpZmllcnMucHVzaCgnc3RvcFByb3BhZ2F0aW9uJyk7XG4gICAgZGlzcGF0Y2hfZGV2KFwiU3ZlbHRlRE9NQWRkRXZlbnRMaXN0ZW5lclwiLCB7IG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBtb2RpZmllcnMgfSk7XG4gICAgY29uc3QgZGlzcG9zZSA9IGxpc3Rlbihub2RlLCBldmVudCwgaGFuZGxlciwgb3B0aW9ucyk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgZGlzcGF0Y2hfZGV2KFwiU3ZlbHRlRE9NUmVtb3ZlRXZlbnRMaXN0ZW5lclwiLCB7IG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBtb2RpZmllcnMgfSk7XG4gICAgICAgIGRpc3Bvc2UoKTtcbiAgICB9O1xufVxuZnVuY3Rpb24gYXR0cl9kZXYobm9kZSwgYXR0cmlidXRlLCB2YWx1ZSkge1xuICAgIGF0dHIobm9kZSwgYXR0cmlidXRlLCB2YWx1ZSk7XG4gICAgaWYgKHZhbHVlID09IG51bGwpXG4gICAgICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTVJlbW92ZUF0dHJpYnV0ZVwiLCB7IG5vZGUsIGF0dHJpYnV0ZSB9KTtcbiAgICBlbHNlXG4gICAgICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTVNldEF0dHJpYnV0ZVwiLCB7IG5vZGUsIGF0dHJpYnV0ZSwgdmFsdWUgfSk7XG59XG5mdW5jdGlvbiBwcm9wX2Rldihub2RlLCBwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgICBub2RlW3Byb3BlcnR5XSA9IHZhbHVlO1xuICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTVNldFByb3BlcnR5XCIsIHsgbm9kZSwgcHJvcGVydHksIHZhbHVlIH0pO1xufVxuZnVuY3Rpb24gZGF0YXNldF9kZXYobm9kZSwgcHJvcGVydHksIHZhbHVlKSB7XG4gICAgbm9kZS5kYXRhc2V0W3Byb3BlcnR5XSA9IHZhbHVlO1xuICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTVNldERhdGFzZXRcIiwgeyBub2RlLCBwcm9wZXJ0eSwgdmFsdWUgfSk7XG59XG5mdW5jdGlvbiBzZXRfZGF0YV9kZXYodGV4dCwgZGF0YSkge1xuICAgIGRhdGEgPSAnJyArIGRhdGE7XG4gICAgaWYgKHRleHQuZGF0YSA9PT0gZGF0YSlcbiAgICAgICAgcmV0dXJuO1xuICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTVNldERhdGFcIiwgeyBub2RlOiB0ZXh0LCBkYXRhIH0pO1xuICAgIHRleHQuZGF0YSA9IGRhdGE7XG59XG5jbGFzcyBTdmVsdGVDb21wb25lbnREZXYgZXh0ZW5kcyBTdmVsdGVDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKCFvcHRpb25zIHx8ICghb3B0aW9ucy50YXJnZXQgJiYgIW9wdGlvbnMuJCRpbmxpbmUpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCd0YXJnZXQnIGlzIGEgcmVxdWlyZWQgb3B0aW9uYCk7XG4gICAgICAgIH1cbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgJGRlc3Ryb3koKSB7XG4gICAgICAgIHN1cGVyLiRkZXN0cm95KCk7XG4gICAgICAgIHRoaXMuJGRlc3Ryb3kgPSAoKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYENvbXBvbmVudCB3YXMgYWxyZWFkeSBkZXN0cm95ZWRgKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5leHBvcnQgeyBIdG1sVGFnLCBTdmVsdGVDb21wb25lbnQsIFN2ZWx0ZUNvbXBvbmVudERldiwgU3ZlbHRlRWxlbWVudCwgYWRkX2F0dHJpYnV0ZSwgYWRkX2NsYXNzZXMsIGFkZF9mbHVzaF9jYWxsYmFjaywgYWRkX2xvY2F0aW9uLCBhZGRfcmVuZGVyX2NhbGxiYWNrLCBhZGRfcmVzaXplX2xpc3RlbmVyLCBhZGRfdHJhbnNmb3JtLCBhZnRlclVwZGF0ZSwgYXBwZW5kLCBhcHBlbmRfZGV2LCBhc3NpZ24sIGF0dHIsIGF0dHJfZGV2LCBiZWZvcmVVcGRhdGUsIGJpbmQsIGJpbmRpbmdfY2FsbGJhY2tzLCBibGFua19vYmplY3QsIGJ1YmJsZSwgY2hlY2tfb3V0cm9zLCBjaGlsZHJlbiwgY2xhaW1fZWxlbWVudCwgY2xhaW1fc3BhY2UsIGNsYWltX3RleHQsIGNsZWFyX2xvb3BzLCBjb21wb25lbnRfc3Vic2NyaWJlLCBjcmVhdGVFdmVudERpc3BhdGNoZXIsIGNyZWF0ZV9hbmltYXRpb24sIGNyZWF0ZV9iaWRpcmVjdGlvbmFsX3RyYW5zaXRpb24sIGNyZWF0ZV9pbl90cmFuc2l0aW9uLCBjcmVhdGVfb3V0X3RyYW5zaXRpb24sIGNyZWF0ZV9zbG90LCBjcmVhdGVfc3NyX2NvbXBvbmVudCwgY3VycmVudF9jb21wb25lbnQsIGN1c3RvbV9ldmVudCwgZGF0YXNldF9kZXYsIGRlYnVnLCBkZXN0cm95X2Jsb2NrLCBkZXN0cm95X2NvbXBvbmVudCwgZGVzdHJveV9lYWNoLCBkZXRhY2gsIGRldGFjaF9hZnRlcl9kZXYsIGRldGFjaF9iZWZvcmVfZGV2LCBkZXRhY2hfYmV0d2Vlbl9kZXYsIGRldGFjaF9kZXYsIGRpcnR5X2NvbXBvbmVudHMsIGRpc3BhdGNoX2RldiwgZWFjaCwgZWxlbWVudCwgZWxlbWVudF9pcywgZW1wdHksIGVzY2FwZSwgZXNjYXBlZCwgZXhjbHVkZV9pbnRlcm5hbF9wcm9wcywgZml4X2FuZF9kZXN0cm95X2Jsb2NrLCBmaXhfYW5kX291dHJvX2FuZF9kZXN0cm95X2Jsb2NrLCBmaXhfcG9zaXRpb24sIGZsdXNoLCBnZXRDb250ZXh0LCBnZXRfYmluZGluZ19ncm91cF92YWx1ZSwgZ2V0X2N1cnJlbnRfY29tcG9uZW50LCBnZXRfc2xvdF9jaGFuZ2VzLCBnZXRfc2xvdF9jb250ZXh0LCBnZXRfc3ByZWFkX29iamVjdCwgZ2V0X3NwcmVhZF91cGRhdGUsIGdldF9zdG9yZV92YWx1ZSwgZ2xvYmFscywgZ3JvdXBfb3V0cm9zLCBoYW5kbGVfcHJvbWlzZSwgaWRlbnRpdHksIGluaXQsIGluc2VydCwgaW5zZXJ0X2RldiwgaW50cm9zLCBpbnZhbGlkX2F0dHJpYnV0ZV9uYW1lX2NoYXJhY3RlciwgaXNfY2xpZW50LCBpc19mdW5jdGlvbiwgaXNfcHJvbWlzZSwgbGlzdGVuLCBsaXN0ZW5fZGV2LCBsb29wLCBtZWFzdXJlLCBtaXNzaW5nX2NvbXBvbmVudCwgbW91bnRfY29tcG9uZW50LCBub29wLCBub3RfZXF1YWwsIG5vdywgbnVsbF90b19lbXB0eSwgb2JqZWN0X3dpdGhvdXRfcHJvcGVydGllcywgb25EZXN0cm95LCBvbk1vdW50LCBvbmNlLCBvdXRyb19hbmRfZGVzdHJveV9ibG9jaywgcHJldmVudF9kZWZhdWx0LCBwcm9wX2RldiwgcmFmLCBydW4sIHJ1bl9hbGwsIHNhZmVfbm90X2VxdWFsLCBzY2hlZHVsZV91cGRhdGUsIHNlbGVjdF9tdWx0aXBsZV92YWx1ZSwgc2VsZWN0X29wdGlvbiwgc2VsZWN0X29wdGlvbnMsIHNlbGVjdF92YWx1ZSwgc2VsZiwgc2V0Q29udGV4dCwgc2V0X2F0dHJpYnV0ZXMsIHNldF9jdXJyZW50X2NvbXBvbmVudCwgc2V0X2N1c3RvbV9lbGVtZW50X2RhdGEsIHNldF9kYXRhLCBzZXRfZGF0YV9kZXYsIHNldF9pbnB1dF90eXBlLCBzZXRfaW5wdXRfdmFsdWUsIHNldF9ub3csIHNldF9yYWYsIHNldF9zdG9yZV92YWx1ZSwgc2V0X3N0eWxlLCBzZXRfc3ZnX2F0dHJpYnV0ZXMsIHNwYWNlLCBzcHJlYWQsIHN0b3BfcHJvcGFnYXRpb24sIHN1YnNjcmliZSwgc3ZnX2VsZW1lbnQsIHRleHQsIHRpY2ssIHRpbWVfcmFuZ2VzX3RvX2FycmF5LCB0b19udW1iZXIsIHRvZ2dsZV9jbGFzcywgdHJhbnNpdGlvbl9pbiwgdHJhbnNpdGlvbl9vdXQsIHVwZGF0ZV9rZXllZF9lYWNoLCB2YWxpZGF0ZV9jb21wb25lbnQsIHZhbGlkYXRlX3N0b3JlLCB4bGlua19hdHRyIH07XG4iLCI8c2NyaXB0PlxuZXhwb3J0IGxldCBjbGFzc05hbWUgPSBcImRlZmF1bHRcIjtcbmV4cG9ydCBsZXQgZGlzYWJsZWQgPSBmYWxzZTtcbmV4cG9ydCBsZXQgY29udGVudFRleHQ7XG5leHBvcnQgbGV0IGNvbnRlbnRDb21wb25lbnQ7XG5leHBvcnQgbGV0IG9uQ2xpY2sgPSAoKSA9PiB7fTtcblxuZXhwb3J0IGxldCBfYmI7XG5sZXQgY29udGVudENvbXBvbmVudENvbnRhaW5lcjtcblxuJDp7XG5cdGlmKF9iYiAmJiBjb250ZW50Q29tcG9uZW50Q29udGFpbmVyICYmIGNvbnRlbnRDb21wb25lbnQuX2NvbXBvbmVudClcblx0XHRfYmIuaW5pdGlhbGlzZUNvbXBvbmVudChjb250ZW50Q29tcG9uZW50LCBjb250ZW50Q29tcG9uZW50Q29udGFpbmVyKTtcbn1cblxuXG5jb25zdCBjbGlja0hhbmRsZXIgPSAoKSA9PiB7XG5cdGlmKG9uQ2xpY2spIG9uQ2xpY2soKTtcbn1cblxuPC9zY3JpcHQ+XG5cblxuPGJ1dHRvbiBjbGFzcz17Y2xhc3NOYW1lfSB7ZGlzYWJsZWR9IG9uOmNsaWNrPXtjbGlja0hhbmRsZXJ9PlxuICAgIHsjaWYgY29udGVudENvbXBvbmVudCAmJiBjb250ZW50Q29tcG9uZW50Ll9jb21wb25lbnR9XG5cdDxkaXYgYmluZDp0aGlzPXtjb250ZW50Q29tcG9uZW50Q29udGFpbmVyfT5cblx0PC9kaXY+XG4gICAgezplbHNlIGlmIGNvbnRlbnRUZXh0fVxuICAgIHtjb250ZW50VGV4dH1cbiAgICB7OmVsc2V9XG4gICAgPHNsb3QgLz5cbiAgICB7L2lmfVxuPC9idXR0b24+XG5cblxuPHN0eWxlPlxuXG4uZGVmYXVsdCB7XG5cdGZvbnQtZmFtaWx5OiBpbmhlcml0O1xuXHRmb250LXNpemU6IGluaGVyaXQ7XG5cdHBhZGRpbmc6IDAuNGVtO1xuXHRtYXJnaW46IDAgMCAwLjVlbSAwO1xuXHRib3gtc2l6aW5nOiBib3JkZXItYm94O1xuXHRib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuXHRib3JkZXItcmFkaXVzOiAycHg7XG5cdGNvbG9yOiAjMzMzO1xuXHRiYWNrZ3JvdW5kLWNvbG9yOiAjZjRmNGY0O1xuXHRvdXRsaW5lOiBub25lO1xufVxuXG4uZGVmYXVsdDphY3RpdmUge1xuXHRiYWNrZ3JvdW5kLWNvbG9yOiAjZGRkO1xufVxuXG4uZGVmYXVsdDpmb2N1cyB7XG5cdGJvcmRlci1jb2xvcjogIzY2Njtcbn1cblxuPC9zdHlsZT4iLCI8c2NyaXB0PlxuXG5leHBvcnQgbGV0IHZhbHVlPVwiXCI7XG5leHBvcnQgbGV0IGhpZGVWYWx1ZSA9IGZhbHNlO1xuZXhwb3J0IGxldCBjbGFzc05hbWUgPSBcImRlZmF1bHRcIjtcblxuZXhwb3J0IGxldCBfYmI7XG5cbmxldCBhY3R1YWxWYWx1ZSA9IFwiXCI7XG4kOiB7XG5cdGlmKF9iYiAmJiB2YWx1ZS5faXNzdGF0ZSkge1xuXHRcdF9iYi5zdG9yZS5zdWJzY3JpYmUocyA9PiB7XG5cdFx0XHRhY3R1YWxWYWx1ZSA9IF9iYi5zdG9yZS5nZXRWYWx1ZShzLCB2YWx1ZSk7XG5cdFx0fSk7XG5cdH1cbn1cblxuY29uc3Qgb25jaGFuZ2UgPSAoZXYpID0+IHtcblx0aWYoX2JiICYmIHZhbHVlLl9pc3N0YXRlKSB7XG5cdFx0X2JiLnN0b3JlLnNldFZhbHVlKHZhbHVlLCBldi50YXJnZXQudmFsdWUpO1xuXHR9IGVsc2UgaWYoIXZhbHVlLl9pc3N0YXRlKSB7XG5cdFx0YWN0dWFsVmFsdWUgPSBldi50YXJnZXQudmFsdWU7XG5cdH1cbn1cblxuPC9zY3JpcHQ+XG5cbnsjaWYgaGlkZVZhbHVlfVxuPGlucHV0IGNsYXNzPXtjbGFzc05hbWV9IFxuXHQgICB0eXBlPVwicGFzc3dvcmRcIiBcblx0ICAgdmFsdWU9e2FjdHVhbFZhbHVlfSBvbjpjaGFuZ2UvPlxuezplbHNlfVxuPGlucHV0IGNsYXNzPXtjbGFzc05hbWV9IHR5cGU9XCJ0ZXh0XCIgdmFsdWU9e2FjdHVhbFZhbHVlfS8+XG57L2lmfVxuXG48c3R5bGU+XG4uZGVmYXVsdCB7XG4gICAgd2lkdGg6IDEwMCU7XG5cdGZvbnQtZmFtaWx5OiBpbmhlcml0O1xuXHRmb250LXNpemU6IGluaGVyaXQ7XG5cdHBhZGRpbmc6IDAuNGVtO1xuXHRtYXJnaW46IDAgMCAwLjVlbSAwO1xuXHRib3gtc2l6aW5nOiBib3JkZXItYm94O1xuXHRib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuICAgIGJvcmRlci1yYWRpdXM6IDJweDtcbiAgICB3aWR0aDogMTAwJTtcbn1cblxuLmRlZmF1bHQ6ZGlzYWJsZWQge1xuXHRjb2xvcjogI2NjYztcbn1cblxuPC9zdHlsZT4iLCI8c2NyaXB0PlxuZXhwb3J0IGxldCBjb250YWluZXJDbGFzcyA9IFwiXCI7XG5leHBvcnQgbGV0IGZvcm1Db250cm9scyA9IFtdO1xuXG5leHBvcnQgbGV0IF9iYjtcblxubGV0IGh0bWxFbGVtZW50cyA9IHt9O1xubGV0IGxhYmVscyA9IHt9O1xuXG4kIDoge1xuICAgIGxldCBjSW5kZXggPSAwO1xuICAgIGZvcihsZXQgYyBvZiBmb3JtQ29udHJvbHMpIHtcbiAgICAgICAgbGFiZWxzW2NJbmRleF0gPSBjLmxhYmVsO1xuICAgICAgICBjSW5kZXgrKztcbiAgICB9XG5cbiAgICBpZihfYmIgJiYgaHRtbEVsZW1lbnRzKSB7XG4gICAgICAgIGZvcihsZXQgZWwgaW4gaHRtbEVsZW1lbnRzKSB7XG4gICAgICAgICAgICBfYmIuaW5pdGlhbGlzZUNvbXBvbmVudChcbiAgICAgICAgICAgICAgICBmb3JtQ29udHJvbHNbZWxdLmNvbnRyb2wsXG4gICAgICAgICAgICAgICAgaHRtbEVsZW1lbnRzW2VsXVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuPC9zY3JpcHQ+XG5cbjxkaXYgY2xhc3M9XCJmb3JtLXJvb3Qge2NvbnRhaW5lckNsYXNzfVwiPlxuICAgIHsjZWFjaCBmb3JtQ29udHJvbHMgYXMgY2hpbGQsIGluZGV4fVxuICAgIDxkaXYgY2xhc3M9XCJsYWJlbFwiPntsYWJlbHNbaW5kZXhdfTwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJjb250cm9sXCJcbiAgICAgICAgYmluZDp0aGlzPXtodG1sRWxlbWVudHNbaW5kZXhdfT5cbiAgICA8L2Rpdj5cbiAgICB7L2VhY2h9XG48L2Rpdj5cblxuPHN0eWxlPlxuLmZvcm0tcm9vdCB7XG4gICAgZGlzcGxheTogZ3JpZDtcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IFtsYWJlbF0gYXV0byBbY29udHJvbF0gMWZyOyAvKiBbb3ZlcmZsb3ddIGF1dG87Ki9cbn1cblxuLmxhYmVsIHtcbiAgICBncmlkLWNvbHVtbi1zdGFydDogbGFiZWw7XG4gICAgcGFkZGluZzogNXB4IDEwcHg7XG4gICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbn1cbi5jb250cm9sIHtcbiAgICBncmlkLWNvbHVtbi1zdGFydDogY29udHJvbDtcbiAgICBwYWRkaW5nOiA1cHggMTBweDtcbn1cbi5vdmVyZmxvdyB7XG4gICAgZ3JpZC1jb2x1bW4tc3RhcnQ6IG92ZXJmbG93O1xufVxuLmZ1bGwtd2lkdGgge1xuICAgIHdpZHRoOiAxMDAlO1xufVxuPC9zdHlsZT4iLCI8c2NyaXB0PlxuXG5pbXBvcnQgVGV4dGJveCBmcm9tIFwiLi9UZXh0Ym94LnN2ZWx0ZVwiO1xuaW1wb3J0IEZvcm0gZnJvbSBcIi4vRm9ybS5zdmVsdGVcIjtcbmltcG9ydCBCdXR0b24gZnJvbSBcIi4vQnV0dG9uLnN2ZWx0ZVwiO1xuXG5leHBvcnQgbGV0IHVzZXJuYW1lTGFiZWwgPSBcIlVzZXJuYW1lXCI7XG5leHBvcnQgbGV0IHBhc3N3b3JkTGFiZWwgPSBcIlBhc3N3b3JkXCI7XG5leHBvcnQgbGV0IGxvZ2luQnV0dG9uTGFiZWwgPSBcIkxvZ2luXCI7XG5leHBvcnQgbGV0IGxvZ2luUmVkaXJlY3QgPSBcIlwiO1xuZXhwb3J0IGxldCBsb2dvID0gXCJcIjtcbmV4cG9ydCBsZXQgYnV0dG9uQ2xhc3MgPSBcIlwiO1xuZXhwb3J0IGxldCBpbnB1dENsYXNzPVwiXCJcblxuZXhwb3J0IGxldCBfYmI7XG5cbmxldCB1c2VybmFtZSA9IFwiXCI7XG5sZXQgcGFzc3dvcmQgPSBcIlwiO1xubGV0IGJ1c3kgPSBmYWxzZTtcbmxldCBpbmNvcnJlY3QgPSBmYWxzZTtcbmxldCBfbG9nbyA9IFwiXCI7XG5sZXQgX2J1dHRvbkNsYXNzID0gXCJcIjtcbmxldCBfaW5wdXRDbGFzcyA9IFwiXCI7XG5cbiQ6IHtcbiAgICBfbG9nbyA9IF9iYi5yZWxhdGl2ZVVybChsb2dvKTtcbiAgICBfYnV0dG9uQ2xhc3MgPSBidXR0b25DbGFzcyB8fCBcImRlZmF1bHQtYnV0dG9uXCI7XG4gICAgX2lucHV0Q2xhc3MgPSBpbnB1dENsYXNzIHx8IFwiZGVmYXVsdC1pbnB1dFwiO1xufVxuXG5jb25zdCBsb2dpbiA9ICgpID0+IHtcbiAgICBidXN5ID0gdHJ1ZTtcbiAgICBfYmIuYXBpLnBvc3QoXCIvYXBpL2F1dGhlbnRpY2F0ZVwiLCB7dXNlcm5hbWUsIHBhc3N3b3JkfSlcbiAgICAudGhlbihyID0+IHtcbiAgICAgICAgYnVzeSA9IGZhbHNlO1xuICAgICAgICBpZihyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICByZXR1cm4gci5qc29uKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbmNvcnJlY3QgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfSlcbiAgICAudGhlbih1c2VyID0+IHtcbiAgICAgICAgaWYodXNlcikge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJidWRpYmFzZTp1c2VyXCIsIHVzZXIpO1xuICAgICAgICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICAgIH1cbiAgICB9KVxufVxuXG48L3NjcmlwdD5cblxuPGRpdiBjbGFzcz1cInJvb3RcIj5cblxuICAgIDxkaXYgY2xhc3M9XCJjb250ZW50XCI+XG5cbiAgICAgICAgeyNpZiBfbG9nb31cbiAgICAgICAgPGRpdiBjbGFzcz1cImxvZ28tY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8aW1nIHNyYz17X2xvZ299IGFsdD1cImxvZ29cIi8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7L2lmfVxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLXJvb3RcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsYWJlbFwiPlxuICAgICAgICAgICAgICAgIHt1c2VybmFtZUxhYmVsfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udHJvbFwiPlxuICAgICAgICAgICAgICAgIDxpbnB1dCBiaW5kOnZhbHVlPXt1c2VybmFtZX0gdHlwZT1cInRleHRcIiBjbGFzcz17X2lucHV0Q2xhc3N9Lz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxhYmVsXCI+XG4gICAgICAgICAgICAgICAge3Bhc3N3b3JkTGFiZWx9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250cm9sXCI+XG4gICAgICAgICAgICAgICAgPGlucHV0IGJpbmQ6dmFsdWU9e3Bhc3N3b3JkfSB0eXBlPVwicGFzc3dvcmRcIiBjbGFzcz17X2lucHV0Q2xhc3N9Lz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwibG9naW4tYnV0dG9uLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPGJ1dHRvbiBkaXNhYmxlZD17YnVzeX0gXG4gICAgICAgICAgICAgICAgICAgIG9uOmNsaWNrPXtsb2dpbn1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3M9e19idXR0b25DbGFzc30+XG4gICAgICAgICAgICAgICAgICAgIHtsb2dpbkJ1dHRvbkxhYmVsfVxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIHsjaWYgaW5jb3JyZWN0fVxuICAgICAgICA8ZGl2IGNsYXNzPVwiaW5jb3JyZWN0LWRldGFpbHMtcGFuZWxcIj5cbiAgICAgICAgICAgIEluY29ycmVjdCB1c2VybmFtZSBvciBwYXNzd29yZFxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgey9pZn1cblxuICAgIDwvZGl2PlxuXG48L2Rpdj5cblxuPHN0eWxlPlxuXG4ucm9vdCB7XG4gICAgaGVpZ2h0OiAxMDAlO1xuICAgIGRpc3BsYXk6Z3JpZDtcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IFtsZWZ0XSAxZnIgW21pZGRsZV0gYXV0byBbcmlnaHRdIDFmcjtcbiAgICBncmlkLXRlbXBsYXRlLXJvd3M6IFt0b3BdIDFmciBbY2VudGVyXSBhdXRvIFtib3R0b21dIDFmcjtcbn1cblxuLmNvbnRlbnQge1xuICAgIGdyaWQtY29sdW1uLXN0YXJ0OiBtaWRkbGU7XG4gICAgZ3JpZC1yb3ctc3RhcnQ6IGNlbnRlcjtcbiAgICB3aWR0aDogNDAwcHg7XG59XG5cbi5sb2dvLWNvbnRhaW5lciB7XG4gICAgbWFyZ2luLWJvdHRvbTogMjBweFxufVxuXG4ubG9nby1jb250YWluZXIgPiBpbWcge1xuICAgIG1heC13aWR0aDogMTAwJTtcbn1cblxuLmxvZ2luLWJ1dHRvbi1jb250YWluZXIge1xuICAgIHRleHQtYWxpZ246IHJpZ2h0O1xuICAgIG1hcmdpbi10b3A6IDIwcHg7XG59XG5cbi5pbmNvcnJlY3QtZGV0YWlscy1wYW5lbCB7XG4gICAgbWFyZ2luLXRvcDogMzBweDtcbiAgICBwYWRkaW5nOiAxMHB4O1xuICAgIGJvcmRlci1zdHlsZTogc29saWQ7XG4gICAgYm9yZGVyLXdpZHRoOiAxcHg7XG4gICAgYm9yZGVyLWNvbG9yOiBtYXJvb247XG4gICAgYm9yZGVyLXJhZGl1czogMXB4O1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICBjb2xvcjogbWFyb29uO1xuICAgIGJhY2tncm91bmQtY29sb3I6IG1pc3R5cm9zZTtcbn1cblxuLmZvcm0tcm9vdCB7XG4gICAgZGlzcGxheTogZ3JpZDtcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IFtsYWJlbF0gYXV0byBbY29udHJvbF0gMWZyOyAvKiBbb3ZlcmZsb3ddIGF1dG87Ki9cbn1cblxuLmxhYmVsIHtcbiAgICBncmlkLWNvbHVtbi1zdGFydDogbGFiZWw7XG4gICAgcGFkZGluZzogNXB4IDEwcHg7XG4gICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbn1cbi5jb250cm9sIHtcbiAgICBncmlkLWNvbHVtbi1zdGFydDogY29udHJvbDtcbiAgICBwYWRkaW5nOiA1cHggMTBweDtcbn1cblxuLmRlZmF1bHQtaW5wdXQge1xuXHRmb250LWZhbWlseTogaW5oZXJpdDtcblx0Zm9udC1zaXplOiBpbmhlcml0O1xuXHRwYWRkaW5nOiAwLjRlbTtcblx0bWFyZ2luOiAwIDAgMC41ZW0gMDtcblx0Ym94LXNpemluZzogYm9yZGVyLWJveDtcblx0Ym9yZGVyOiAxcHggc29saWQgI2NjYztcbiAgICBib3JkZXItcmFkaXVzOiAycHg7XG4gICAgd2lkdGg6IDEwMCU7XG59XG5cbi5kZWZhdWx0LWJ1dHRvbiB7XG5cdGZvbnQtZmFtaWx5OiBpbmhlcml0O1xuXHRmb250LXNpemU6IGluaGVyaXQ7XG5cdHBhZGRpbmc6IDAuNGVtO1xuXHRtYXJnaW46IDAgMCAwLjVlbSAwO1xuXHRib3gtc2l6aW5nOiBib3JkZXItYm94O1xuXHRib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuXHRib3JkZXItcmFkaXVzOiAycHg7XG5cdGNvbG9yOiAjMzMzO1xuXHRiYWNrZ3JvdW5kLWNvbG9yOiAjZjRmNGY0O1xuXHRvdXRsaW5lOiBub25lO1xufVxuXG4uZGVmYXVsdC1idXR0b246YWN0aXZlIHtcblx0YmFja2dyb3VuZC1jb2xvcjogI2RkZDtcbn1cblxuLmRlZmF1bHQtYnV0dG9uOmZvY3VzIHtcblx0Ym9yZGVyLWNvbG9yOiAjNjY2O1xufVxuXG48L3N0eWxlPiIsImV4cG9ydCBjb25zdCBidWlsZFN0eWxlID0gKHN0eWxlcykgPT4ge1xyXG4gICAgbGV0IHN0ciA9IFwiXCI7XHJcbiAgICBmb3IobGV0IHMgaW4gc3R5bGVzKSB7XHJcbiAgICAgICAgaWYoc3R5bGVzW3NdKSB7XHJcbiAgICAgICAgICAgIHN0ciArPSBgJHtzfTogJHtzdHlsZXNbc119OyBgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHN0cjtcclxufSIsIjxzY3JpcHQ+XHJcbmltcG9ydCB7IG9uTW91bnQgfSBmcm9tICdzdmVsdGUnXHJcbmltcG9ydCB7YnVpbGRTdHlsZX0gZnJvbSBcIi4vYnVpbGRTdHlsZVwiO1xyXG5cclxuZXhwb3J0IGxldCBncmlkVGVtcGxhdGVSb3dzID1cIlwiO1xyXG5leHBvcnQgbGV0IGdyaWRUZW1wbGF0ZUNvbHVtbnMgPVwiXCI7XHJcbmV4cG9ydCBsZXQgY2hpbGRyZW4gPSBbXTtcclxuZXhwb3J0IGxldCB3aWR0aCA9IFwiYXV0b1wiO1xyXG5leHBvcnQgbGV0IGhlaWdodCA9IFwiYXV0b1wiO1xyXG5leHBvcnQgbGV0IGNvbnRhaW5lckNsYXNzPVwiXCI7XHJcbmV4cG9ydCBsZXQgaXRlbUNvbnRhaW5lckNsYXNzPVwiXCI7XHJcblxyXG4vKlwiZ3JpZENvbHVtblN0YXJ0XCI6XCJzdHJpbmdcIixcclxuXCJncmlkQ29sdW1uRW5kXCI6XCJzdHJpbmdcIixcclxuXCJncmlkUm93U3RhcnRcIjpcInN0cmluZ1wiLFxyXG5cImdyaWRSb3dFbmRcIjpcInN0cmluZ1wiKi9cclxuXHJcblxyXG5leHBvcnQgbGV0IF9iYjtcclxuXHJcbmxldCBzdHlsZT1cIlwiO1xyXG5sZXQgaHRtbEVsZW1lbnRzID0ge307XHJcblxyXG4kIDoge1xyXG4gICAgaWYoX2JiICYmIGh0bWxFbGVtZW50cykge1xyXG4gICAgICAgIGZvcihsZXQgZWwgaW4gaHRtbEVsZW1lbnRzKSB7XHJcbiAgICAgICAgICAgIF9iYi5pbml0aWFsaXNlQ29tcG9uZW50KFxyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW5bZWxdLmNvbnRyb2wsXHJcbiAgICAgICAgICAgICAgICBodG1sRWxlbWVudHNbZWxdXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBjaGlsZFN0eWxlID0gY2hpbGQgPT4gXHJcbiAgICBidWlsZFN0eWxlKHtcclxuICAgICAgICBcImdyaWQtY29sdW1uLXN0YXJ0XCI6IGNoaWxkLmdyaWRDb2x1bW5TdGFydCxcclxuICAgICAgICBcImdyaWQtY29sdW1uLWVuZFwiOiBjaGlsZC5ncmlkQ29sdW1uRW5kLFxyXG4gICAgICAgIFwiZ3JpZC1jb2x1bW5cIjogY2hpbGQuZ3JpZENvbHVtbixcclxuICAgICAgICBcImdyaWQtcm93LXN0YXJ0XCI6IGNoaWxkLmdyaWRSb3dTdGFydCxcclxuICAgICAgICBcImdyaWQtcm93LWVuZFwiOiBjaGlsZC5ncmlkUm93U3RhcnQsXHJcbiAgICAgICAgXCJncmlkLXJvd1wiOiBjaGlsZC5ncmlkUm93LFxyXG4gICAgfSk7XHJcblxyXG48L3NjcmlwdD5cclxuXHJcbjxkaXYgY2xhc3M9XCJyb290IHtjb250YWluZXJDbGFzc31cIlxyXG4gICAgIHN0eWxlPVwid2lkdGg6IHt3aWR0aH07IGhlaWdodDoge2hlaWdodH07IGdyaWQtdGVtcGxhdGUtY29sdW1uczoge2dyaWRUZW1wbGF0ZUNvbHVtbnN9OyBncmlkLXRlbXBsYXRlLXJvd3M6IHtncmlkVGVtcGxhdGVSb3dzfTtcIj5cclxuICAgIHsjZWFjaCBjaGlsZHJlbiBhcyBjaGlsZCwgaW5kZXh9XHJcbiAgICA8ZGl2IGNsYXNzPVwie2l0ZW1Db250YWluZXJDbGFzc31cIlxyXG4gICAgICAgIHN0eWxlPXtjaGlsZFN0eWxlKGNoaWxkKX1cclxuICAgICAgICBiaW5kOnRoaXM9e2h0bWxFbGVtZW50c1tpbmRleF19PlxyXG4gICAgPC9kaXY+XHJcbiAgICB7L2VhY2h9XHJcbjwvZGl2PlxyXG5cclxuPHN0eWxlPlxyXG5cclxuLnJvb3Qge1xyXG4gICAgZGlzcGxheTogZ3JpZDtcclxufVxyXG5cclxuPC9zdHlsZT4iLCI8c2NyaXB0PlxuaW1wb3J0IHsgb25Nb3VudCB9IGZyb20gJ3N2ZWx0ZSdcblxuZXhwb3J0IGxldCBkaXJlY3Rpb24gPSBcImhvcml6b250YWxcIjtcbmV4cG9ydCBsZXQgY2hpbGRyZW4gPSBbXTtcbmV4cG9ydCBsZXQgd2lkdGggPSBcImF1dG9cIjtcbmV4cG9ydCBsZXQgaGVpZ2h0ID0gXCJhdXRvXCI7XG5leHBvcnQgbGV0IGNvbnRhaW5lckNsYXNzPVwiXCI7XG5leHBvcnQgbGV0IGl0ZW1Db250YWluZXJDbGFzcz1cIlwiO1xuXG5cbmV4cG9ydCBsZXQgX2JiO1xuXG5sZXQgaHRtbEVsZW1lbnRzID0ge307XG5cbm9uTW91bnQoKCkgPT4ge1xuICAgIGlmKF9iYiAmJiBodG1sRWxlbWVudHMpIHtcbiAgICAgICAgZm9yKGxldCBlbCBpbiBodG1sRWxlbWVudHMpIHtcbiAgICAgICAgICAgIF9iYi5pbml0aWFsaXNlQ29tcG9uZW50KFxuICAgICAgICAgICAgICAgIGNoaWxkcmVuW2VsXS5jb250cm9sLFxuICAgICAgICAgICAgICAgIGh0bWxFbGVtZW50c1tlbF1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuXG48L3NjcmlwdD5cblxuPGRpdiBjbGFzcz1cInJvb3Qge2NvbnRhaW5lckNsYXNzfVwiXG4gICAgIHN0eWxlPVwid2lkdGg6IHt3aWR0aH07IGhlaWdodDoge2hlaWdodH1cIj5cbiAgICB7I2VhY2ggY2hpbGRyZW4gYXMgY2hpbGQsIGluZGV4fVxuICAgIDxkaXYgY2xhc3M9e2RpcmVjdGlvbn0+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ7aXRlbUNvbnRhaW5lckNsYXNzfVwiXG4gICAgICAgICAgICBiaW5kOnRoaXM9e2h0bWxFbGVtZW50c1tpbmRleF19PlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICB7L2VhY2h9XG48L2Rpdj5cblxuPHN0eWxlPlxuXG4uaG9yaXpvbnRhbCB7XG4gICAgZGlzcGxheTppbmxpbmUtYmxvY2s7XG59XG5cbi52ZXJ0aWNhbCB7XG4gICAgZGlzcGxheTogYmxvY2s7XG59XG5cbjwvc3R5bGU+Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFNBQVMsSUFBSSxHQUFHLEdBQUc7QUFDbkIsQUFDQSxTQUFTLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFOztJQUV0QixLQUFLLE1BQU0sQ0FBQyxJQUFJLEdBQUc7UUFDZixHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BCLE9BQU8sR0FBRyxDQUFDO0NBQ2Q7QUFDRCxBQVFBLFNBQVMsR0FBRyxDQUFDLEVBQUUsRUFBRTtJQUNiLE9BQU8sRUFBRSxFQUFFLENBQUM7Q0FDZjtBQUNELFNBQVMsWUFBWSxHQUFHO0lBQ3BCLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FB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
