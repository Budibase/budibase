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
function toggle_class(element, name, toggle) {
    element.classList[toggle ? 'add' : 'remove'](name);
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

// https://github.com/kaisermann/svelte-css-vars

var cssVars = (node, props) => {
    Object.entries(props).forEach(([key, value]) => {
      node.style.setProperty(`--${key}`, value);
    });
  
    return {
      update(new_props) {
        Object.entries(new_props).forEach(([key, value]) => {
          node.style.setProperty(`--${key}`, value);
          delete props[key];
        });
  
        Object.keys(props).forEach(name =>
          node.style.removeProperty(`--${name}`),
        );
        props = new_props;
      },
    };
  };

/* src\Nav.svelte generated by Svelte v3.12.1 */

function add_css$6() {
	var style = element("style");
	style.id = 'svelte-aihwli-style';
	style.textContent = ".root.svelte-aihwli{height:100%;width:100%;grid-template-columns:[navbar] auto [content] 1fr;display:grid}.navbar.svelte-aihwli{grid-column:navbar;background:var(--navBarBackground);border:var(--navBarBorder);color:var(--navBarColor)}.navitem.svelte-aihwli{padding:10px 17px;cursor:pointer}.navitem.svelte-aihwli:hover{background:var(--itemHoverBackground);color:var(--itemHoverColor)}.navitem.selected.svelte-aihwli{background:var(--selectedItemBackground);border:var(--selectedItemBorder);color:var(--selectedItemColor)}.content.svelte-aihwli{grid-column:content}";
	append(document.head, style);
}

function get_each_context$3(ctx, list, i) {
	const child_ctx = Object.create(ctx);
	child_ctx.navItem = list[i];
	child_ctx.index = i;
	return child_ctx;
}

// (36:8) {#each items as navItem, index}
function create_each_block$3(ctx) {
	var div, t0_value = ctx.navItem.title + "", t0, t1, dispose;

	return {
		c() {
			div = element("div");
			t0 = text(t0_value);
			t1 = space();
			this.h();
		},

		l(nodes) {
			div = claim_element(nodes, "DIV", { class: true }, false);
			var div_nodes = children(div);

			t0 = claim_text(div_nodes, t0_value);
			t1 = claim_space(div_nodes);
			div_nodes.forEach(detach);
			this.h();
		},

		h() {
			attr(div, "class", "navitem svelte-aihwli");
			toggle_class(div, "selected", ctx.selectedIndex === ctx.index);
			dispose = listen(div, "click", ctx.onSelectItem(ctx.index));
		},

		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t0);
			append(div, t1);
		},

		p(changed, new_ctx) {
			ctx = new_ctx;
			if ((changed.items) && t0_value !== (t0_value = ctx.navItem.title + "")) {
				set_data(t0, t0_value);
			}

			if (changed.selectedIndex) {
				toggle_class(div, "selected", ctx.selectedIndex === ctx.index);
			}
		},

		d(detaching) {
			if (detaching) {
				detach(div);
			}

			dispose();
		}
	};
}

function create_fragment$6(ctx) {
	var div2, div0, t, div1, cssVars_action;

	let each_value = ctx.items;

	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
	}

	return {
		c() {
			div2 = element("div");
			div0 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t = space();
			div1 = element("div");
			this.h();
		},

		l(nodes) {
			div2 = claim_element(nodes, "DIV", { class: true }, false);
			var div2_nodes = children(div2);

			div0 = claim_element(div2_nodes, "DIV", { class: true }, false);
			var div0_nodes = children(div0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].l(div0_nodes);
			}

			div0_nodes.forEach(detach);
			t = claim_space(div2_nodes);

			div1 = claim_element(div2_nodes, "DIV", { class: true }, false);
			var div1_nodes = children(div1);

			div1_nodes.forEach(detach);
			div2_nodes.forEach(detach);
			this.h();
		},

		h() {
			attr(div0, "class", "navbar svelte-aihwli");
			attr(div1, "class", "content svelte-aihwli");
			attr(div2, "class", "root svelte-aihwli");
		},

		m(target, anchor) {
			insert(target, div2, anchor);
			append(div2, div0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div0, null);
			}

			append(div2, t);
			append(div2, div1);
			ctx.div1_binding(div1);
			cssVars_action = cssVars.call(null, div2, ctx.styleVars) || {};
		},

		p(changed, ctx) {
			if (changed.selectedIndex || changed.items) {
				each_value = ctx.items;

				let i;
				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$3(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(changed, child_ctx);
					} else {
						each_blocks[i] = create_each_block$3(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div0, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}
				each_blocks.length = each_value.length;
			}

			if (typeof cssVars_action.update === 'function' && changed.styleVars) {
				cssVars_action.update.call(null, ctx.styleVars);
			}
		},

		i: noop,
		o: noop,

		d(detaching) {
			if (detaching) {
				detach(div2);
			}

			destroy_each(each_blocks, detaching);

			ctx.div1_binding(null);
			if (cssVars_action && typeof cssVars_action.destroy === 'function') cssVars_action.destroy();
		}
	};
}

function instance$6($$self, $$props, $$invalidate) {
	let { navBarBackground = "", navBarBorder="", navBarColor="", selectedItemBackground="", selectedItemColor="", selectedItemBorder="", itemHoverBackground="", itemHoverColor="", items = [], _bb } = $$props;

let selectedIndex;
let contentElement;

const onSelectItem = (index) => () => {
    $$invalidate('selectedIndex', selectedIndex = index);
    _bb.initialiseComponent(items[index].component, contentElement);
};

	function div1_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			$$invalidate('contentElement', contentElement = $$value);
		});
	}

	$$self.$set = $$props => {
		if ('navBarBackground' in $$props) $$invalidate('navBarBackground', navBarBackground = $$props.navBarBackground);
		if ('navBarBorder' in $$props) $$invalidate('navBarBorder', navBarBorder = $$props.navBarBorder);
		if ('navBarColor' in $$props) $$invalidate('navBarColor', navBarColor = $$props.navBarColor);
		if ('selectedItemBackground' in $$props) $$invalidate('selectedItemBackground', selectedItemBackground = $$props.selectedItemBackground);
		if ('selectedItemColor' in $$props) $$invalidate('selectedItemColor', selectedItemColor = $$props.selectedItemColor);
		if ('selectedItemBorder' in $$props) $$invalidate('selectedItemBorder', selectedItemBorder = $$props.selectedItemBorder);
		if ('itemHoverBackground' in $$props) $$invalidate('itemHoverBackground', itemHoverBackground = $$props.itemHoverBackground);
		if ('itemHoverColor' in $$props) $$invalidate('itemHoverColor', itemHoverColor = $$props.itemHoverColor);
		if ('items' in $$props) $$invalidate('items', items = $$props.items);
		if ('_bb' in $$props) $$invalidate('_bb', _bb = $$props._bb);
	};

	let styleVars;

	$$self.$$.update = ($$dirty = { navBarBackground: 1, navBarBorder: 1, navBarColor: 1, selectedItemBackground: 1, selectedItemColor: 1, selectedItemBorder: 1, itemHoverBackground: 1, itemHoverColor: 1 }) => {
		if ($$dirty.navBarBackground || $$dirty.navBarBorder || $$dirty.navBarColor || $$dirty.selectedItemBackground || $$dirty.selectedItemColor || $$dirty.selectedItemBorder || $$dirty.itemHoverBackground || $$dirty.itemHoverColor) { $$invalidate('styleVars', styleVars = {
            navBarBackground, navBarBorder,
            navBarColor, selectedItemBackground,
            selectedItemColor, selectedItemBorder,
            itemHoverBackground, itemHoverColor
        }); }
	};

	return {
		navBarBackground,
		navBarBorder,
		navBarColor,
		selectedItemBackground,
		selectedItemColor,
		selectedItemBorder,
		itemHoverBackground,
		itemHoverColor,
		items,
		_bb,
		selectedIndex,
		contentElement,
		onSelectItem,
		styleVars,
		div1_binding
	};
}

class Nav extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-aihwli-style")) add_css$6();
		init(this, options, instance$6, create_fragment$6, safe_not_equal, ["navBarBackground", "navBarBorder", "navBarColor", "selectedItemBackground", "selectedItemColor", "selectedItemBorder", "itemHoverBackground", "itemHoverColor", "items", "_bb"]);
	}
}

/* src\Panel.svelte generated by Svelte v3.12.1 */

function create_fragment$7(ctx) {
	var div, t;

	return {
		c() {
			div = element("div");
			t = text(ctx.text);
			this.h();
		},

		l(nodes) {
			div = claim_element(nodes, "DIV", { class: true, style: true, "this:bind": true }, false);
			var div_nodes = children(div);

			t = claim_text(div_nodes, ctx.text);
			div_nodes.forEach(detach);
			this.h();
		},

		h() {
			attr(div, "class", ctx.containerClass);
			attr(div, "style", ctx.style);
			attr(div, "this:bind", ctx.componentElement);
		},

		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t);
		},

		p(changed, ctx) {
			if (changed.text) {
				set_data(t, ctx.text);
			}

			if (changed.containerClass) {
				attr(div, "class", ctx.containerClass);
			}

			if (changed.style) {
				attr(div, "style", ctx.style);
			}
		},

		i: noop,
		o: noop,

		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

function instance$7($$self, $$props, $$invalidate) {
	let { component="", text="", containerClass="", background="", border="", borderRadius="", font="", display="", textAlign="", color="", padding="", _bb } = $$props;

let style="";
let componentElement;

	$$self.$set = $$props => {
		if ('component' in $$props) $$invalidate('component', component = $$props.component);
		if ('text' in $$props) $$invalidate('text', text = $$props.text);
		if ('containerClass' in $$props) $$invalidate('containerClass', containerClass = $$props.containerClass);
		if ('background' in $$props) $$invalidate('background', background = $$props.background);
		if ('border' in $$props) $$invalidate('border', border = $$props.border);
		if ('borderRadius' in $$props) $$invalidate('borderRadius', borderRadius = $$props.borderRadius);
		if ('font' in $$props) $$invalidate('font', font = $$props.font);
		if ('display' in $$props) $$invalidate('display', display = $$props.display);
		if ('textAlign' in $$props) $$invalidate('textAlign', textAlign = $$props.textAlign);
		if ('color' in $$props) $$invalidate('color', color = $$props.color);
		if ('padding' in $$props) $$invalidate('padding', padding = $$props.padding);
		if ('_bb' in $$props) $$invalidate('_bb', _bb = $$props._bb);
	};

	$$self.$$.update = ($$dirty = { border: 1, background: 1, font: 1, padding: 1, display: 1, color: 1, textAlign: 1, borderRadius: 1, _bb: 1, component: 1, componentElement: 1 }) => {
		if ($$dirty.border || $$dirty.background || $$dirty.font || $$dirty.padding || $$dirty.display || $$dirty.color || $$dirty.textAlign || $$dirty.borderRadius || $$dirty._bb || $$dirty.component || $$dirty.componentElement) { {
            $$invalidate('style', style=buildStyle({
                border, background, font, 
                padding, display, color,
                "text-align": textAlign,
                "border-radius":borderRadius
            }));
        
            if(_bb && component) {
                _bb.initialiseComponent(component, componentElement);
            }
        } }
	};

	return {
		component,
		text,
		containerClass,
		background,
		border,
		borderRadius,
		font,
		display,
		textAlign,
		color,
		padding,
		_bb,
		style,
		componentElement
	};
}

class Panel extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$7, create_fragment$7, safe_not_equal, ["component", "text", "containerClass", "background", "border", "borderRadius", "font", "display", "textAlign", "color", "padding", "_bb"]);
	}
}

/* src\Text.svelte generated by Svelte v3.12.1 */

function create_fragment$8(ctx) {
	var div, t;

	return {
		c() {
			div = element("div");
			t = text(ctx.value);
			this.h();
		},

		l(nodes) {
			div = claim_element(nodes, "DIV", { class: true, style: true }, false);
			var div_nodes = children(div);

			t = claim_text(div_nodes, ctx.value);
			div_nodes.forEach(detach);
			this.h();
		},

		h() {
			attr(div, "class", ctx.containerClass);
			attr(div, "style", ctx.style);
		},

		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t);
		},

		p(changed, ctx) {
			if (changed.value) {
				set_data(t, ctx.value);
			}

			if (changed.containerClass) {
				attr(div, "class", ctx.containerClass);
			}

			if (changed.style) {
				attr(div, "style", ctx.style);
			}
		},

		i: noop,
		o: noop,

		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

function instance$8($$self, $$props, $$invalidate) {
	let { value="", containerClass="", font="", textAlign="", verticalAlign="", color="", display="", _bb } = $$props;

let style="";

	$$self.$set = $$props => {
		if ('value' in $$props) $$invalidate('value', value = $$props.value);
		if ('containerClass' in $$props) $$invalidate('containerClass', containerClass = $$props.containerClass);
		if ('font' in $$props) $$invalidate('font', font = $$props.font);
		if ('textAlign' in $$props) $$invalidate('textAlign', textAlign = $$props.textAlign);
		if ('verticalAlign' in $$props) $$invalidate('verticalAlign', verticalAlign = $$props.verticalAlign);
		if ('color' in $$props) $$invalidate('color', color = $$props.color);
		if ('display' in $$props) $$invalidate('display', display = $$props.display);
		if ('_bb' in $$props) $$invalidate('_bb', _bb = $$props._bb);
	};

	$$self.$$.update = ($$dirty = { font: 1, verticalAlign: 1, color: 1, textAlign: 1 }) => {
		if ($$dirty.font || $$dirty.verticalAlign || $$dirty.color || $$dirty.textAlign) { {
            $$invalidate('style', style=buildStyle({
                font,  verticalAlign, color, 
                "text-align": textAlign,
                "vertical-align": verticalAlign
            }));
        } }
	};

	return {
		value,
		containerClass,
		font,
		textAlign,
		verticalAlign,
		color,
		display,
		_bb,
		style
	};
}

class Text extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$8, create_fragment$8, safe_not_equal, ["value", "containerClass", "font", "textAlign", "verticalAlign", "color", "display", "_bb"]);
	}
}

export { Button as button, Form as form, Grid as grid, Login as login, Nav as nav, Panel as panel, StackPanel as stackpanel, Text as text, Textbox as textbox };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9zdmVsdGUvaW50ZXJuYWwvaW5kZXgubWpzIiwiLi4vc3JjL0J1dHRvbi5zdmVsdGUiLCIuLi9zcmMvVGV4dGJveC5zdmVsdGUiLCIuLi9zcmMvRm9ybS5zdmVsdGUiLCIuLi9zcmMvTG9naW4uc3ZlbHRlIiwiLi4vc3JjL2J1aWxkU3R5bGUuanMiLCIuLi9zcmMvR3JpZC5zdmVsdGUiLCIuLi9zcmMvU3RhY2tQYW5lbC5zdmVsdGUiLCIuLi9zcmMvY3NzVmFycy5qcyIsIi4uL3NyYy9OYXYuc3ZlbHRlIiwiLi4vc3JjL1BhbmVsLnN2ZWx0ZSIsIi4uL3NyYy9UZXh0LnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBub29wKCkgeyB9XG5jb25zdCBpZGVudGl0eSA9IHggPT4geDtcbmZ1bmN0aW9uIGFzc2lnbih0YXIsIHNyYykge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBmb3IgKGNvbnN0IGsgaW4gc3JjKVxuICAgICAgICB0YXJba10gPSBzcmNba107XG4gICAgcmV0dXJuIHRhcjtcbn1cbmZ1bmN0aW9uIGlzX3Byb21pc2UodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgdmFsdWUudGhlbiA9PT0gJ2Z1bmN0aW9uJztcbn1cbmZ1bmN0aW9uIGFkZF9sb2NhdGlvbihlbGVtZW50LCBmaWxlLCBsaW5lLCBjb2x1bW4sIGNoYXIpIHtcbiAgICBlbGVtZW50Ll9fc3ZlbHRlX21ldGEgPSB7XG4gICAgICAgIGxvYzogeyBmaWxlLCBsaW5lLCBjb2x1bW4sIGNoYXIgfVxuICAgIH07XG59XG5mdW5jdGlvbiBydW4oZm4pIHtcbiAgICByZXR1cm4gZm4oKTtcbn1cbmZ1bmN0aW9uIGJsYW5rX29iamVjdCgpIHtcbiAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZShudWxsKTtcbn1cbmZ1bmN0aW9uIHJ1bl9hbGwoZm5zKSB7XG4gICAgZm5zLmZvckVhY2gocnVuKTtcbn1cbmZ1bmN0aW9uIGlzX2Z1bmN0aW9uKHRoaW5nKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB0aGluZyA9PT0gJ2Z1bmN0aW9uJztcbn1cbmZ1bmN0aW9uIHNhZmVfbm90X2VxdWFsKGEsIGIpIHtcbiAgICByZXR1cm4gYSAhPSBhID8gYiA9PSBiIDogYSAhPT0gYiB8fCAoKGEgJiYgdHlwZW9mIGEgPT09ICdvYmplY3QnKSB8fCB0eXBlb2YgYSA9PT0gJ2Z1bmN0aW9uJyk7XG59XG5mdW5jdGlvbiBub3RfZXF1YWwoYSwgYikge1xuICAgIHJldHVybiBhICE9IGEgPyBiID09IGIgOiBhICE9PSBiO1xufVxuZnVuY3Rpb24gdmFsaWRhdGVfc3RvcmUoc3RvcmUsIG5hbWUpIHtcbiAgICBpZiAoIXN0b3JlIHx8IHR5cGVvZiBzdG9yZS5zdWJzY3JpYmUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAnJHtuYW1lfScgaXMgbm90IGEgc3RvcmUgd2l0aCBhICdzdWJzY3JpYmUnIG1ldGhvZGApO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHN1YnNjcmliZShzdG9yZSwgY2FsbGJhY2spIHtcbiAgICBjb25zdCB1bnN1YiA9IHN0b3JlLnN1YnNjcmliZShjYWxsYmFjayk7XG4gICAgcmV0dXJuIHVuc3ViLnVuc3Vic2NyaWJlID8gKCkgPT4gdW5zdWIudW5zdWJzY3JpYmUoKSA6IHVuc3ViO1xufVxuZnVuY3Rpb24gZ2V0X3N0b3JlX3ZhbHVlKHN0b3JlKSB7XG4gICAgbGV0IHZhbHVlO1xuICAgIHN1YnNjcmliZShzdG9yZSwgXyA9PiB2YWx1ZSA9IF8pKCk7XG4gICAgcmV0dXJuIHZhbHVlO1xufVxuZnVuY3Rpb24gY29tcG9uZW50X3N1YnNjcmliZShjb21wb25lbnQsIHN0b3JlLCBjYWxsYmFjaykge1xuICAgIGNvbXBvbmVudC4kJC5vbl9kZXN0cm95LnB1c2goc3Vic2NyaWJlKHN0b3JlLCBjYWxsYmFjaykpO1xufVxuZnVuY3Rpb24gY3JlYXRlX3Nsb3QoZGVmaW5pdGlvbiwgY3R4LCBmbikge1xuICAgIGlmIChkZWZpbml0aW9uKSB7XG4gICAgICAgIGNvbnN0IHNsb3RfY3R4ID0gZ2V0X3Nsb3RfY29udGV4dChkZWZpbml0aW9uLCBjdHgsIGZuKTtcbiAgICAgICAgcmV0dXJuIGRlZmluaXRpb25bMF0oc2xvdF9jdHgpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGdldF9zbG90X2NvbnRleHQoZGVmaW5pdGlvbiwgY3R4LCBmbikge1xuICAgIHJldHVybiBkZWZpbml0aW9uWzFdXG4gICAgICAgID8gYXNzaWduKHt9LCBhc3NpZ24oY3R4LiQkc2NvcGUuY3R4LCBkZWZpbml0aW9uWzFdKGZuID8gZm4oY3R4KSA6IHt9KSkpXG4gICAgICAgIDogY3R4LiQkc2NvcGUuY3R4O1xufVxuZnVuY3Rpb24gZ2V0X3Nsb3RfY2hhbmdlcyhkZWZpbml0aW9uLCBjdHgsIGNoYW5nZWQsIGZuKSB7XG4gICAgcmV0dXJuIGRlZmluaXRpb25bMV1cbiAgICAgICAgPyBhc3NpZ24oe30sIGFzc2lnbihjdHguJCRzY29wZS5jaGFuZ2VkIHx8IHt9LCBkZWZpbml0aW9uWzFdKGZuID8gZm4oY2hhbmdlZCkgOiB7fSkpKVxuICAgICAgICA6IGN0eC4kJHNjb3BlLmNoYW5nZWQgfHwge307XG59XG5mdW5jdGlvbiBleGNsdWRlX2ludGVybmFsX3Byb3BzKHByb3BzKSB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgZm9yIChjb25zdCBrIGluIHByb3BzKVxuICAgICAgICBpZiAoa1swXSAhPT0gJyQnKVxuICAgICAgICAgICAgcmVzdWx0W2tdID0gcHJvcHNba107XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG9uY2UoZm4pIHtcbiAgICBsZXQgcmFuID0gZmFsc2U7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgIGlmIChyYW4pXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHJhbiA9IHRydWU7XG4gICAgICAgIGZuLmNhbGwodGhpcywgLi4uYXJncyk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIG51bGxfdG9fZW1wdHkodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/ICcnIDogdmFsdWU7XG59XG5mdW5jdGlvbiBzZXRfc3RvcmVfdmFsdWUoc3RvcmUsIHJldCwgdmFsdWUgPSByZXQpIHtcbiAgICBzdG9yZS5zZXQodmFsdWUpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbmNvbnN0IGlzX2NsaWVudCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnO1xubGV0IG5vdyA9IGlzX2NsaWVudFxuICAgID8gKCkgPT4gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpXG4gICAgOiAoKSA9PiBEYXRlLm5vdygpO1xubGV0IHJhZiA9IGlzX2NsaWVudCA/IGNiID0+IHJlcXVlc3RBbmltYXRpb25GcmFtZShjYikgOiBub29wO1xuLy8gdXNlZCBpbnRlcm5hbGx5IGZvciB0ZXN0aW5nXG5mdW5jdGlvbiBzZXRfbm93KGZuKSB7XG4gICAgbm93ID0gZm47XG59XG5mdW5jdGlvbiBzZXRfcmFmKGZuKSB7XG4gICAgcmFmID0gZm47XG59XG5cbmNvbnN0IHRhc2tzID0gbmV3IFNldCgpO1xubGV0IHJ1bm5pbmcgPSBmYWxzZTtcbmZ1bmN0aW9uIHJ1bl90YXNrcygpIHtcbiAgICB0YXNrcy5mb3JFYWNoKHRhc2sgPT4ge1xuICAgICAgICBpZiAoIXRhc2tbMF0obm93KCkpKSB7XG4gICAgICAgICAgICB0YXNrcy5kZWxldGUodGFzayk7XG4gICAgICAgICAgICB0YXNrWzFdKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBydW5uaW5nID0gdGFza3Muc2l6ZSA+IDA7XG4gICAgaWYgKHJ1bm5pbmcpXG4gICAgICAgIHJhZihydW5fdGFza3MpO1xufVxuZnVuY3Rpb24gY2xlYXJfbG9vcHMoKSB7XG4gICAgLy8gZm9yIHRlc3RpbmcuLi5cbiAgICB0YXNrcy5mb3JFYWNoKHRhc2sgPT4gdGFza3MuZGVsZXRlKHRhc2spKTtcbiAgICBydW5uaW5nID0gZmFsc2U7XG59XG5mdW5jdGlvbiBsb29wKGZuKSB7XG4gICAgbGV0IHRhc2s7XG4gICAgaWYgKCFydW5uaW5nKSB7XG4gICAgICAgIHJ1bm5pbmcgPSB0cnVlO1xuICAgICAgICByYWYocnVuX3Rhc2tzKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcHJvbWlzZTogbmV3IFByb21pc2UoZnVsZmlsID0+IHtcbiAgICAgICAgICAgIHRhc2tzLmFkZCh0YXNrID0gW2ZuLCBmdWxmaWxdKTtcbiAgICAgICAgfSksXG4gICAgICAgIGFib3J0KCkge1xuICAgICAgICAgICAgdGFza3MuZGVsZXRlKHRhc2spO1xuICAgICAgICB9XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gYXBwZW5kKHRhcmdldCwgbm9kZSkge1xuICAgIHRhcmdldC5hcHBlbmRDaGlsZChub2RlKTtcbn1cbmZ1bmN0aW9uIGluc2VydCh0YXJnZXQsIG5vZGUsIGFuY2hvcikge1xuICAgIHRhcmdldC5pbnNlcnRCZWZvcmUobm9kZSwgYW5jaG9yIHx8IG51bGwpO1xufVxuZnVuY3Rpb24gZGV0YWNoKG5vZGUpIHtcbiAgICBub2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XG59XG5mdW5jdGlvbiBkZXN0cm95X2VhY2goaXRlcmF0aW9ucywgZGV0YWNoaW5nKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVyYXRpb25zLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGlmIChpdGVyYXRpb25zW2ldKVxuICAgICAgICAgICAgaXRlcmF0aW9uc1tpXS5kKGRldGFjaGluZyk7XG4gICAgfVxufVxuZnVuY3Rpb24gZWxlbWVudChuYW1lKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobmFtZSk7XG59XG5mdW5jdGlvbiBlbGVtZW50X2lzKG5hbWUsIGlzKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobmFtZSwgeyBpcyB9KTtcbn1cbmZ1bmN0aW9uIG9iamVjdF93aXRob3V0X3Byb3BlcnRpZXMob2JqLCBleGNsdWRlKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1vYmplY3QtbGl0ZXJhbC10eXBlLWFzc2VydGlvblxuICAgIGNvbnN0IHRhcmdldCA9IHt9O1xuICAgIGZvciAoY29uc3QgayBpbiBvYmopIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGspXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAmJiBleGNsdWRlLmluZGV4T2YoaykgPT09IC0xKSB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICB0YXJnZXRba10gPSBvYmpba107XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldDtcbn1cbmZ1bmN0aW9uIHN2Z19lbGVtZW50KG5hbWUpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsIG5hbWUpO1xufVxuZnVuY3Rpb24gdGV4dChkYXRhKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGRhdGEpO1xufVxuZnVuY3Rpb24gc3BhY2UoKSB7XG4gICAgcmV0dXJuIHRleHQoJyAnKTtcbn1cbmZ1bmN0aW9uIGVtcHR5KCkge1xuICAgIHJldHVybiB0ZXh0KCcnKTtcbn1cbmZ1bmN0aW9uIGxpc3Rlbihub2RlLCBldmVudCwgaGFuZGxlciwgb3B0aW9ucykge1xuICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlciwgb3B0aW9ucyk7XG4gICAgcmV0dXJuICgpID0+IG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlciwgb3B0aW9ucyk7XG59XG5mdW5jdGlvbiBwcmV2ZW50X2RlZmF1bHQoZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgcmV0dXJuIGZuLmNhbGwodGhpcywgZXZlbnQpO1xuICAgIH07XG59XG5mdW5jdGlvbiBzdG9wX3Byb3BhZ2F0aW9uKGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBldmVudCk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHNlbGYoZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldCA9PT0gdGhpcylcbiAgICAgICAgICAgIGZuLmNhbGwodGhpcywgZXZlbnQpO1xuICAgIH07XG59XG5mdW5jdGlvbiBhdHRyKG5vZGUsIGF0dHJpYnV0ZSwgdmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT0gbnVsbClcbiAgICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlKTtcbiAgICBlbHNlXG4gICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZSwgdmFsdWUpO1xufVxuZnVuY3Rpb24gc2V0X2F0dHJpYnV0ZXMobm9kZSwgYXR0cmlidXRlcykge1xuICAgIGZvciAoY29uc3Qga2V5IGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgaWYgKGtleSA9PT0gJ3N0eWxlJykge1xuICAgICAgICAgICAgbm9kZS5zdHlsZS5jc3NUZXh0ID0gYXR0cmlidXRlc1trZXldO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGtleSBpbiBub2RlKSB7XG4gICAgICAgICAgICBub2RlW2tleV0gPSBhdHRyaWJ1dGVzW2tleV07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhdHRyKG5vZGUsIGtleSwgYXR0cmlidXRlc1trZXldKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIHNldF9zdmdfYXR0cmlidXRlcyhub2RlLCBhdHRyaWJ1dGVzKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXR0cmlidXRlcykge1xuICAgICAgICBhdHRyKG5vZGUsIGtleSwgYXR0cmlidXRlc1trZXldKTtcbiAgICB9XG59XG5mdW5jdGlvbiBzZXRfY3VzdG9tX2VsZW1lbnRfZGF0YShub2RlLCBwcm9wLCB2YWx1ZSkge1xuICAgIGlmIChwcm9wIGluIG5vZGUpIHtcbiAgICAgICAgbm9kZVtwcm9wXSA9IHZhbHVlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgYXR0cihub2RlLCBwcm9wLCB2YWx1ZSk7XG4gICAgfVxufVxuZnVuY3Rpb24geGxpbmtfYXR0cihub2RlLCBhdHRyaWJ1dGUsIHZhbHVlKSB7XG4gICAgbm9kZS5zZXRBdHRyaWJ1dGVOUygnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycsIGF0dHJpYnV0ZSwgdmFsdWUpO1xufVxuZnVuY3Rpb24gZ2V0X2JpbmRpbmdfZ3JvdXBfdmFsdWUoZ3JvdXApIHtcbiAgICBjb25zdCB2YWx1ZSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JvdXAubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgaWYgKGdyb3VwW2ldLmNoZWNrZWQpXG4gICAgICAgICAgICB2YWx1ZS5wdXNoKGdyb3VwW2ldLl9fdmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG59XG5mdW5jdGlvbiB0b19udW1iZXIodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09ICcnID8gdW5kZWZpbmVkIDogK3ZhbHVlO1xufVxuZnVuY3Rpb24gdGltZV9yYW5nZXNfdG9fYXJyYXkocmFuZ2VzKSB7XG4gICAgY29uc3QgYXJyYXkgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJhbmdlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBhcnJheS5wdXNoKHsgc3RhcnQ6IHJhbmdlcy5zdGFydChpKSwgZW5kOiByYW5nZXMuZW5kKGkpIH0pO1xuICAgIH1cbiAgICByZXR1cm4gYXJyYXk7XG59XG5mdW5jdGlvbiBjaGlsZHJlbihlbGVtZW50KSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20oZWxlbWVudC5jaGlsZE5vZGVzKTtcbn1cbmZ1bmN0aW9uIGNsYWltX2VsZW1lbnQobm9kZXMsIG5hbWUsIGF0dHJpYnV0ZXMsIHN2Zykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICBpZiAobm9kZS5ub2RlTmFtZSA9PT0gbmFtZSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBub2RlLmF0dHJpYnV0ZXMubGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhdHRyaWJ1dGUgPSBub2RlLmF0dHJpYnV0ZXNbal07XG4gICAgICAgICAgICAgICAgaWYgKCFhdHRyaWJ1dGVzW2F0dHJpYnV0ZS5uYW1lXSlcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlLm5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5vZGVzLnNwbGljZShpLCAxKVswXTsgLy8gVE9ETyBzdHJpcCB1bndhbnRlZCBhdHRyaWJ1dGVzXG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN2ZyA/IHN2Z19lbGVtZW50KG5hbWUpIDogZWxlbWVudChuYW1lKTtcbn1cbmZ1bmN0aW9uIGNsYWltX3RleHQobm9kZXMsIGRhdGEpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDMpIHtcbiAgICAgICAgICAgIG5vZGUuZGF0YSA9ICcnICsgZGF0YTtcbiAgICAgICAgICAgIHJldHVybiBub2Rlcy5zcGxpY2UoaSwgMSlbMF07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRleHQoZGF0YSk7XG59XG5mdW5jdGlvbiBjbGFpbV9zcGFjZShub2Rlcykge1xuICAgIHJldHVybiBjbGFpbV90ZXh0KG5vZGVzLCAnICcpO1xufVxuZnVuY3Rpb24gc2V0X2RhdGEodGV4dCwgZGF0YSkge1xuICAgIGRhdGEgPSAnJyArIGRhdGE7XG4gICAgaWYgKHRleHQuZGF0YSAhPT0gZGF0YSlcbiAgICAgICAgdGV4dC5kYXRhID0gZGF0YTtcbn1cbmZ1bmN0aW9uIHNldF9pbnB1dF92YWx1ZShpbnB1dCwgdmFsdWUpIHtcbiAgICBpZiAodmFsdWUgIT0gbnVsbCB8fCBpbnB1dC52YWx1ZSkge1xuICAgICAgICBpbnB1dC52YWx1ZSA9IHZhbHVlO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHNldF9pbnB1dF90eXBlKGlucHV0LCB0eXBlKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaW5wdXQudHlwZSA9IHR5cGU7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICB9XG59XG5mdW5jdGlvbiBzZXRfc3R5bGUobm9kZSwga2V5LCB2YWx1ZSwgaW1wb3J0YW50KSB7XG4gICAgbm9kZS5zdHlsZS5zZXRQcm9wZXJ0eShrZXksIHZhbHVlLCBpbXBvcnRhbnQgPyAnaW1wb3J0YW50JyA6ICcnKTtcbn1cbmZ1bmN0aW9uIHNlbGVjdF9vcHRpb24oc2VsZWN0LCB2YWx1ZSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0Lm9wdGlvbnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uID0gc2VsZWN0Lm9wdGlvbnNbaV07XG4gICAgICAgIGlmIChvcHRpb24uX192YWx1ZSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBzZWxlY3Rfb3B0aW9ucyhzZWxlY3QsIHZhbHVlKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3Qub3B0aW9ucy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBvcHRpb24gPSBzZWxlY3Qub3B0aW9uc1tpXTtcbiAgICAgICAgb3B0aW9uLnNlbGVjdGVkID0gfnZhbHVlLmluZGV4T2Yob3B0aW9uLl9fdmFsdWUpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHNlbGVjdF92YWx1ZShzZWxlY3QpIHtcbiAgICBjb25zdCBzZWxlY3RlZF9vcHRpb24gPSBzZWxlY3QucXVlcnlTZWxlY3RvcignOmNoZWNrZWQnKSB8fCBzZWxlY3Qub3B0aW9uc1swXTtcbiAgICByZXR1cm4gc2VsZWN0ZWRfb3B0aW9uICYmIHNlbGVjdGVkX29wdGlvbi5fX3ZhbHVlO1xufVxuZnVuY3Rpb24gc2VsZWN0X211bHRpcGxlX3ZhbHVlKHNlbGVjdCkge1xuICAgIHJldHVybiBbXS5tYXAuY2FsbChzZWxlY3QucXVlcnlTZWxlY3RvckFsbCgnOmNoZWNrZWQnKSwgb3B0aW9uID0+IG9wdGlvbi5fX3ZhbHVlKTtcbn1cbmZ1bmN0aW9uIGFkZF9yZXNpemVfbGlzdGVuZXIoZWxlbWVudCwgZm4pIHtcbiAgICBpZiAoZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5wb3NpdGlvbiA9PT0gJ3N0YXRpYycpIHtcbiAgICAgICAgZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG4gICAgfVxuICAgIGNvbnN0IG9iamVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29iamVjdCcpO1xuICAgIG9iamVjdC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2Rpc3BsYXk6IGJsb2NrOyBwb3NpdGlvbjogYWJzb2x1dGU7IHRvcDogMDsgbGVmdDogMDsgaGVpZ2h0OiAxMDAlOyB3aWR0aDogMTAwJTsgb3ZlcmZsb3c6IGhpZGRlbjsgcG9pbnRlci1ldmVudHM6IG5vbmU7IHotaW5kZXg6IC0xOycpO1xuICAgIG9iamVjdC50eXBlID0gJ3RleHQvaHRtbCc7XG4gICAgb2JqZWN0LnRhYkluZGV4ID0gLTE7XG4gICAgbGV0IHdpbjtcbiAgICBvYmplY3Qub25sb2FkID0gKCkgPT4ge1xuICAgICAgICB3aW4gPSBvYmplY3QuY29udGVudERvY3VtZW50LmRlZmF1bHRWaWV3O1xuICAgICAgICB3aW4uYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZm4pO1xuICAgIH07XG4gICAgaWYgKC9UcmlkZW50Ly50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKSB7XG4gICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQob2JqZWN0KTtcbiAgICAgICAgb2JqZWN0LmRhdGEgPSAnYWJvdXQ6YmxhbmsnO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgb2JqZWN0LmRhdGEgPSAnYWJvdXQ6YmxhbmsnO1xuICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKG9iamVjdCk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGNhbmNlbDogKCkgPT4ge1xuICAgICAgICAgICAgd2luICYmIHdpbi5yZW1vdmVFdmVudExpc3RlbmVyICYmIHdpbi5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmbik7XG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUNoaWxkKG9iamVjdCk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuZnVuY3Rpb24gdG9nZ2xlX2NsYXNzKGVsZW1lbnQsIG5hbWUsIHRvZ2dsZSkge1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0W3RvZ2dsZSA/ICdhZGQnIDogJ3JlbW92ZSddKG5hbWUpO1xufVxuZnVuY3Rpb24gY3VzdG9tX2V2ZW50KHR5cGUsIGRldGFpbCkge1xuICAgIGNvbnN0IGUgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcbiAgICBlLmluaXRDdXN0b21FdmVudCh0eXBlLCBmYWxzZSwgZmFsc2UsIGRldGFpbCk7XG4gICAgcmV0dXJuIGU7XG59XG5jbGFzcyBIdG1sVGFnIHtcbiAgICBjb25zdHJ1Y3RvcihodG1sLCBhbmNob3IgPSBudWxsKSB7XG4gICAgICAgIHRoaXMuZSA9IGVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aGlzLmEgPSBhbmNob3I7XG4gICAgICAgIHRoaXMudShodG1sKTtcbiAgICB9XG4gICAgbSh0YXJnZXQsIGFuY2hvciA9IG51bGwpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm4ubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGluc2VydCh0YXJnZXQsIHRoaXMubltpXSwgYW5jaG9yKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnQgPSB0YXJnZXQ7XG4gICAgfVxuICAgIHUoaHRtbCkge1xuICAgICAgICB0aGlzLmUuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgICAgdGhpcy5uID0gQXJyYXkuZnJvbSh0aGlzLmUuY2hpbGROb2Rlcyk7XG4gICAgfVxuICAgIHAoaHRtbCkge1xuICAgICAgICB0aGlzLmQoKTtcbiAgICAgICAgdGhpcy51KGh0bWwpO1xuICAgICAgICB0aGlzLm0odGhpcy50LCB0aGlzLmEpO1xuICAgIH1cbiAgICBkKCkge1xuICAgICAgICB0aGlzLm4uZm9yRWFjaChkZXRhY2gpO1xuICAgIH1cbn1cblxubGV0IHN0eWxlc2hlZXQ7XG5sZXQgYWN0aXZlID0gMDtcbmxldCBjdXJyZW50X3J1bGVzID0ge307XG4vLyBodHRwczovL2dpdGh1Yi5jb20vZGFya3NreWFwcC9zdHJpbmctaGFzaC9ibG9iL21hc3Rlci9pbmRleC5qc1xuZnVuY3Rpb24gaGFzaChzdHIpIHtcbiAgICBsZXQgaGFzaCA9IDUzODE7XG4gICAgbGV0IGkgPSBzdHIubGVuZ3RoO1xuICAgIHdoaWxlIChpLS0pXG4gICAgICAgIGhhc2ggPSAoKGhhc2ggPDwgNSkgLSBoYXNoKSBeIHN0ci5jaGFyQ29kZUF0KGkpO1xuICAgIHJldHVybiBoYXNoID4+PiAwO1xufVxuZnVuY3Rpb24gY3JlYXRlX3J1bGUobm9kZSwgYSwgYiwgZHVyYXRpb24sIGRlbGF5LCBlYXNlLCBmbiwgdWlkID0gMCkge1xuICAgIGNvbnN0IHN0ZXAgPSAxNi42NjYgLyBkdXJhdGlvbjtcbiAgICBsZXQga2V5ZnJhbWVzID0gJ3tcXG4nO1xuICAgIGZvciAobGV0IHAgPSAwOyBwIDw9IDE7IHAgKz0gc3RlcCkge1xuICAgICAgICBjb25zdCB0ID0gYSArIChiIC0gYSkgKiBlYXNlKHApO1xuICAgICAgICBrZXlmcmFtZXMgKz0gcCAqIDEwMCArIGAleyR7Zm4odCwgMSAtIHQpfX1cXG5gO1xuICAgIH1cbiAgICBjb25zdCBydWxlID0ga2V5ZnJhbWVzICsgYDEwMCUgeyR7Zm4oYiwgMSAtIGIpfX1cXG59YDtcbiAgICBjb25zdCBuYW1lID0gYF9fc3ZlbHRlXyR7aGFzaChydWxlKX1fJHt1aWR9YDtcbiAgICBpZiAoIWN1cnJlbnRfcnVsZXNbbmFtZV0pIHtcbiAgICAgICAgaWYgKCFzdHlsZXNoZWV0KSB7XG4gICAgICAgICAgICBjb25zdCBzdHlsZSA9IGVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICAgICAgICAgIHN0eWxlc2hlZXQgPSBzdHlsZS5zaGVldDtcbiAgICAgICAgfVxuICAgICAgICBjdXJyZW50X3J1bGVzW25hbWVdID0gdHJ1ZTtcbiAgICAgICAgc3R5bGVzaGVldC5pbnNlcnRSdWxlKGBAa2V5ZnJhbWVzICR7bmFtZX0gJHtydWxlfWAsIHN0eWxlc2hlZXQuY3NzUnVsZXMubGVuZ3RoKTtcbiAgICB9XG4gICAgY29uc3QgYW5pbWF0aW9uID0gbm9kZS5zdHlsZS5hbmltYXRpb24gfHwgJyc7XG4gICAgbm9kZS5zdHlsZS5hbmltYXRpb24gPSBgJHthbmltYXRpb24gPyBgJHthbmltYXRpb259LCBgIDogYGB9JHtuYW1lfSAke2R1cmF0aW9ufW1zIGxpbmVhciAke2RlbGF5fW1zIDEgYm90aGA7XG4gICAgYWN0aXZlICs9IDE7XG4gICAgcmV0dXJuIG5hbWU7XG59XG5mdW5jdGlvbiBkZWxldGVfcnVsZShub2RlLCBuYW1lKSB7XG4gICAgbm9kZS5zdHlsZS5hbmltYXRpb24gPSAobm9kZS5zdHlsZS5hbmltYXRpb24gfHwgJycpXG4gICAgICAgIC5zcGxpdCgnLCAnKVxuICAgICAgICAuZmlsdGVyKG5hbWVcbiAgICAgICAgPyBhbmltID0+IGFuaW0uaW5kZXhPZihuYW1lKSA8IDAgLy8gcmVtb3ZlIHNwZWNpZmljIGFuaW1hdGlvblxuICAgICAgICA6IGFuaW0gPT4gYW5pbS5pbmRleE9mKCdfX3N2ZWx0ZScpID09PSAtMSAvLyByZW1vdmUgYWxsIFN2ZWx0ZSBhbmltYXRpb25zXG4gICAgKVxuICAgICAgICAuam9pbignLCAnKTtcbiAgICBpZiAobmFtZSAmJiAhLS1hY3RpdmUpXG4gICAgICAgIGNsZWFyX3J1bGVzKCk7XG59XG5mdW5jdGlvbiBjbGVhcl9ydWxlcygpIHtcbiAgICByYWYoKCkgPT4ge1xuICAgICAgICBpZiAoYWN0aXZlKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBsZXQgaSA9IHN0eWxlc2hlZXQuY3NzUnVsZXMubGVuZ3RoO1xuICAgICAgICB3aGlsZSAoaS0tKVxuICAgICAgICAgICAgc3R5bGVzaGVldC5kZWxldGVSdWxlKGkpO1xuICAgICAgICBjdXJyZW50X3J1bGVzID0ge307XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZV9hbmltYXRpb24obm9kZSwgZnJvbSwgZm4sIHBhcmFtcykge1xuICAgIGlmICghZnJvbSlcbiAgICAgICAgcmV0dXJuIG5vb3A7XG4gICAgY29uc3QgdG8gPSBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGlmIChmcm9tLmxlZnQgPT09IHRvLmxlZnQgJiYgZnJvbS5yaWdodCA9PT0gdG8ucmlnaHQgJiYgZnJvbS50b3AgPT09IHRvLnRvcCAmJiBmcm9tLmJvdHRvbSA9PT0gdG8uYm90dG9tKVxuICAgICAgICByZXR1cm4gbm9vcDtcbiAgICBjb25zdCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSAzMDAsIGVhc2luZyA9IGlkZW50aXR5LCBcbiAgICAvLyBAdHMtaWdub3JlIHRvZG86IHNob3VsZCB0aGlzIGJlIHNlcGFyYXRlZCBmcm9tIGRlc3RydWN0dXJpbmc/IE9yIHN0YXJ0L2VuZCBhZGRlZCB0byBwdWJsaWMgYXBpIGFuZCBkb2N1bWVudGF0aW9uP1xuICAgIHN0YXJ0OiBzdGFydF90aW1lID0gbm93KCkgKyBkZWxheSwgXG4gICAgLy8gQHRzLWlnbm9yZSB0b2RvOlxuICAgIGVuZCA9IHN0YXJ0X3RpbWUgKyBkdXJhdGlvbiwgdGljayA9IG5vb3AsIGNzcyB9ID0gZm4obm9kZSwgeyBmcm9tLCB0byB9LCBwYXJhbXMpO1xuICAgIGxldCBydW5uaW5nID0gdHJ1ZTtcbiAgICBsZXQgc3RhcnRlZCA9IGZhbHNlO1xuICAgIGxldCBuYW1lO1xuICAgIGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgICAgICBpZiAoY3NzKSB7XG4gICAgICAgICAgICBuYW1lID0gY3JlYXRlX3J1bGUobm9kZSwgMCwgMSwgZHVyYXRpb24sIGRlbGF5LCBlYXNpbmcsIGNzcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFkZWxheSkge1xuICAgICAgICAgICAgc3RhcnRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gc3RvcCgpIHtcbiAgICAgICAgaWYgKGNzcylcbiAgICAgICAgICAgIGRlbGV0ZV9ydWxlKG5vZGUsIG5hbWUpO1xuICAgICAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgfVxuICAgIGxvb3Aobm93ID0+IHtcbiAgICAgICAgaWYgKCFzdGFydGVkICYmIG5vdyA+PSBzdGFydF90aW1lKSB7XG4gICAgICAgICAgICBzdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RhcnRlZCAmJiBub3cgPj0gZW5kKSB7XG4gICAgICAgICAgICB0aWNrKDEsIDApO1xuICAgICAgICAgICAgc3RvcCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghcnVubmluZykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzdGFydGVkKSB7XG4gICAgICAgICAgICBjb25zdCBwID0gbm93IC0gc3RhcnRfdGltZTtcbiAgICAgICAgICAgIGNvbnN0IHQgPSAwICsgMSAqIGVhc2luZyhwIC8gZHVyYXRpb24pO1xuICAgICAgICAgICAgdGljayh0LCAxIC0gdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gICAgc3RhcnQoKTtcbiAgICB0aWNrKDAsIDEpO1xuICAgIHJldHVybiBzdG9wO1xufVxuZnVuY3Rpb24gZml4X3Bvc2l0aW9uKG5vZGUpIHtcbiAgICBjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgaWYgKHN0eWxlLnBvc2l0aW9uICE9PSAnYWJzb2x1dGUnICYmIHN0eWxlLnBvc2l0aW9uICE9PSAnZml4ZWQnKSB7XG4gICAgICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gc3R5bGU7XG4gICAgICAgIGNvbnN0IGEgPSBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBub2RlLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgbm9kZS5zdHlsZS53aWR0aCA9IHdpZHRoO1xuICAgICAgICBub2RlLnN0eWxlLmhlaWdodCA9IGhlaWdodDtcbiAgICAgICAgYWRkX3RyYW5zZm9ybShub2RlLCBhKTtcbiAgICB9XG59XG5mdW5jdGlvbiBhZGRfdHJhbnNmb3JtKG5vZGUsIGEpIHtcbiAgICBjb25zdCBiID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBpZiAoYS5sZWZ0ICE9PSBiLmxlZnQgfHwgYS50b3AgIT09IGIudG9wKSB7XG4gICAgICAgIGNvbnN0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtID0gc3R5bGUudHJhbnNmb3JtID09PSAnbm9uZScgPyAnJyA6IHN0eWxlLnRyYW5zZm9ybTtcbiAgICAgICAgbm9kZS5zdHlsZS50cmFuc2Zvcm0gPSBgJHt0cmFuc2Zvcm19IHRyYW5zbGF0ZSgke2EubGVmdCAtIGIubGVmdH1weCwgJHthLnRvcCAtIGIudG9wfXB4KWA7XG4gICAgfVxufVxuXG5sZXQgY3VycmVudF9jb21wb25lbnQ7XG5mdW5jdGlvbiBzZXRfY3VycmVudF9jb21wb25lbnQoY29tcG9uZW50KSB7XG4gICAgY3VycmVudF9jb21wb25lbnQgPSBjb21wb25lbnQ7XG59XG5mdW5jdGlvbiBnZXRfY3VycmVudF9jb21wb25lbnQoKSB7XG4gICAgaWYgKCFjdXJyZW50X2NvbXBvbmVudClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBGdW5jdGlvbiBjYWxsZWQgb3V0c2lkZSBjb21wb25lbnQgaW5pdGlhbGl6YXRpb25gKTtcbiAgICByZXR1cm4gY3VycmVudF9jb21wb25lbnQ7XG59XG5mdW5jdGlvbiBiZWZvcmVVcGRhdGUoZm4pIHtcbiAgICBnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5iZWZvcmVfdXBkYXRlLnB1c2goZm4pO1xufVxuZnVuY3Rpb24gb25Nb3VudChmbikge1xuICAgIGdldF9jdXJyZW50X2NvbXBvbmVudCgpLiQkLm9uX21vdW50LnB1c2goZm4pO1xufVxuZnVuY3Rpb24gYWZ0ZXJVcGRhdGUoZm4pIHtcbiAgICBnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5hZnRlcl91cGRhdGUucHVzaChmbik7XG59XG5mdW5jdGlvbiBvbkRlc3Ryb3koZm4pIHtcbiAgICBnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5vbl9kZXN0cm95LnB1c2goZm4pO1xufVxuZnVuY3Rpb24gY3JlYXRlRXZlbnREaXNwYXRjaGVyKCkge1xuICAgIGNvbnN0IGNvbXBvbmVudCA9IGN1cnJlbnRfY29tcG9uZW50O1xuICAgIHJldHVybiAodHlwZSwgZGV0YWlsKSA9PiB7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrcyA9IGNvbXBvbmVudC4kJC5jYWxsYmFja3NbdHlwZV07XG4gICAgICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgICAgICAgIC8vIFRPRE8gYXJlIHRoZXJlIHNpdHVhdGlvbnMgd2hlcmUgZXZlbnRzIGNvdWxkIGJlIGRpc3BhdGNoZWRcbiAgICAgICAgICAgIC8vIGluIGEgc2VydmVyIChub24tRE9NKSBlbnZpcm9ubWVudD9cbiAgICAgICAgICAgIGNvbnN0IGV2ZW50ID0gY3VzdG9tX2V2ZW50KHR5cGUsIGRldGFpbCk7XG4gICAgICAgICAgICBjYWxsYmFja3Muc2xpY2UoKS5mb3JFYWNoKGZuID0+IHtcbiAgICAgICAgICAgICAgICBmbi5jYWxsKGNvbXBvbmVudCwgZXZlbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuZnVuY3Rpb24gc2V0Q29udGV4dChrZXksIGNvbnRleHQpIHtcbiAgICBnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5jb250ZXh0LnNldChrZXksIGNvbnRleHQpO1xufVxuZnVuY3Rpb24gZ2V0Q29udGV4dChrZXkpIHtcbiAgICByZXR1cm4gZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQuY29udGV4dC5nZXQoa2V5KTtcbn1cbi8vIFRPRE8gZmlndXJlIG91dCBpZiB3ZSBzdGlsbCB3YW50IHRvIHN1cHBvcnRcbi8vIHNob3J0aGFuZCBldmVudHMsIG9yIGlmIHdlIHdhbnQgdG8gaW1wbGVtZW50XG4vLyBhIHJlYWwgYnViYmxpbmcgbWVjaGFuaXNtXG5mdW5jdGlvbiBidWJibGUoY29tcG9uZW50LCBldmVudCkge1xuICAgIGNvbnN0IGNhbGxiYWNrcyA9IGNvbXBvbmVudC4kJC5jYWxsYmFja3NbZXZlbnQudHlwZV07XG4gICAgaWYgKGNhbGxiYWNrcykge1xuICAgICAgICBjYWxsYmFja3Muc2xpY2UoKS5mb3JFYWNoKGZuID0+IGZuKGV2ZW50KSk7XG4gICAgfVxufVxuXG5jb25zdCBkaXJ0eV9jb21wb25lbnRzID0gW107XG5jb25zdCBpbnRyb3MgPSB7IGVuYWJsZWQ6IGZhbHNlIH07XG5jb25zdCBiaW5kaW5nX2NhbGxiYWNrcyA9IFtdO1xuY29uc3QgcmVuZGVyX2NhbGxiYWNrcyA9IFtdO1xuY29uc3QgZmx1c2hfY2FsbGJhY2tzID0gW107XG5jb25zdCByZXNvbHZlZF9wcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG5sZXQgdXBkYXRlX3NjaGVkdWxlZCA9IGZhbHNlO1xuZnVuY3Rpb24gc2NoZWR1bGVfdXBkYXRlKCkge1xuICAgIGlmICghdXBkYXRlX3NjaGVkdWxlZCkge1xuICAgICAgICB1cGRhdGVfc2NoZWR1bGVkID0gdHJ1ZTtcbiAgICAgICAgcmVzb2x2ZWRfcHJvbWlzZS50aGVuKGZsdXNoKTtcbiAgICB9XG59XG5mdW5jdGlvbiB0aWNrKCkge1xuICAgIHNjaGVkdWxlX3VwZGF0ZSgpO1xuICAgIHJldHVybiByZXNvbHZlZF9wcm9taXNlO1xufVxuZnVuY3Rpb24gYWRkX3JlbmRlcl9jYWxsYmFjayhmbikge1xuICAgIHJlbmRlcl9jYWxsYmFja3MucHVzaChmbik7XG59XG5mdW5jdGlvbiBhZGRfZmx1c2hfY2FsbGJhY2soZm4pIHtcbiAgICBmbHVzaF9jYWxsYmFja3MucHVzaChmbik7XG59XG5mdW5jdGlvbiBmbHVzaCgpIHtcbiAgICBjb25zdCBzZWVuX2NhbGxiYWNrcyA9IG5ldyBTZXQoKTtcbiAgICBkbyB7XG4gICAgICAgIC8vIGZpcnN0LCBjYWxsIGJlZm9yZVVwZGF0ZSBmdW5jdGlvbnNcbiAgICAgICAgLy8gYW5kIHVwZGF0ZSBjb21wb25lbnRzXG4gICAgICAgIHdoaWxlIChkaXJ0eV9jb21wb25lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgY29tcG9uZW50ID0gZGlydHlfY29tcG9uZW50cy5zaGlmdCgpO1xuICAgICAgICAgICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KGNvbXBvbmVudCk7XG4gICAgICAgICAgICB1cGRhdGUoY29tcG9uZW50LiQkKTtcbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAoYmluZGluZ19jYWxsYmFja3MubGVuZ3RoKVxuICAgICAgICAgICAgYmluZGluZ19jYWxsYmFja3MucG9wKCkoKTtcbiAgICAgICAgLy8gdGhlbiwgb25jZSBjb21wb25lbnRzIGFyZSB1cGRhdGVkLCBjYWxsXG4gICAgICAgIC8vIGFmdGVyVXBkYXRlIGZ1bmN0aW9ucy4gVGhpcyBtYXkgY2F1c2VcbiAgICAgICAgLy8gc3Vic2VxdWVudCB1cGRhdGVzLi4uXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVuZGVyX2NhbGxiYWNrcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgY29uc3QgY2FsbGJhY2sgPSByZW5kZXJfY2FsbGJhY2tzW2ldO1xuICAgICAgICAgICAgaWYgKCFzZWVuX2NhbGxiYWNrcy5oYXMoY2FsbGJhY2spKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICAvLyAuLi5zbyBndWFyZCBhZ2FpbnN0IGluZmluaXRlIGxvb3BzXG4gICAgICAgICAgICAgICAgc2Vlbl9jYWxsYmFja3MuYWRkKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZW5kZXJfY2FsbGJhY2tzLmxlbmd0aCA9IDA7XG4gICAgfSB3aGlsZSAoZGlydHlfY29tcG9uZW50cy5sZW5ndGgpO1xuICAgIHdoaWxlIChmbHVzaF9jYWxsYmFja3MubGVuZ3RoKSB7XG4gICAgICAgIGZsdXNoX2NhbGxiYWNrcy5wb3AoKSgpO1xuICAgIH1cbiAgICB1cGRhdGVfc2NoZWR1bGVkID0gZmFsc2U7XG59XG5mdW5jdGlvbiB1cGRhdGUoJCQpIHtcbiAgICBpZiAoJCQuZnJhZ21lbnQpIHtcbiAgICAgICAgJCQudXBkYXRlKCQkLmRpcnR5KTtcbiAgICAgICAgcnVuX2FsbCgkJC5iZWZvcmVfdXBkYXRlKTtcbiAgICAgICAgJCQuZnJhZ21lbnQucCgkJC5kaXJ0eSwgJCQuY3R4KTtcbiAgICAgICAgJCQuZGlydHkgPSBudWxsO1xuICAgICAgICAkJC5hZnRlcl91cGRhdGUuZm9yRWFjaChhZGRfcmVuZGVyX2NhbGxiYWNrKTtcbiAgICB9XG59XG5cbmxldCBwcm9taXNlO1xuZnVuY3Rpb24gd2FpdCgpIHtcbiAgICBpZiAoIXByb21pc2UpIHtcbiAgICAgICAgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgcHJvbWlzZSA9IG51bGw7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcHJvbWlzZTtcbn1cbmZ1bmN0aW9uIGRpc3BhdGNoKG5vZGUsIGRpcmVjdGlvbiwga2luZCkge1xuICAgIG5vZGUuZGlzcGF0Y2hFdmVudChjdXN0b21fZXZlbnQoYCR7ZGlyZWN0aW9uID8gJ2ludHJvJyA6ICdvdXRybyd9JHtraW5kfWApKTtcbn1cbmNvbnN0IG91dHJvaW5nID0gbmV3IFNldCgpO1xubGV0IG91dHJvcztcbmZ1bmN0aW9uIGdyb3VwX291dHJvcygpIHtcbiAgICBvdXRyb3MgPSB7XG4gICAgICAgIHI6IDAsXG4gICAgICAgIGM6IFtdLFxuICAgICAgICBwOiBvdXRyb3MgLy8gcGFyZW50IGdyb3VwXG4gICAgfTtcbn1cbmZ1bmN0aW9uIGNoZWNrX291dHJvcygpIHtcbiAgICBpZiAoIW91dHJvcy5yKSB7XG4gICAgICAgIHJ1bl9hbGwob3V0cm9zLmMpO1xuICAgIH1cbiAgICBvdXRyb3MgPSBvdXRyb3MucDtcbn1cbmZ1bmN0aW9uIHRyYW5zaXRpb25faW4oYmxvY2ssIGxvY2FsKSB7XG4gICAgaWYgKGJsb2NrICYmIGJsb2NrLmkpIHtcbiAgICAgICAgb3V0cm9pbmcuZGVsZXRlKGJsb2NrKTtcbiAgICAgICAgYmxvY2suaShsb2NhbCk7XG4gICAgfVxufVxuZnVuY3Rpb24gdHJhbnNpdGlvbl9vdXQoYmxvY2ssIGxvY2FsLCBkZXRhY2gsIGNhbGxiYWNrKSB7XG4gICAgaWYgKGJsb2NrICYmIGJsb2NrLm8pIHtcbiAgICAgICAgaWYgKG91dHJvaW5nLmhhcyhibG9jaykpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIG91dHJvaW5nLmFkZChibG9jayk7XG4gICAgICAgIG91dHJvcy5jLnB1c2goKCkgPT4ge1xuICAgICAgICAgICAgb3V0cm9pbmcuZGVsZXRlKGJsb2NrKTtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGlmIChkZXRhY2gpXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLmQoMSk7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGJsb2NrLm8obG9jYWwpO1xuICAgIH1cbn1cbmNvbnN0IG51bGxfdHJhbnNpdGlvbiA9IHsgZHVyYXRpb246IDAgfTtcbmZ1bmN0aW9uIGNyZWF0ZV9pbl90cmFuc2l0aW9uKG5vZGUsIGZuLCBwYXJhbXMpIHtcbiAgICBsZXQgY29uZmlnID0gZm4obm9kZSwgcGFyYW1zKTtcbiAgICBsZXQgcnVubmluZyA9IGZhbHNlO1xuICAgIGxldCBhbmltYXRpb25fbmFtZTtcbiAgICBsZXQgdGFzaztcbiAgICBsZXQgdWlkID0gMDtcbiAgICBmdW5jdGlvbiBjbGVhbnVwKCkge1xuICAgICAgICBpZiAoYW5pbWF0aW9uX25hbWUpXG4gICAgICAgICAgICBkZWxldGVfcnVsZShub2RlLCBhbmltYXRpb25fbmFtZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdvKCkge1xuICAgICAgICBjb25zdCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSAzMDAsIGVhc2luZyA9IGlkZW50aXR5LCB0aWNrID0gbm9vcCwgY3NzIH0gPSBjb25maWcgfHwgbnVsbF90cmFuc2l0aW9uO1xuICAgICAgICBpZiAoY3NzKVxuICAgICAgICAgICAgYW5pbWF0aW9uX25hbWUgPSBjcmVhdGVfcnVsZShub2RlLCAwLCAxLCBkdXJhdGlvbiwgZGVsYXksIGVhc2luZywgY3NzLCB1aWQrKyk7XG4gICAgICAgIHRpY2soMCwgMSk7XG4gICAgICAgIGNvbnN0IHN0YXJ0X3RpbWUgPSBub3coKSArIGRlbGF5O1xuICAgICAgICBjb25zdCBlbmRfdGltZSA9IHN0YXJ0X3RpbWUgKyBkdXJhdGlvbjtcbiAgICAgICAgaWYgKHRhc2spXG4gICAgICAgICAgICB0YXNrLmFib3J0KCk7XG4gICAgICAgIHJ1bm5pbmcgPSB0cnVlO1xuICAgICAgICBhZGRfcmVuZGVyX2NhbGxiYWNrKCgpID0+IGRpc3BhdGNoKG5vZGUsIHRydWUsICdzdGFydCcpKTtcbiAgICAgICAgdGFzayA9IGxvb3Aobm93ID0+IHtcbiAgICAgICAgICAgIGlmIChydW5uaW5nKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5vdyA+PSBlbmRfdGltZSkge1xuICAgICAgICAgICAgICAgICAgICB0aWNrKDEsIDApO1xuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChub2RlLCB0cnVlLCAnZW5kJyk7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFudXAoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5vdyA+PSBzdGFydF90aW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHQgPSBlYXNpbmcoKG5vdyAtIHN0YXJ0X3RpbWUpIC8gZHVyYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICB0aWNrKHQsIDEgLSB0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcnVubmluZztcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGxldCBzdGFydGVkID0gZmFsc2U7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3RhcnQoKSB7XG4gICAgICAgICAgICBpZiAoc3RhcnRlZClcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBkZWxldGVfcnVsZShub2RlKTtcbiAgICAgICAgICAgIGlmIChpc19mdW5jdGlvbihjb25maWcpKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnID0gY29uZmlnKCk7XG4gICAgICAgICAgICAgICAgd2FpdCgpLnRoZW4oZ28pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZ28oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgaW52YWxpZGF0ZSgpIHtcbiAgICAgICAgICAgIHN0YXJ0ZWQgPSBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW5kKCkge1xuICAgICAgICAgICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgICAgICAgICAgICBjbGVhbnVwKCk7XG4gICAgICAgICAgICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZV9vdXRfdHJhbnNpdGlvbihub2RlLCBmbiwgcGFyYW1zKSB7XG4gICAgbGV0IGNvbmZpZyA9IGZuKG5vZGUsIHBhcmFtcyk7XG4gICAgbGV0IHJ1bm5pbmcgPSB0cnVlO1xuICAgIGxldCBhbmltYXRpb25fbmFtZTtcbiAgICBjb25zdCBncm91cCA9IG91dHJvcztcbiAgICBncm91cC5yICs9IDE7XG4gICAgZnVuY3Rpb24gZ28oKSB7XG4gICAgICAgIGNvbnN0IHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDMwMCwgZWFzaW5nID0gaWRlbnRpdHksIHRpY2sgPSBub29wLCBjc3MgfSA9IGNvbmZpZyB8fCBudWxsX3RyYW5zaXRpb247XG4gICAgICAgIGlmIChjc3MpXG4gICAgICAgICAgICBhbmltYXRpb25fbmFtZSA9IGNyZWF0ZV9ydWxlKG5vZGUsIDEsIDAsIGR1cmF0aW9uLCBkZWxheSwgZWFzaW5nLCBjc3MpO1xuICAgICAgICBjb25zdCBzdGFydF90aW1lID0gbm93KCkgKyBkZWxheTtcbiAgICAgICAgY29uc3QgZW5kX3RpbWUgPSBzdGFydF90aW1lICsgZHVyYXRpb247XG4gICAgICAgIGFkZF9yZW5kZXJfY2FsbGJhY2soKCkgPT4gZGlzcGF0Y2gobm9kZSwgZmFsc2UsICdzdGFydCcpKTtcbiAgICAgICAgbG9vcChub3cgPT4ge1xuICAgICAgICAgICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgICAgICAgICAgICBpZiAobm93ID49IGVuZF90aW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHRpY2soMCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKG5vZGUsIGZhbHNlLCAnZW5kJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghLS1ncm91cC5yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzIHdpbGwgcmVzdWx0IGluIGBlbmQoKWAgYmVpbmcgY2FsbGVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc28gd2UgZG9uJ3QgbmVlZCB0byBjbGVhbiB1cCBoZXJlXG4gICAgICAgICAgICAgICAgICAgICAgICBydW5fYWxsKGdyb3VwLmMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5vdyA+PSBzdGFydF90aW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHQgPSBlYXNpbmcoKG5vdyAtIHN0YXJ0X3RpbWUpIC8gZHVyYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICB0aWNrKDEgLSB0LCB0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcnVubmluZztcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChpc19mdW5jdGlvbihjb25maWcpKSB7XG4gICAgICAgIHdhaXQoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIGNvbmZpZyA9IGNvbmZpZygpO1xuICAgICAgICAgICAgZ28oKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBnbygpO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBlbmQocmVzZXQpIHtcbiAgICAgICAgICAgIGlmIChyZXNldCAmJiBjb25maWcudGljaykge1xuICAgICAgICAgICAgICAgIGNvbmZpZy50aWNrKDEsIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgICAgICAgICAgICBpZiAoYW5pbWF0aW9uX25hbWUpXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZV9ydWxlKG5vZGUsIGFuaW1hdGlvbl9uYW1lKTtcbiAgICAgICAgICAgICAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufVxuZnVuY3Rpb24gY3JlYXRlX2JpZGlyZWN0aW9uYWxfdHJhbnNpdGlvbihub2RlLCBmbiwgcGFyYW1zLCBpbnRybykge1xuICAgIGxldCBjb25maWcgPSBmbihub2RlLCBwYXJhbXMpO1xuICAgIGxldCB0ID0gaW50cm8gPyAwIDogMTtcbiAgICBsZXQgcnVubmluZ19wcm9ncmFtID0gbnVsbDtcbiAgICBsZXQgcGVuZGluZ19wcm9ncmFtID0gbnVsbDtcbiAgICBsZXQgYW5pbWF0aW9uX25hbWUgPSBudWxsO1xuICAgIGZ1bmN0aW9uIGNsZWFyX2FuaW1hdGlvbigpIHtcbiAgICAgICAgaWYgKGFuaW1hdGlvbl9uYW1lKVxuICAgICAgICAgICAgZGVsZXRlX3J1bGUobm9kZSwgYW5pbWF0aW9uX25hbWUpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpbml0KHByb2dyYW0sIGR1cmF0aW9uKSB7XG4gICAgICAgIGNvbnN0IGQgPSBwcm9ncmFtLmIgLSB0O1xuICAgICAgICBkdXJhdGlvbiAqPSBNYXRoLmFicyhkKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGE6IHQsXG4gICAgICAgICAgICBiOiBwcm9ncmFtLmIsXG4gICAgICAgICAgICBkLFxuICAgICAgICAgICAgZHVyYXRpb24sXG4gICAgICAgICAgICBzdGFydDogcHJvZ3JhbS5zdGFydCxcbiAgICAgICAgICAgIGVuZDogcHJvZ3JhbS5zdGFydCArIGR1cmF0aW9uLFxuICAgICAgICAgICAgZ3JvdXA6IHByb2dyYW0uZ3JvdXBcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ28oYikge1xuICAgICAgICBjb25zdCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSAzMDAsIGVhc2luZyA9IGlkZW50aXR5LCB0aWNrID0gbm9vcCwgY3NzIH0gPSBjb25maWcgfHwgbnVsbF90cmFuc2l0aW9uO1xuICAgICAgICBjb25zdCBwcm9ncmFtID0ge1xuICAgICAgICAgICAgc3RhcnQ6IG5vdygpICsgZGVsYXksXG4gICAgICAgICAgICBiXG4gICAgICAgIH07XG4gICAgICAgIGlmICghYikge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZSB0b2RvOiBpbXByb3ZlIHR5cGluZ3NcbiAgICAgICAgICAgIHByb2dyYW0uZ3JvdXAgPSBvdXRyb3M7XG4gICAgICAgICAgICBvdXRyb3MuciArPSAxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChydW5uaW5nX3Byb2dyYW0pIHtcbiAgICAgICAgICAgIHBlbmRpbmdfcHJvZ3JhbSA9IHByb2dyYW07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBpZiB0aGlzIGlzIGFuIGludHJvLCBhbmQgdGhlcmUncyBhIGRlbGF5LCB3ZSBuZWVkIHRvIGRvXG4gICAgICAgICAgICAvLyBhbiBpbml0aWFsIHRpY2sgYW5kL29yIGFwcGx5IENTUyBhbmltYXRpb24gaW1tZWRpYXRlbHlcbiAgICAgICAgICAgIGlmIChjc3MpIHtcbiAgICAgICAgICAgICAgICBjbGVhcl9hbmltYXRpb24oKTtcbiAgICAgICAgICAgICAgICBhbmltYXRpb25fbmFtZSA9IGNyZWF0ZV9ydWxlKG5vZGUsIHQsIGIsIGR1cmF0aW9uLCBkZWxheSwgZWFzaW5nLCBjc3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGIpXG4gICAgICAgICAgICAgICAgdGljaygwLCAxKTtcbiAgICAgICAgICAgIHJ1bm5pbmdfcHJvZ3JhbSA9IGluaXQocHJvZ3JhbSwgZHVyYXRpb24pO1xuICAgICAgICAgICAgYWRkX3JlbmRlcl9jYWxsYmFjaygoKSA9PiBkaXNwYXRjaChub2RlLCBiLCAnc3RhcnQnKSk7XG4gICAgICAgICAgICBsb29wKG5vdyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHBlbmRpbmdfcHJvZ3JhbSAmJiBub3cgPiBwZW5kaW5nX3Byb2dyYW0uc3RhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgcnVubmluZ19wcm9ncmFtID0gaW5pdChwZW5kaW5nX3Byb2dyYW0sIGR1cmF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgcGVuZGluZ19wcm9ncmFtID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2gobm9kZSwgcnVubmluZ19wcm9ncmFtLmIsICdzdGFydCcpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY3NzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhcl9hbmltYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbl9uYW1lID0gY3JlYXRlX3J1bGUobm9kZSwgdCwgcnVubmluZ19wcm9ncmFtLmIsIHJ1bm5pbmdfcHJvZ3JhbS5kdXJhdGlvbiwgMCwgZWFzaW5nLCBjb25maWcuY3NzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocnVubmluZ19wcm9ncmFtKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChub3cgPj0gcnVubmluZ19wcm9ncmFtLmVuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGljayh0ID0gcnVubmluZ19wcm9ncmFtLmIsIDEgLSB0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKG5vZGUsIHJ1bm5pbmdfcHJvZ3JhbS5iLCAnZW5kJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXBlbmRpbmdfcHJvZ3JhbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdlJ3JlIGRvbmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocnVubmluZ19wcm9ncmFtLmIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW50cm8g4oCUIHdlIGNhbiB0aWR5IHVwIGltbWVkaWF0ZWx5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyX2FuaW1hdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gb3V0cm8g4oCUIG5lZWRzIHRvIGJlIGNvb3JkaW5hdGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghLS1ydW5uaW5nX3Byb2dyYW0uZ3JvdXAucilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJ1bl9hbGwocnVubmluZ19wcm9ncmFtLmdyb3VwLmMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJ1bm5pbmdfcHJvZ3JhbSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAobm93ID49IHJ1bm5pbmdfcHJvZ3JhbS5zdGFydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcCA9IG5vdyAtIHJ1bm5pbmdfcHJvZ3JhbS5zdGFydDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHQgPSBydW5uaW5nX3Byb2dyYW0uYSArIHJ1bm5pbmdfcHJvZ3JhbS5kICogZWFzaW5nKHAgLyBydW5uaW5nX3Byb2dyYW0uZHVyYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGljayh0LCAxIC0gdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuICEhKHJ1bm5pbmdfcHJvZ3JhbSB8fCBwZW5kaW5nX3Byb2dyYW0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcnVuKGIpIHtcbiAgICAgICAgICAgIGlmIChpc19mdW5jdGlvbihjb25maWcpKSB7XG4gICAgICAgICAgICAgICAgd2FpdCgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZyA9IGNvbmZpZygpO1xuICAgICAgICAgICAgICAgICAgICBnbyhiKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGdvKGIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlbmQoKSB7XG4gICAgICAgICAgICBjbGVhcl9hbmltYXRpb24oKTtcbiAgICAgICAgICAgIHJ1bm5pbmdfcHJvZ3JhbSA9IHBlbmRpbmdfcHJvZ3JhbSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5mdW5jdGlvbiBoYW5kbGVfcHJvbWlzZShwcm9taXNlLCBpbmZvKSB7XG4gICAgY29uc3QgdG9rZW4gPSBpbmZvLnRva2VuID0ge307XG4gICAgZnVuY3Rpb24gdXBkYXRlKHR5cGUsIGluZGV4LCBrZXksIHZhbHVlKSB7XG4gICAgICAgIGlmIChpbmZvLnRva2VuICE9PSB0b2tlbilcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaW5mby5yZXNvbHZlZCA9IGtleSAmJiB7IFtrZXldOiB2YWx1ZSB9O1xuICAgICAgICBjb25zdCBjaGlsZF9jdHggPSBhc3NpZ24oYXNzaWduKHt9LCBpbmZvLmN0eCksIGluZm8ucmVzb2x2ZWQpO1xuICAgICAgICBjb25zdCBibG9jayA9IHR5cGUgJiYgKGluZm8uY3VycmVudCA9IHR5cGUpKGNoaWxkX2N0eCk7XG4gICAgICAgIGlmIChpbmZvLmJsb2NrKSB7XG4gICAgICAgICAgICBpZiAoaW5mby5ibG9ja3MpIHtcbiAgICAgICAgICAgICAgICBpbmZvLmJsb2Nrcy5mb3JFYWNoKChibG9jaywgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaSAhPT0gaW5kZXggJiYgYmxvY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwX291dHJvcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbl9vdXQoYmxvY2ssIDEsIDEsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmZvLmJsb2Nrc1tpXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrX291dHJvcygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbmZvLmJsb2NrLmQoMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBibG9jay5jKCk7XG4gICAgICAgICAgICB0cmFuc2l0aW9uX2luKGJsb2NrLCAxKTtcbiAgICAgICAgICAgIGJsb2NrLm0oaW5mby5tb3VudCgpLCBpbmZvLmFuY2hvcik7XG4gICAgICAgICAgICBmbHVzaCgpO1xuICAgICAgICB9XG4gICAgICAgIGluZm8uYmxvY2sgPSBibG9jaztcbiAgICAgICAgaWYgKGluZm8uYmxvY2tzKVxuICAgICAgICAgICAgaW5mby5ibG9ja3NbaW5kZXhdID0gYmxvY2s7XG4gICAgfVxuICAgIGlmIChpc19wcm9taXNlKHByb21pc2UpKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRfY29tcG9uZW50ID0gZ2V0X2N1cnJlbnRfY29tcG9uZW50KCk7XG4gICAgICAgIHByb21pc2UudGhlbih2YWx1ZSA9PiB7XG4gICAgICAgICAgICBzZXRfY3VycmVudF9jb21wb25lbnQoY3VycmVudF9jb21wb25lbnQpO1xuICAgICAgICAgICAgdXBkYXRlKGluZm8udGhlbiwgMSwgaW5mby52YWx1ZSwgdmFsdWUpO1xuICAgICAgICAgICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KG51bGwpO1xuICAgICAgICB9LCBlcnJvciA9PiB7XG4gICAgICAgICAgICBzZXRfY3VycmVudF9jb21wb25lbnQoY3VycmVudF9jb21wb25lbnQpO1xuICAgICAgICAgICAgdXBkYXRlKGluZm8uY2F0Y2gsIDIsIGluZm8uZXJyb3IsIGVycm9yKTtcbiAgICAgICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChudWxsKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIGlmIHdlIHByZXZpb3VzbHkgaGFkIGEgdGhlbi9jYXRjaCBibG9jaywgZGVzdHJveSBpdFxuICAgICAgICBpZiAoaW5mby5jdXJyZW50ICE9PSBpbmZvLnBlbmRpbmcpIHtcbiAgICAgICAgICAgIHVwZGF0ZShpbmZvLnBlbmRpbmcsIDApO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmIChpbmZvLmN1cnJlbnQgIT09IGluZm8udGhlbikge1xuICAgICAgICAgICAgdXBkYXRlKGluZm8udGhlbiwgMSwgaW5mby52YWx1ZSwgcHJvbWlzZSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpbmZvLnJlc29sdmVkID0geyBbaW5mby52YWx1ZV06IHByb21pc2UgfTtcbiAgICB9XG59XG5cbmNvbnN0IGdsb2JhbHMgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiBnbG9iYWwpO1xuXG5mdW5jdGlvbiBkZXN0cm95X2Jsb2NrKGJsb2NrLCBsb29rdXApIHtcbiAgICBibG9jay5kKDEpO1xuICAgIGxvb2t1cC5kZWxldGUoYmxvY2sua2V5KTtcbn1cbmZ1bmN0aW9uIG91dHJvX2FuZF9kZXN0cm95X2Jsb2NrKGJsb2NrLCBsb29rdXApIHtcbiAgICB0cmFuc2l0aW9uX291dChibG9jaywgMSwgMSwgKCkgPT4ge1xuICAgICAgICBsb29rdXAuZGVsZXRlKGJsb2NrLmtleSk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBmaXhfYW5kX2Rlc3Ryb3lfYmxvY2soYmxvY2ssIGxvb2t1cCkge1xuICAgIGJsb2NrLmYoKTtcbiAgICBkZXN0cm95X2Jsb2NrKGJsb2NrLCBsb29rdXApO1xufVxuZnVuY3Rpb24gZml4X2FuZF9vdXRyb19hbmRfZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKSB7XG4gICAgYmxvY2suZigpO1xuICAgIG91dHJvX2FuZF9kZXN0cm95X2Jsb2NrKGJsb2NrLCBsb29rdXApO1xufVxuZnVuY3Rpb24gdXBkYXRlX2tleWVkX2VhY2gob2xkX2Jsb2NrcywgY2hhbmdlZCwgZ2V0X2tleSwgZHluYW1pYywgY3R4LCBsaXN0LCBsb29rdXAsIG5vZGUsIGRlc3Ryb3ksIGNyZWF0ZV9lYWNoX2Jsb2NrLCBuZXh0LCBnZXRfY29udGV4dCkge1xuICAgIGxldCBvID0gb2xkX2Jsb2Nrcy5sZW5ndGg7XG4gICAgbGV0IG4gPSBsaXN0Lmxlbmd0aDtcbiAgICBsZXQgaSA9IG87XG4gICAgY29uc3Qgb2xkX2luZGV4ZXMgPSB7fTtcbiAgICB3aGlsZSAoaS0tKVxuICAgICAgICBvbGRfaW5kZXhlc1tvbGRfYmxvY2tzW2ldLmtleV0gPSBpO1xuICAgIGNvbnN0IG5ld19ibG9ja3MgPSBbXTtcbiAgICBjb25zdCBuZXdfbG9va3VwID0gbmV3IE1hcCgpO1xuICAgIGNvbnN0IGRlbHRhcyA9IG5ldyBNYXAoKTtcbiAgICBpID0gbjtcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGNvbnN0IGNoaWxkX2N0eCA9IGdldF9jb250ZXh0KGN0eCwgbGlzdCwgaSk7XG4gICAgICAgIGNvbnN0IGtleSA9IGdldF9rZXkoY2hpbGRfY3R4KTtcbiAgICAgICAgbGV0IGJsb2NrID0gbG9va3VwLmdldChrZXkpO1xuICAgICAgICBpZiAoIWJsb2NrKSB7XG4gICAgICAgICAgICBibG9jayA9IGNyZWF0ZV9lYWNoX2Jsb2NrKGtleSwgY2hpbGRfY3R4KTtcbiAgICAgICAgICAgIGJsb2NrLmMoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkeW5hbWljKSB7XG4gICAgICAgICAgICBibG9jay5wKGNoYW5nZWQsIGNoaWxkX2N0eCk7XG4gICAgICAgIH1cbiAgICAgICAgbmV3X2xvb2t1cC5zZXQoa2V5LCBuZXdfYmxvY2tzW2ldID0gYmxvY2spO1xuICAgICAgICBpZiAoa2V5IGluIG9sZF9pbmRleGVzKVxuICAgICAgICAgICAgZGVsdGFzLnNldChrZXksIE1hdGguYWJzKGkgLSBvbGRfaW5kZXhlc1trZXldKSk7XG4gICAgfVxuICAgIGNvbnN0IHdpbGxfbW92ZSA9IG5ldyBTZXQoKTtcbiAgICBjb25zdCBkaWRfbW92ZSA9IG5ldyBTZXQoKTtcbiAgICBmdW5jdGlvbiBpbnNlcnQoYmxvY2spIHtcbiAgICAgICAgdHJhbnNpdGlvbl9pbihibG9jaywgMSk7XG4gICAgICAgIGJsb2NrLm0obm9kZSwgbmV4dCk7XG4gICAgICAgIGxvb2t1cC5zZXQoYmxvY2sua2V5LCBibG9jayk7XG4gICAgICAgIG5leHQgPSBibG9jay5maXJzdDtcbiAgICAgICAgbi0tO1xuICAgIH1cbiAgICB3aGlsZSAobyAmJiBuKSB7XG4gICAgICAgIGNvbnN0IG5ld19ibG9jayA9IG5ld19ibG9ja3NbbiAtIDFdO1xuICAgICAgICBjb25zdCBvbGRfYmxvY2sgPSBvbGRfYmxvY2tzW28gLSAxXTtcbiAgICAgICAgY29uc3QgbmV3X2tleSA9IG5ld19ibG9jay5rZXk7XG4gICAgICAgIGNvbnN0IG9sZF9rZXkgPSBvbGRfYmxvY2sua2V5O1xuICAgICAgICBpZiAobmV3X2Jsb2NrID09PSBvbGRfYmxvY2spIHtcbiAgICAgICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICAgICAgICAgIG5leHQgPSBuZXdfYmxvY2suZmlyc3Q7XG4gICAgICAgICAgICBvLS07XG4gICAgICAgICAgICBuLS07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIW5ld19sb29rdXAuaGFzKG9sZF9rZXkpKSB7XG4gICAgICAgICAgICAvLyByZW1vdmUgb2xkIGJsb2NrXG4gICAgICAgICAgICBkZXN0cm95KG9sZF9ibG9jaywgbG9va3VwKTtcbiAgICAgICAgICAgIG8tLTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghbG9va3VwLmhhcyhuZXdfa2V5KSB8fCB3aWxsX21vdmUuaGFzKG5ld19rZXkpKSB7XG4gICAgICAgICAgICBpbnNlcnQobmV3X2Jsb2NrKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkaWRfbW92ZS5oYXMob2xkX2tleSkpIHtcbiAgICAgICAgICAgIG8tLTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkZWx0YXMuZ2V0KG5ld19rZXkpID4gZGVsdGFzLmdldChvbGRfa2V5KSkge1xuICAgICAgICAgICAgZGlkX21vdmUuYWRkKG5ld19rZXkpO1xuICAgICAgICAgICAgaW5zZXJ0KG5ld19ibG9jayk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB3aWxsX21vdmUuYWRkKG9sZF9rZXkpO1xuICAgICAgICAgICAgby0tO1xuICAgICAgICB9XG4gICAgfVxuICAgIHdoaWxlIChvLS0pIHtcbiAgICAgICAgY29uc3Qgb2xkX2Jsb2NrID0gb2xkX2Jsb2Nrc1tvXTtcbiAgICAgICAgaWYgKCFuZXdfbG9va3VwLmhhcyhvbGRfYmxvY2sua2V5KSlcbiAgICAgICAgICAgIGRlc3Ryb3kob2xkX2Jsb2NrLCBsb29rdXApO1xuICAgIH1cbiAgICB3aGlsZSAobilcbiAgICAgICAgaW5zZXJ0KG5ld19ibG9ja3NbbiAtIDFdKTtcbiAgICByZXR1cm4gbmV3X2Jsb2Nrcztcbn1cbmZ1bmN0aW9uIG1lYXN1cmUoYmxvY2tzKSB7XG4gICAgY29uc3QgcmVjdHMgPSB7fTtcbiAgICBsZXQgaSA9IGJsb2Nrcy5sZW5ndGg7XG4gICAgd2hpbGUgKGktLSlcbiAgICAgICAgcmVjdHNbYmxvY2tzW2ldLmtleV0gPSBibG9ja3NbaV0ubm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICByZXR1cm4gcmVjdHM7XG59XG5cbmZ1bmN0aW9uIGdldF9zcHJlYWRfdXBkYXRlKGxldmVscywgdXBkYXRlcykge1xuICAgIGNvbnN0IHVwZGF0ZSA9IHt9O1xuICAgIGNvbnN0IHRvX251bGxfb3V0ID0ge307XG4gICAgY29uc3QgYWNjb3VudGVkX2ZvciA9IHsgJCRzY29wZTogMSB9O1xuICAgIGxldCBpID0gbGV2ZWxzLmxlbmd0aDtcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGNvbnN0IG8gPSBsZXZlbHNbaV07XG4gICAgICAgIGNvbnN0IG4gPSB1cGRhdGVzW2ldO1xuICAgICAgICBpZiAobikge1xuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gbykge1xuICAgICAgICAgICAgICAgIGlmICghKGtleSBpbiBuKSlcbiAgICAgICAgICAgICAgICAgICAgdG9fbnVsbF9vdXRba2V5XSA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBuKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFhY2NvdW50ZWRfZm9yW2tleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlW2tleV0gPSBuW2tleV07XG4gICAgICAgICAgICAgICAgICAgIGFjY291bnRlZF9mb3Jba2V5XSA9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV2ZWxzW2ldID0gbjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIG8pIHtcbiAgICAgICAgICAgICAgICBhY2NvdW50ZWRfZm9yW2tleV0gPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGZvciAoY29uc3Qga2V5IGluIHRvX251bGxfb3V0KSB7XG4gICAgICAgIGlmICghKGtleSBpbiB1cGRhdGUpKVxuICAgICAgICAgICAgdXBkYXRlW2tleV0gPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiB1cGRhdGU7XG59XG5mdW5jdGlvbiBnZXRfc3ByZWFkX29iamVjdChzcHJlYWRfcHJvcHMpIHtcbiAgICByZXR1cm4gdHlwZW9mIHNwcmVhZF9wcm9wcyA9PT0gJ29iamVjdCcgJiYgc3ByZWFkX3Byb3BzICE9PSBudWxsID8gc3ByZWFkX3Byb3BzIDoge307XG59XG5cbmNvbnN0IGludmFsaWRfYXR0cmlidXRlX25hbWVfY2hhcmFjdGVyID0gL1tcXHMnXCI+Lz1cXHV7RkREMH0tXFx1e0ZERUZ9XFx1e0ZGRkV9XFx1e0ZGRkZ9XFx1ezFGRkZFfVxcdXsxRkZGRn1cXHV7MkZGRkV9XFx1ezJGRkZGfVxcdXszRkZGRX1cXHV7M0ZGRkZ9XFx1ezRGRkZFfVxcdXs0RkZGRn1cXHV7NUZGRkV9XFx1ezVGRkZGfVxcdXs2RkZGRX1cXHV7NkZGRkZ9XFx1ezdGRkZFfVxcdXs3RkZGRn1cXHV7OEZGRkV9XFx1ezhGRkZGfVxcdXs5RkZGRX1cXHV7OUZGRkZ9XFx1e0FGRkZFfVxcdXtBRkZGRn1cXHV7QkZGRkV9XFx1e0JGRkZGfVxcdXtDRkZGRX1cXHV7Q0ZGRkZ9XFx1e0RGRkZFfVxcdXtERkZGRn1cXHV7RUZGRkV9XFx1e0VGRkZGfVxcdXtGRkZGRX1cXHV7RkZGRkZ9XFx1ezEwRkZGRX1cXHV7MTBGRkZGfV0vdTtcbi8vIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL3N5bnRheC5odG1sI2F0dHJpYnV0ZXMtMlxuLy8gaHR0cHM6Ly9pbmZyYS5zcGVjLndoYXR3Zy5vcmcvI25vbmNoYXJhY3RlclxuZnVuY3Rpb24gc3ByZWFkKGFyZ3MpIHtcbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gT2JqZWN0LmFzc2lnbih7fSwgLi4uYXJncyk7XG4gICAgbGV0IHN0ciA9ICcnO1xuICAgIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgICAgIGlmIChpbnZhbGlkX2F0dHJpYnV0ZV9uYW1lX2NoYXJhY3Rlci50ZXN0KG5hbWUpKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGF0dHJpYnV0ZXNbbmFtZV07XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBpZiAodmFsdWUgPT09IHRydWUpXG4gICAgICAgICAgICBzdHIgKz0gXCIgXCIgKyBuYW1lO1xuICAgICAgICBjb25zdCBlc2NhcGVkID0gU3RyaW5nKHZhbHVlKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1wiL2csICcmIzM0OycpXG4gICAgICAgICAgICAucmVwbGFjZSgvJy9nLCAnJiMzOTsnKTtcbiAgICAgICAgc3RyICs9IFwiIFwiICsgbmFtZSArIFwiPVwiICsgSlNPTi5zdHJpbmdpZnkoZXNjYXBlZCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHN0cjtcbn1cbmNvbnN0IGVzY2FwZWQgPSB7XG4gICAgJ1wiJzogJyZxdW90OycsXG4gICAgXCInXCI6ICcmIzM5OycsXG4gICAgJyYnOiAnJmFtcDsnLFxuICAgICc8JzogJyZsdDsnLFxuICAgICc+JzogJyZndDsnXG59O1xuZnVuY3Rpb24gZXNjYXBlKGh0bWwpIHtcbiAgICByZXR1cm4gU3RyaW5nKGh0bWwpLnJlcGxhY2UoL1tcIicmPD5dL2csIG1hdGNoID0+IGVzY2FwZWRbbWF0Y2hdKTtcbn1cbmZ1bmN0aW9uIGVhY2goaXRlbXMsIGZuKSB7XG4gICAgbGV0IHN0ciA9ICcnO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgc3RyICs9IGZuKGl0ZW1zW2ldLCBpKTtcbiAgICB9XG4gICAgcmV0dXJuIHN0cjtcbn1cbmNvbnN0IG1pc3NpbmdfY29tcG9uZW50ID0ge1xuICAgICQkcmVuZGVyOiAoKSA9PiAnJ1xufTtcbmZ1bmN0aW9uIHZhbGlkYXRlX2NvbXBvbmVudChjb21wb25lbnQsIG5hbWUpIHtcbiAgICBpZiAoIWNvbXBvbmVudCB8fCAhY29tcG9uZW50LiQkcmVuZGVyKSB7XG4gICAgICAgIGlmIChuYW1lID09PSAnc3ZlbHRlOmNvbXBvbmVudCcpXG4gICAgICAgICAgICBuYW1lICs9ICcgdGhpcz17Li4ufSc7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgPCR7bmFtZX0+IGlzIG5vdCBhIHZhbGlkIFNTUiBjb21wb25lbnQuIFlvdSBtYXkgbmVlZCB0byByZXZpZXcgeW91ciBidWlsZCBjb25maWcgdG8gZW5zdXJlIHRoYXQgZGVwZW5kZW5jaWVzIGFyZSBjb21waWxlZCwgcmF0aGVyIHRoYW4gaW1wb3J0ZWQgYXMgcHJlLWNvbXBpbGVkIG1vZHVsZXNgKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbXBvbmVudDtcbn1cbmZ1bmN0aW9uIGRlYnVnKGZpbGUsIGxpbmUsIGNvbHVtbiwgdmFsdWVzKSB7XG4gICAgY29uc29sZS5sb2coYHtAZGVidWd9ICR7ZmlsZSA/IGZpbGUgKyAnICcgOiAnJ30oJHtsaW5lfToke2NvbHVtbn0pYCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICAgIGNvbnNvbGUubG9nKHZhbHVlcyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICAgIHJldHVybiAnJztcbn1cbmxldCBvbl9kZXN0cm95O1xuZnVuY3Rpb24gY3JlYXRlX3Nzcl9jb21wb25lbnQoZm4pIHtcbiAgICBmdW5jdGlvbiAkJHJlbmRlcihyZXN1bHQsIHByb3BzLCBiaW5kaW5ncywgc2xvdHMpIHtcbiAgICAgICAgY29uc3QgcGFyZW50X2NvbXBvbmVudCA9IGN1cnJlbnRfY29tcG9uZW50O1xuICAgICAgICBjb25zdCAkJCA9IHtcbiAgICAgICAgICAgIG9uX2Rlc3Ryb3ksXG4gICAgICAgICAgICBjb250ZXh0OiBuZXcgTWFwKHBhcmVudF9jb21wb25lbnQgPyBwYXJlbnRfY29tcG9uZW50LiQkLmNvbnRleHQgOiBbXSksXG4gICAgICAgICAgICAvLyB0aGVzZSB3aWxsIGJlIGltbWVkaWF0ZWx5IGRpc2NhcmRlZFxuICAgICAgICAgICAgb25fbW91bnQ6IFtdLFxuICAgICAgICAgICAgYmVmb3JlX3VwZGF0ZTogW10sXG4gICAgICAgICAgICBhZnRlcl91cGRhdGU6IFtdLFxuICAgICAgICAgICAgY2FsbGJhY2tzOiBibGFua19vYmplY3QoKVxuICAgICAgICB9O1xuICAgICAgICBzZXRfY3VycmVudF9jb21wb25lbnQoeyAkJCB9KTtcbiAgICAgICAgY29uc3QgaHRtbCA9IGZuKHJlc3VsdCwgcHJvcHMsIGJpbmRpbmdzLCBzbG90cyk7XG4gICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChwYXJlbnRfY29tcG9uZW50KTtcbiAgICAgICAgcmV0dXJuIGh0bWw7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIHJlbmRlcjogKHByb3BzID0ge30sIG9wdGlvbnMgPSB7fSkgPT4ge1xuICAgICAgICAgICAgb25fZGVzdHJveSA9IFtdO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0geyBoZWFkOiAnJywgY3NzOiBuZXcgU2V0KCkgfTtcbiAgICAgICAgICAgIGNvbnN0IGh0bWwgPSAkJHJlbmRlcihyZXN1bHQsIHByb3BzLCB7fSwgb3B0aW9ucyk7XG4gICAgICAgICAgICBydW5fYWxsKG9uX2Rlc3Ryb3kpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBodG1sLFxuICAgICAgICAgICAgICAgIGNzczoge1xuICAgICAgICAgICAgICAgICAgICBjb2RlOiBBcnJheS5mcm9tKHJlc3VsdC5jc3MpLm1hcChjc3MgPT4gY3NzLmNvZGUpLmpvaW4oJ1xcbicpLFxuICAgICAgICAgICAgICAgICAgICBtYXA6IG51bGwgLy8gVE9ET1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgaGVhZDogcmVzdWx0LmhlYWRcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG4gICAgICAgICQkcmVuZGVyXG4gICAgfTtcbn1cbmZ1bmN0aW9uIGFkZF9hdHRyaWJ1dGUobmFtZSwgdmFsdWUsIGJvb2xlYW4pIHtcbiAgICBpZiAodmFsdWUgPT0gbnVsbCB8fCAoYm9vbGVhbiAmJiAhdmFsdWUpKVxuICAgICAgICByZXR1cm4gJyc7XG4gICAgcmV0dXJuIGAgJHtuYW1lfSR7dmFsdWUgPT09IHRydWUgPyAnJyA6IGA9JHt0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnID8gSlNPTi5zdHJpbmdpZnkoZXNjYXBlKHZhbHVlKSkgOiBgXCIke3ZhbHVlfVwiYH1gfWA7XG59XG5mdW5jdGlvbiBhZGRfY2xhc3NlcyhjbGFzc2VzKSB7XG4gICAgcmV0dXJuIGNsYXNzZXMgPyBgIGNsYXNzPVwiJHtjbGFzc2VzfVwiYCA6IGBgO1xufVxuXG5mdW5jdGlvbiBiaW5kKGNvbXBvbmVudCwgbmFtZSwgY2FsbGJhY2spIHtcbiAgICBpZiAoY29tcG9uZW50LiQkLnByb3BzLmluZGV4T2YobmFtZSkgPT09IC0xKVxuICAgICAgICByZXR1cm47XG4gICAgY29tcG9uZW50LiQkLmJvdW5kW25hbWVdID0gY2FsbGJhY2s7XG4gICAgY2FsbGJhY2soY29tcG9uZW50LiQkLmN0eFtuYW1lXSk7XG59XG5mdW5jdGlvbiBtb3VudF9jb21wb25lbnQoY29tcG9uZW50LCB0YXJnZXQsIGFuY2hvcikge1xuICAgIGNvbnN0IHsgZnJhZ21lbnQsIG9uX21vdW50LCBvbl9kZXN0cm95LCBhZnRlcl91cGRhdGUgfSA9IGNvbXBvbmVudC4kJDtcbiAgICBmcmFnbWVudC5tKHRhcmdldCwgYW5jaG9yKTtcbiAgICAvLyBvbk1vdW50IGhhcHBlbnMgYmVmb3JlIHRoZSBpbml0aWFsIGFmdGVyVXBkYXRlXG4gICAgYWRkX3JlbmRlcl9jYWxsYmFjaygoKSA9PiB7XG4gICAgICAgIGNvbnN0IG5ld19vbl9kZXN0cm95ID0gb25fbW91bnQubWFwKHJ1bikuZmlsdGVyKGlzX2Z1bmN0aW9uKTtcbiAgICAgICAgaWYgKG9uX2Rlc3Ryb3kpIHtcbiAgICAgICAgICAgIG9uX2Rlc3Ryb3kucHVzaCguLi5uZXdfb25fZGVzdHJveSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBFZGdlIGNhc2UgLSBjb21wb25lbnQgd2FzIGRlc3Ryb3llZCBpbW1lZGlhdGVseSxcbiAgICAgICAgICAgIC8vIG1vc3QgbGlrZWx5IGFzIGEgcmVzdWx0IG9mIGEgYmluZGluZyBpbml0aWFsaXNpbmdcbiAgICAgICAgICAgIHJ1bl9hbGwobmV3X29uX2Rlc3Ryb3kpO1xuICAgICAgICB9XG4gICAgICAgIGNvbXBvbmVudC4kJC5vbl9tb3VudCA9IFtdO1xuICAgIH0pO1xuICAgIGFmdGVyX3VwZGF0ZS5mb3JFYWNoKGFkZF9yZW5kZXJfY2FsbGJhY2spO1xufVxuZnVuY3Rpb24gZGVzdHJveV9jb21wb25lbnQoY29tcG9uZW50LCBkZXRhY2hpbmcpIHtcbiAgICBpZiAoY29tcG9uZW50LiQkLmZyYWdtZW50KSB7XG4gICAgICAgIHJ1bl9hbGwoY29tcG9uZW50LiQkLm9uX2Rlc3Ryb3kpO1xuICAgICAgICBjb21wb25lbnQuJCQuZnJhZ21lbnQuZChkZXRhY2hpbmcpO1xuICAgICAgICAvLyBUT0RPIG51bGwgb3V0IG90aGVyIHJlZnMsIGluY2x1ZGluZyBjb21wb25lbnQuJCQgKGJ1dCBuZWVkIHRvXG4gICAgICAgIC8vIHByZXNlcnZlIGZpbmFsIHN0YXRlPylcbiAgICAgICAgY29tcG9uZW50LiQkLm9uX2Rlc3Ryb3kgPSBjb21wb25lbnQuJCQuZnJhZ21lbnQgPSBudWxsO1xuICAgICAgICBjb21wb25lbnQuJCQuY3R4ID0ge307XG4gICAgfVxufVxuZnVuY3Rpb24gbWFrZV9kaXJ0eShjb21wb25lbnQsIGtleSkge1xuICAgIGlmICghY29tcG9uZW50LiQkLmRpcnR5KSB7XG4gICAgICAgIGRpcnR5X2NvbXBvbmVudHMucHVzaChjb21wb25lbnQpO1xuICAgICAgICBzY2hlZHVsZV91cGRhdGUoKTtcbiAgICAgICAgY29tcG9uZW50LiQkLmRpcnR5ID0gYmxhbmtfb2JqZWN0KCk7XG4gICAgfVxuICAgIGNvbXBvbmVudC4kJC5kaXJ0eVtrZXldID0gdHJ1ZTtcbn1cbmZ1bmN0aW9uIGluaXQoY29tcG9uZW50LCBvcHRpb25zLCBpbnN0YW5jZSwgY3JlYXRlX2ZyYWdtZW50LCBub3RfZXF1YWwsIHByb3BfbmFtZXMpIHtcbiAgICBjb25zdCBwYXJlbnRfY29tcG9uZW50ID0gY3VycmVudF9jb21wb25lbnQ7XG4gICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KGNvbXBvbmVudCk7XG4gICAgY29uc3QgcHJvcHMgPSBvcHRpb25zLnByb3BzIHx8IHt9O1xuICAgIGNvbnN0ICQkID0gY29tcG9uZW50LiQkID0ge1xuICAgICAgICBmcmFnbWVudDogbnVsbCxcbiAgICAgICAgY3R4OiBudWxsLFxuICAgICAgICAvLyBzdGF0ZVxuICAgICAgICBwcm9wczogcHJvcF9uYW1lcyxcbiAgICAgICAgdXBkYXRlOiBub29wLFxuICAgICAgICBub3RfZXF1YWwsXG4gICAgICAgIGJvdW5kOiBibGFua19vYmplY3QoKSxcbiAgICAgICAgLy8gbGlmZWN5Y2xlXG4gICAgICAgIG9uX21vdW50OiBbXSxcbiAgICAgICAgb25fZGVzdHJveTogW10sXG4gICAgICAgIGJlZm9yZV91cGRhdGU6IFtdLFxuICAgICAgICBhZnRlcl91cGRhdGU6IFtdLFxuICAgICAgICBjb250ZXh0OiBuZXcgTWFwKHBhcmVudF9jb21wb25lbnQgPyBwYXJlbnRfY29tcG9uZW50LiQkLmNvbnRleHQgOiBbXSksXG4gICAgICAgIC8vIGV2ZXJ5dGhpbmcgZWxzZVxuICAgICAgICBjYWxsYmFja3M6IGJsYW5rX29iamVjdCgpLFxuICAgICAgICBkaXJ0eTogbnVsbFxuICAgIH07XG4gICAgbGV0IHJlYWR5ID0gZmFsc2U7XG4gICAgJCQuY3R4ID0gaW5zdGFuY2VcbiAgICAgICAgPyBpbnN0YW5jZShjb21wb25lbnQsIHByb3BzLCAoa2V5LCByZXQsIHZhbHVlID0gcmV0KSA9PiB7XG4gICAgICAgICAgICBpZiAoJCQuY3R4ICYmIG5vdF9lcXVhbCgkJC5jdHhba2V5XSwgJCQuY3R4W2tleV0gPSB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoJCQuYm91bmRba2V5XSlcbiAgICAgICAgICAgICAgICAgICAgJCQuYm91bmRba2V5XSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKHJlYWR5KVxuICAgICAgICAgICAgICAgICAgICBtYWtlX2RpcnR5KGNvbXBvbmVudCwga2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH0pXG4gICAgICAgIDogcHJvcHM7XG4gICAgJCQudXBkYXRlKCk7XG4gICAgcmVhZHkgPSB0cnVlO1xuICAgIHJ1bl9hbGwoJCQuYmVmb3JlX3VwZGF0ZSk7XG4gICAgJCQuZnJhZ21lbnQgPSBjcmVhdGVfZnJhZ21lbnQoJCQuY3R4KTtcbiAgICBpZiAob3B0aW9ucy50YXJnZXQpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuaHlkcmF0ZSkge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1ub24tbnVsbC1hc3NlcnRpb25cbiAgICAgICAgICAgICQkLmZyYWdtZW50LmwoY2hpbGRyZW4ob3B0aW9ucy50YXJnZXQpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uXG4gICAgICAgICAgICAkJC5mcmFnbWVudC5jKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMuaW50cm8pXG4gICAgICAgICAgICB0cmFuc2l0aW9uX2luKGNvbXBvbmVudC4kJC5mcmFnbWVudCk7XG4gICAgICAgIG1vdW50X2NvbXBvbmVudChjb21wb25lbnQsIG9wdGlvbnMudGFyZ2V0LCBvcHRpb25zLmFuY2hvcik7XG4gICAgICAgIGZsdXNoKCk7XG4gICAgfVxuICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChwYXJlbnRfY29tcG9uZW50KTtcbn1cbmxldCBTdmVsdGVFbGVtZW50O1xuaWYgKHR5cGVvZiBIVE1MRWxlbWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBTdmVsdGVFbGVtZW50ID0gY2xhc3MgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgICAgIHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZSB0b2RvOiBpbXByb3ZlIHR5cGluZ3NcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMuJCQuc2xvdHRlZCkge1xuICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmUgdG9kbzogaW1wcm92ZSB0eXBpbmdzXG4gICAgICAgICAgICAgICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLiQkLnNsb3R0ZWRba2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKGF0dHIsIF9vbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXNbYXR0cl0gPSBuZXdWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICAkZGVzdHJveSgpIHtcbiAgICAgICAgICAgIGRlc3Ryb3lfY29tcG9uZW50KHRoaXMsIDEpO1xuICAgICAgICAgICAgdGhpcy4kZGVzdHJveSA9IG5vb3A7XG4gICAgICAgIH1cbiAgICAgICAgJG9uKHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAvLyBUT0RPIHNob3VsZCB0aGlzIGRlbGVnYXRlIHRvIGFkZEV2ZW50TGlzdGVuZXI/XG4gICAgICAgICAgICBjb25zdCBjYWxsYmFja3MgPSAodGhpcy4kJC5jYWxsYmFja3NbdHlwZV0gfHwgKHRoaXMuJCQuY2FsbGJhY2tzW3R5cGVdID0gW10pKTtcbiAgICAgICAgICAgIGNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBjYWxsYmFja3MuaW5kZXhPZihjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSlcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgICRzZXQoKSB7XG4gICAgICAgICAgICAvLyBvdmVycmlkZGVuIGJ5IGluc3RhbmNlLCBpZiBpdCBoYXMgcHJvcHNcbiAgICAgICAgfVxuICAgIH07XG59XG5jbGFzcyBTdmVsdGVDb21wb25lbnQge1xuICAgICRkZXN0cm95KCkge1xuICAgICAgICBkZXN0cm95X2NvbXBvbmVudCh0aGlzLCAxKTtcbiAgICAgICAgdGhpcy4kZGVzdHJveSA9IG5vb3A7XG4gICAgfVxuICAgICRvbih0eXBlLCBjYWxsYmFjaykge1xuICAgICAgICBjb25zdCBjYWxsYmFja3MgPSAodGhpcy4kJC5jYWxsYmFja3NbdHlwZV0gfHwgKHRoaXMuJCQuY2FsbGJhY2tzW3R5cGVdID0gW10pKTtcbiAgICAgICAgY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBjYWxsYmFja3MuaW5kZXhPZihjYWxsYmFjayk7XG4gICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKVxuICAgICAgICAgICAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICAkc2V0KCkge1xuICAgICAgICAvLyBvdmVycmlkZGVuIGJ5IGluc3RhbmNlLCBpZiBpdCBoYXMgcHJvcHNcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoX2Rldih0eXBlLCBkZXRhaWwpIHtcbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGN1c3RvbV9ldmVudCh0eXBlLCBkZXRhaWwpKTtcbn1cbmZ1bmN0aW9uIGFwcGVuZF9kZXYodGFyZ2V0LCBub2RlKSB7XG4gICAgZGlzcGF0Y2hfZGV2KFwiU3ZlbHRlRE9NSW5zZXJ0XCIsIHsgdGFyZ2V0LCBub2RlIH0pO1xuICAgIGFwcGVuZCh0YXJnZXQsIG5vZGUpO1xufVxuZnVuY3Rpb24gaW5zZXJ0X2Rldih0YXJnZXQsIG5vZGUsIGFuY2hvcikge1xuICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTUluc2VydFwiLCB7IHRhcmdldCwgbm9kZSwgYW5jaG9yIH0pO1xuICAgIGluc2VydCh0YXJnZXQsIG5vZGUsIGFuY2hvcik7XG59XG5mdW5jdGlvbiBkZXRhY2hfZGV2KG5vZGUpIHtcbiAgICBkaXNwYXRjaF9kZXYoXCJTdmVsdGVET01SZW1vdmVcIiwgeyBub2RlIH0pO1xuICAgIGRldGFjaChub2RlKTtcbn1cbmZ1bmN0aW9uIGRldGFjaF9iZXR3ZWVuX2RldihiZWZvcmUsIGFmdGVyKSB7XG4gICAgd2hpbGUgKGJlZm9yZS5uZXh0U2libGluZyAmJiBiZWZvcmUubmV4dFNpYmxpbmcgIT09IGFmdGVyKSB7XG4gICAgICAgIGRldGFjaF9kZXYoYmVmb3JlLm5leHRTaWJsaW5nKTtcbiAgICB9XG59XG5mdW5jdGlvbiBkZXRhY2hfYmVmb3JlX2RldihhZnRlcikge1xuICAgIHdoaWxlIChhZnRlci5wcmV2aW91c1NpYmxpbmcpIHtcbiAgICAgICAgZGV0YWNoX2RldihhZnRlci5wcmV2aW91c1NpYmxpbmcpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGRldGFjaF9hZnRlcl9kZXYoYmVmb3JlKSB7XG4gICAgd2hpbGUgKGJlZm9yZS5uZXh0U2libGluZykge1xuICAgICAgICBkZXRhY2hfZGV2KGJlZm9yZS5uZXh0U2libGluZyk7XG4gICAgfVxufVxuZnVuY3Rpb24gbGlzdGVuX2Rldihub2RlLCBldmVudCwgaGFuZGxlciwgb3B0aW9ucywgaGFzX3ByZXZlbnRfZGVmYXVsdCwgaGFzX3N0b3BfcHJvcGFnYXRpb24pIHtcbiAgICBjb25zdCBtb2RpZmllcnMgPSBvcHRpb25zID09PSB0cnVlID8gW1wiY2FwdHVyZVwiXSA6IG9wdGlvbnMgPyBBcnJheS5mcm9tKE9iamVjdC5rZXlzKG9wdGlvbnMpKSA6IFtdO1xuICAgIGlmIChoYXNfcHJldmVudF9kZWZhdWx0KVxuICAgICAgICBtb2RpZmllcnMucHVzaCgncHJldmVudERlZmF1bHQnKTtcbiAgICBpZiAoaGFzX3N0b3BfcHJvcGFnYXRpb24pXG4gICAgICAgIG1vZGlmaWVycy5wdXNoKCdzdG9wUHJvcGFnYXRpb24nKTtcbiAgICBkaXNwYXRjaF9kZXYoXCJTdmVsdGVET01BZGRFdmVudExpc3RlbmVyXCIsIHsgbm9kZSwgZXZlbnQsIGhhbmRsZXIsIG1vZGlmaWVycyB9KTtcbiAgICBjb25zdCBkaXNwb3NlID0gbGlzdGVuKG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBvcHRpb25zKTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBkaXNwYXRjaF9kZXYoXCJTdmVsdGVET01SZW1vdmVFdmVudExpc3RlbmVyXCIsIHsgbm9kZSwgZXZlbnQsIGhhbmRsZXIsIG1vZGlmaWVycyB9KTtcbiAgICAgICAgZGlzcG9zZSgpO1xuICAgIH07XG59XG5mdW5jdGlvbiBhdHRyX2Rldihub2RlLCBhdHRyaWJ1dGUsIHZhbHVlKSB7XG4gICAgYXR0cihub2RlLCBhdHRyaWJ1dGUsIHZhbHVlKTtcbiAgICBpZiAodmFsdWUgPT0gbnVsbClcbiAgICAgICAgZGlzcGF0Y2hfZGV2KFwiU3ZlbHRlRE9NUmVtb3ZlQXR0cmlidXRlXCIsIHsgbm9kZSwgYXR0cmlidXRlIH0pO1xuICAgIGVsc2VcbiAgICAgICAgZGlzcGF0Y2hfZGV2KFwiU3ZlbHRlRE9NU2V0QXR0cmlidXRlXCIsIHsgbm9kZSwgYXR0cmlidXRlLCB2YWx1ZSB9KTtcbn1cbmZ1bmN0aW9uIHByb3BfZGV2KG5vZGUsIHByb3BlcnR5LCB2YWx1ZSkge1xuICAgIG5vZGVbcHJvcGVydHldID0gdmFsdWU7XG4gICAgZGlzcGF0Y2hfZGV2KFwiU3ZlbHRlRE9NU2V0UHJvcGVydHlcIiwgeyBub2RlLCBwcm9wZXJ0eSwgdmFsdWUgfSk7XG59XG5mdW5jdGlvbiBkYXRhc2V0X2Rldihub2RlLCBwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgICBub2RlLmRhdGFzZXRbcHJvcGVydHldID0gdmFsdWU7XG4gICAgZGlzcGF0Y2hfZGV2KFwiU3ZlbHRlRE9NU2V0RGF0YXNldFwiLCB7IG5vZGUsIHByb3BlcnR5LCB2YWx1ZSB9KTtcbn1cbmZ1bmN0aW9uIHNldF9kYXRhX2Rldih0ZXh0LCBkYXRhKSB7XG4gICAgZGF0YSA9ICcnICsgZGF0YTtcbiAgICBpZiAodGV4dC5kYXRhID09PSBkYXRhKVxuICAgICAgICByZXR1cm47XG4gICAgZGlzcGF0Y2hfZGV2KFwiU3ZlbHRlRE9NU2V0RGF0YVwiLCB7IG5vZGU6IHRleHQsIGRhdGEgfSk7XG4gICAgdGV4dC5kYXRhID0gZGF0YTtcbn1cbmNsYXNzIFN2ZWx0ZUNvbXBvbmVudERldiBleHRlbmRzIFN2ZWx0ZUNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICBpZiAoIW9wdGlvbnMgfHwgKCFvcHRpb25zLnRhcmdldCAmJiAhb3B0aW9ucy4kJGlubGluZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJ3RhcmdldCcgaXMgYSByZXF1aXJlZCBvcHRpb25gKTtcbiAgICAgICAgfVxuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICAkZGVzdHJveSgpIHtcbiAgICAgICAgc3VwZXIuJGRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy4kZGVzdHJveSA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgQ29tcG9uZW50IHdhcyBhbHJlYWR5IGRlc3Ryb3llZGApOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgfTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IEh0bWxUYWcsIFN2ZWx0ZUNvbXBvbmVudCwgU3ZlbHRlQ29tcG9uZW50RGV2LCBTdmVsdGVFbGVtZW50LCBhZGRfYXR0cmlidXRlLCBhZGRfY2xhc3NlcywgYWRkX2ZsdXNoX2NhbGxiYWNrLCBhZGRfbG9jYXRpb24sIGFkZF9yZW5kZXJfY2FsbGJhY2ssIGFkZF9yZXNpemVfbGlzdGVuZXIsIGFkZF90cmFuc2Zvcm0sIGFmdGVyVXBkYXRlLCBhcHBlbmQsIGFwcGVuZF9kZXYsIGFzc2lnbiwgYXR0ciwgYXR0cl9kZXYsIGJlZm9yZVVwZGF0ZSwgYmluZCwgYmluZGluZ19jYWxsYmFja3MsIGJsYW5rX29iamVjdCwgYnViYmxlLCBjaGVja19vdXRyb3MsIGNoaWxkcmVuLCBjbGFpbV9lbGVtZW50LCBjbGFpbV9zcGFjZSwgY2xhaW1fdGV4dCwgY2xlYXJfbG9vcHMsIGNvbXBvbmVudF9zdWJzY3JpYmUsIGNyZWF0ZUV2ZW50RGlzcGF0Y2hlciwgY3JlYXRlX2FuaW1hdGlvbiwgY3JlYXRlX2JpZGlyZWN0aW9uYWxfdHJhbnNpdGlvbiwgY3JlYXRlX2luX3RyYW5zaXRpb24sIGNyZWF0ZV9vdXRfdHJhbnNpdGlvbiwgY3JlYXRlX3Nsb3QsIGNyZWF0ZV9zc3JfY29tcG9uZW50LCBjdXJyZW50X2NvbXBvbmVudCwgY3VzdG9tX2V2ZW50LCBkYXRhc2V0X2RldiwgZGVidWcsIGRlc3Ryb3lfYmxvY2ssIGRlc3Ryb3lfY29tcG9uZW50LCBkZXN0cm95X2VhY2gsIGRldGFjaCwgZGV0YWNoX2FmdGVyX2RldiwgZGV0YWNoX2JlZm9yZV9kZXYsIGRldGFjaF9iZXR3ZWVuX2RldiwgZGV0YWNoX2RldiwgZGlydHlfY29tcG9uZW50cywgZGlzcGF0Y2hfZGV2LCBlYWNoLCBlbGVtZW50LCBlbGVtZW50X2lzLCBlbXB0eSwgZXNjYXBlLCBlc2NhcGVkLCBleGNsdWRlX2ludGVybmFsX3Byb3BzLCBmaXhfYW5kX2Rlc3Ryb3lfYmxvY2ssIGZpeF9hbmRfb3V0cm9fYW5kX2Rlc3Ryb3lfYmxvY2ssIGZpeF9wb3NpdGlvbiwgZmx1c2gsIGdldENvbnRleHQsIGdldF9iaW5kaW5nX2dyb3VwX3ZhbHVlLCBnZXRfY3VycmVudF9jb21wb25lbnQsIGdldF9zbG90X2NoYW5nZXMsIGdldF9zbG90X2NvbnRleHQsIGdldF9zcHJlYWRfb2JqZWN0LCBnZXRfc3ByZWFkX3VwZGF0ZSwgZ2V0X3N0b3JlX3ZhbHVlLCBnbG9iYWxzLCBncm91cF9vdXRyb3MsIGhhbmRsZV9wcm9taXNlLCBpZGVudGl0eSwgaW5pdCwgaW5zZXJ0LCBpbnNlcnRfZGV2LCBpbnRyb3MsIGludmFsaWRfYXR0cmlidXRlX25hbWVfY2hhcmFjdGVyLCBpc19jbGllbnQsIGlzX2Z1bmN0aW9uLCBpc19wcm9taXNlLCBsaXN0ZW4sIGxpc3Rlbl9kZXYsIGxvb3AsIG1lYXN1cmUsIG1pc3NpbmdfY29tcG9uZW50LCBtb3VudF9jb21wb25lbnQsIG5vb3AsIG5vdF9lcXVhbCwgbm93LCBudWxsX3RvX2VtcHR5LCBvYmplY3Rfd2l0aG91dF9wcm9wZXJ0aWVzLCBvbkRlc3Ryb3ksIG9uTW91bnQsIG9uY2UsIG91dHJvX2FuZF9kZXN0cm95X2Jsb2NrLCBwcmV2ZW50X2RlZmF1bHQsIHByb3BfZGV2LCByYWYsIHJ1biwgcnVuX2FsbCwgc2FmZV9ub3RfZXF1YWwsIHNjaGVkdWxlX3VwZGF0ZSwgc2VsZWN0X211bHRpcGxlX3ZhbHVlLCBzZWxlY3Rfb3B0aW9uLCBzZWxlY3Rfb3B0aW9ucywgc2VsZWN0X3ZhbHVlLCBzZWxmLCBzZXRDb250ZXh0LCBzZXRfYXR0cmlidXRlcywgc2V0X2N1cnJlbnRfY29tcG9uZW50LCBzZXRfY3VzdG9tX2VsZW1lbnRfZGF0YSwgc2V0X2RhdGEsIHNldF9kYXRhX2Rldiwgc2V0X2lucHV0X3R5cGUsIHNldF9pbnB1dF92YWx1ZSwgc2V0X25vdywgc2V0X3JhZiwgc2V0X3N0b3JlX3ZhbHVlLCBzZXRfc3R5bGUsIHNldF9zdmdfYXR0cmlidXRlcywgc3BhY2UsIHNwcmVhZCwgc3RvcF9wcm9wYWdhdGlvbiwgc3Vic2NyaWJlLCBzdmdfZWxlbWVudCwgdGV4dCwgdGljaywgdGltZV9yYW5nZXNfdG9fYXJyYXksIHRvX251bWJlciwgdG9nZ2xlX2NsYXNzLCB0cmFuc2l0aW9uX2luLCB0cmFuc2l0aW9uX291dCwgdXBkYXRlX2tleWVkX2VhY2gsIHZhbGlkYXRlX2NvbXBvbmVudCwgdmFsaWRhdGVfc3RvcmUsIHhsaW5rX2F0dHIgfTtcbiIsIjxzY3JpcHQ+XG5leHBvcnQgbGV0IGNsYXNzTmFtZSA9IFwiZGVmYXVsdFwiO1xuZXhwb3J0IGxldCBkaXNhYmxlZCA9IGZhbHNlO1xuZXhwb3J0IGxldCBjb250ZW50VGV4dDtcbmV4cG9ydCBsZXQgY29udGVudENvbXBvbmVudDtcbmV4cG9ydCBsZXQgb25DbGljayA9ICgpID0+IHt9O1xuXG5leHBvcnQgbGV0IF9iYjtcbmxldCBjb250ZW50Q29tcG9uZW50Q29udGFpbmVyO1xuXG4kOntcblx0aWYoX2JiICYmIGNvbnRlbnRDb21wb25lbnRDb250YWluZXIgJiYgY29udGVudENvbXBvbmVudC5fY29tcG9uZW50KVxuXHRcdF9iYi5pbml0aWFsaXNlQ29tcG9uZW50KGNvbnRlbnRDb21wb25lbnQsIGNvbnRlbnRDb21wb25lbnRDb250YWluZXIpO1xufVxuXG5cbmNvbnN0IGNsaWNrSGFuZGxlciA9ICgpID0+IHtcblx0aWYob25DbGljaykgb25DbGljaygpO1xufVxuXG48L3NjcmlwdD5cblxuXG48YnV0dG9uIGNsYXNzPXtjbGFzc05hbWV9IHtkaXNhYmxlZH0gb246Y2xpY2s9e2NsaWNrSGFuZGxlcn0+XG4gICAgeyNpZiBjb250ZW50Q29tcG9uZW50ICYmIGNvbnRlbnRDb21wb25lbnQuX2NvbXBvbmVudH1cblx0PGRpdiBiaW5kOnRoaXM9e2NvbnRlbnRDb21wb25lbnRDb250YWluZXJ9PlxuXHQ8L2Rpdj5cbiAgICB7OmVsc2UgaWYgY29udGVudFRleHR9XG4gICAge2NvbnRlbnRUZXh0fVxuICAgIHs6ZWxzZX1cbiAgICA8c2xvdCAvPlxuICAgIHsvaWZ9XG48L2J1dHRvbj5cblxuXG48c3R5bGU+XG5cbi5kZWZhdWx0IHtcblx0Zm9udC1mYW1pbHk6IGluaGVyaXQ7XG5cdGZvbnQtc2l6ZTogaW5oZXJpdDtcblx0cGFkZGluZzogMC40ZW07XG5cdG1hcmdpbjogMCAwIDAuNWVtIDA7XG5cdGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG5cdGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XG5cdGJvcmRlci1yYWRpdXM6IDJweDtcblx0Y29sb3I6ICMzMzM7XG5cdGJhY2tncm91bmQtY29sb3I6ICNmNGY0ZjQ7XG5cdG91dGxpbmU6IG5vbmU7XG59XG5cbi5kZWZhdWx0OmFjdGl2ZSB7XG5cdGJhY2tncm91bmQtY29sb3I6ICNkZGQ7XG59XG5cbi5kZWZhdWx0OmZvY3VzIHtcblx0Ym9yZGVyLWNvbG9yOiAjNjY2O1xufVxuXG48L3N0eWxlPiIsIjxzY3JpcHQ+XG5cbmV4cG9ydCBsZXQgdmFsdWU9XCJcIjtcbmV4cG9ydCBsZXQgaGlkZVZhbHVlID0gZmFsc2U7XG5leHBvcnQgbGV0IGNsYXNzTmFtZSA9IFwiZGVmYXVsdFwiO1xuXG5leHBvcnQgbGV0IF9iYjtcblxubGV0IGFjdHVhbFZhbHVlID0gXCJcIjtcbiQ6IHtcblx0aWYoX2JiICYmIHZhbHVlLl9pc3N0YXRlKSB7XG5cdFx0X2JiLnN0b3JlLnN1YnNjcmliZShzID0+IHtcblx0XHRcdGFjdHVhbFZhbHVlID0gX2JiLnN0b3JlLmdldFZhbHVlKHMsIHZhbHVlKTtcblx0XHR9KTtcblx0fVxufVxuXG5jb25zdCBvbmNoYW5nZSA9IChldikgPT4ge1xuXHRpZihfYmIgJiYgdmFsdWUuX2lzc3RhdGUpIHtcblx0XHRfYmIuc3RvcmUuc2V0VmFsdWUodmFsdWUsIGV2LnRhcmdldC52YWx1ZSk7XG5cdH0gZWxzZSBpZighdmFsdWUuX2lzc3RhdGUpIHtcblx0XHRhY3R1YWxWYWx1ZSA9IGV2LnRhcmdldC52YWx1ZTtcblx0fVxufVxuXG48L3NjcmlwdD5cblxueyNpZiBoaWRlVmFsdWV9XG48aW5wdXQgY2xhc3M9e2NsYXNzTmFtZX0gXG5cdCAgIHR5cGU9XCJwYXNzd29yZFwiIFxuXHQgICB2YWx1ZT17YWN0dWFsVmFsdWV9IG9uOmNoYW5nZS8+XG57OmVsc2V9XG48aW5wdXQgY2xhc3M9e2NsYXNzTmFtZX0gdHlwZT1cInRleHRcIiB2YWx1ZT17YWN0dWFsVmFsdWV9Lz5cbnsvaWZ9XG5cbjxzdHlsZT5cbi5kZWZhdWx0IHtcbiAgICB3aWR0aDogMTAwJTtcblx0Zm9udC1mYW1pbHk6IGluaGVyaXQ7XG5cdGZvbnQtc2l6ZTogaW5oZXJpdDtcblx0cGFkZGluZzogMC40ZW07XG5cdG1hcmdpbjogMCAwIDAuNWVtIDA7XG5cdGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG5cdGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XG4gICAgYm9yZGVyLXJhZGl1czogMnB4O1xuICAgIHdpZHRoOiAxMDAlO1xufVxuXG4uZGVmYXVsdDpkaXNhYmxlZCB7XG5cdGNvbG9yOiAjY2NjO1xufVxuXG48L3N0eWxlPiIsIjxzY3JpcHQ+XG5leHBvcnQgbGV0IGNvbnRhaW5lckNsYXNzID0gXCJcIjtcbmV4cG9ydCBsZXQgZm9ybUNvbnRyb2xzID0gW107XG5cbmV4cG9ydCBsZXQgX2JiO1xuXG5sZXQgaHRtbEVsZW1lbnRzID0ge307XG5sZXQgbGFiZWxzID0ge307XG5cbiQgOiB7XG4gICAgbGV0IGNJbmRleCA9IDA7XG4gICAgZm9yKGxldCBjIG9mIGZvcm1Db250cm9scykge1xuICAgICAgICBsYWJlbHNbY0luZGV4XSA9IGMubGFiZWw7XG4gICAgICAgIGNJbmRleCsrO1xuICAgIH1cblxuICAgIGlmKF9iYiAmJiBodG1sRWxlbWVudHMpIHtcbiAgICAgICAgZm9yKGxldCBlbCBpbiBodG1sRWxlbWVudHMpIHtcbiAgICAgICAgICAgIF9iYi5pbml0aWFsaXNlQ29tcG9uZW50KFxuICAgICAgICAgICAgICAgIGZvcm1Db250cm9sc1tlbF0uY29udHJvbCxcbiAgICAgICAgICAgICAgICBodG1sRWxlbWVudHNbZWxdXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxufVxuXG48L3NjcmlwdD5cblxuPGRpdiBjbGFzcz1cImZvcm0tcm9vdCB7Y29udGFpbmVyQ2xhc3N9XCI+XG4gICAgeyNlYWNoIGZvcm1Db250cm9scyBhcyBjaGlsZCwgaW5kZXh9XG4gICAgPGRpdiBjbGFzcz1cImxhYmVsXCI+e2xhYmVsc1tpbmRleF19PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImNvbnRyb2xcIlxuICAgICAgICBiaW5kOnRoaXM9e2h0bWxFbGVtZW50c1tpbmRleF19PlxuICAgIDwvZGl2PlxuICAgIHsvZWFjaH1cbjwvZGl2PlxuXG48c3R5bGU+XG4uZm9ybS1yb290IHtcbiAgICBkaXNwbGF5OiBncmlkO1xuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogW2xhYmVsXSBhdXRvIFtjb250cm9sXSAxZnI7IC8qIFtvdmVyZmxvd10gYXV0bzsqL1xufVxuXG4ubGFiZWwge1xuICAgIGdyaWQtY29sdW1uLXN0YXJ0OiBsYWJlbDtcbiAgICBwYWRkaW5nOiA1cHggMTBweDtcbiAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xufVxuLmNvbnRyb2wge1xuICAgIGdyaWQtY29sdW1uLXN0YXJ0OiBjb250cm9sO1xuICAgIHBhZGRpbmc6IDVweCAxMHB4O1xufVxuLm92ZXJmbG93IHtcbiAgICBncmlkLWNvbHVtbi1zdGFydDogb3ZlcmZsb3c7XG59XG4uZnVsbC13aWR0aCB7XG4gICAgd2lkdGg6IDEwMCU7XG59XG48L3N0eWxlPiIsIjxzY3JpcHQ+XG5cbmltcG9ydCBUZXh0Ym94IGZyb20gXCIuL1RleHRib3guc3ZlbHRlXCI7XG5pbXBvcnQgRm9ybSBmcm9tIFwiLi9Gb3JtLnN2ZWx0ZVwiO1xuaW1wb3J0IEJ1dHRvbiBmcm9tIFwiLi9CdXR0b24uc3ZlbHRlXCI7XG5cbmV4cG9ydCBsZXQgdXNlcm5hbWVMYWJlbCA9IFwiVXNlcm5hbWVcIjtcbmV4cG9ydCBsZXQgcGFzc3dvcmRMYWJlbCA9IFwiUGFzc3dvcmRcIjtcbmV4cG9ydCBsZXQgbG9naW5CdXR0b25MYWJlbCA9IFwiTG9naW5cIjtcbmV4cG9ydCBsZXQgbG9naW5SZWRpcmVjdCA9IFwiXCI7XG5leHBvcnQgbGV0IGxvZ28gPSBcIlwiO1xuZXhwb3J0IGxldCBidXR0b25DbGFzcyA9IFwiXCI7XG5leHBvcnQgbGV0IGlucHV0Q2xhc3M9XCJcIlxuXG5leHBvcnQgbGV0IF9iYjtcblxubGV0IHVzZXJuYW1lID0gXCJcIjtcbmxldCBwYXNzd29yZCA9IFwiXCI7XG5sZXQgYnVzeSA9IGZhbHNlO1xubGV0IGluY29ycmVjdCA9IGZhbHNlO1xubGV0IF9sb2dvID0gXCJcIjtcbmxldCBfYnV0dG9uQ2xhc3MgPSBcIlwiO1xubGV0IF9pbnB1dENsYXNzID0gXCJcIjtcblxuJDoge1xuICAgIF9sb2dvID0gX2JiLnJlbGF0aXZlVXJsKGxvZ28pO1xuICAgIF9idXR0b25DbGFzcyA9IGJ1dHRvbkNsYXNzIHx8IFwiZGVmYXVsdC1idXR0b25cIjtcbiAgICBfaW5wdXRDbGFzcyA9IGlucHV0Q2xhc3MgfHwgXCJkZWZhdWx0LWlucHV0XCI7XG59XG5cbmNvbnN0IGxvZ2luID0gKCkgPT4ge1xuICAgIGJ1c3kgPSB0cnVlO1xuICAgIF9iYi5hcGkucG9zdChcIi9hcGkvYXV0aGVudGljYXRlXCIsIHt1c2VybmFtZSwgcGFzc3dvcmR9KVxuICAgIC50aGVuKHIgPT4ge1xuICAgICAgICBidXN5ID0gZmFsc2U7XG4gICAgICAgIGlmKHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgIHJldHVybiByLmpzb24oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGluY29ycmVjdCA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9KVxuICAgIC50aGVuKHVzZXIgPT4ge1xuICAgICAgICBpZih1c2VyKSB7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImJ1ZGliYXNlOnVzZXJcIiwgdXNlcik7XG4gICAgICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgICAgfVxuICAgIH0pXG59XG5cbjwvc2NyaXB0PlxuXG48ZGl2IGNsYXNzPVwicm9vdFwiPlxuXG4gICAgPGRpdiBjbGFzcz1cImNvbnRlbnRcIj5cblxuICAgICAgICB7I2lmIF9sb2dvfVxuICAgICAgICA8ZGl2IGNsYXNzPVwibG9nby1jb250YWluZXJcIj5cbiAgICAgICAgICAgIDxpbWcgc3JjPXtfbG9nb30gYWx0PVwibG9nb1wiLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHsvaWZ9XG5cbiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tcm9vdFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxhYmVsXCI+XG4gICAgICAgICAgICAgICAge3VzZXJuYW1lTGFiZWx9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250cm9sXCI+XG4gICAgICAgICAgICAgICAgPGlucHV0IGJpbmQ6dmFsdWU9e3VzZXJuYW1lfSB0eXBlPVwidGV4dFwiIGNsYXNzPXtfaW5wdXRDbGFzc30vPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGFiZWxcIj5cbiAgICAgICAgICAgICAgICB7cGFzc3dvcmRMYWJlbH1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRyb2xcIj5cbiAgICAgICAgICAgICAgICA8aW5wdXQgYmluZDp2YWx1ZT17cGFzc3dvcmR9IHR5cGU9XCJwYXNzd29yZFwiIGNsYXNzPXtfaW5wdXRDbGFzc30vPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJsb2dpbi1idXR0b24tY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8YnV0dG9uIGRpc2FibGVkPXtidXN5fSBcbiAgICAgICAgICAgICAgICAgICAgb246Y2xpY2s9e2xvZ2lufVxuICAgICAgICAgICAgICAgICAgICBjbGFzcz17X2J1dHRvbkNsYXNzfT5cbiAgICAgICAgICAgICAgICAgICAge2xvZ2luQnV0dG9uTGFiZWx9XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgeyNpZiBpbmNvcnJlY3R9XG4gICAgICAgIDxkaXYgY2xhc3M9XCJpbmNvcnJlY3QtZGV0YWlscy1wYW5lbFwiPlxuICAgICAgICAgICAgSW5jb3JyZWN0IHVzZXJuYW1lIG9yIHBhc3N3b3JkXG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7L2lmfVxuXG4gICAgPC9kaXY+XG5cbjwvZGl2PlxuXG48c3R5bGU+XG5cbi5yb290IHtcbiAgICBoZWlnaHQ6IDEwMCU7XG4gICAgZGlzcGxheTpncmlkO1xuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogW2xlZnRdIDFmciBbbWlkZGxlXSBhdXRvIFtyaWdodF0gMWZyO1xuICAgIGdyaWQtdGVtcGxhdGUtcm93czogW3RvcF0gMWZyIFtjZW50ZXJdIGF1dG8gW2JvdHRvbV0gMWZyO1xufVxuXG4uY29udGVudCB7XG4gICAgZ3JpZC1jb2x1bW4tc3RhcnQ6IG1pZGRsZTtcbiAgICBncmlkLXJvdy1zdGFydDogY2VudGVyO1xuICAgIHdpZHRoOiA0MDBweDtcbn1cblxuLmxvZ28tY29udGFpbmVyIHtcbiAgICBtYXJnaW4tYm90dG9tOiAyMHB4XG59XG5cbi5sb2dvLWNvbnRhaW5lciA+IGltZyB7XG4gICAgbWF4LXdpZHRoOiAxMDAlO1xufVxuXG4ubG9naW4tYnV0dG9uLWNvbnRhaW5lciB7XG4gICAgdGV4dC1hbGlnbjogcmlnaHQ7XG4gICAgbWFyZ2luLXRvcDogMjBweDtcbn1cblxuLmluY29ycmVjdC1kZXRhaWxzLXBhbmVsIHtcbiAgICBtYXJnaW4tdG9wOiAzMHB4O1xuICAgIHBhZGRpbmc6IDEwcHg7XG4gICAgYm9yZGVyLXN0eWxlOiBzb2xpZDtcbiAgICBib3JkZXItd2lkdGg6IDFweDtcbiAgICBib3JkZXItY29sb3I6IG1hcm9vbjtcbiAgICBib3JkZXItcmFkaXVzOiAxcHg7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIGNvbG9yOiBtYXJvb247XG4gICAgYmFja2dyb3VuZC1jb2xvcjogbWlzdHlyb3NlO1xufVxuXG4uZm9ybS1yb290IHtcbiAgICBkaXNwbGF5OiBncmlkO1xuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogW2xhYmVsXSBhdXRvIFtjb250cm9sXSAxZnI7IC8qIFtvdmVyZmxvd10gYXV0bzsqL1xufVxuXG4ubGFiZWwge1xuICAgIGdyaWQtY29sdW1uLXN0YXJ0OiBsYWJlbDtcbiAgICBwYWRkaW5nOiA1cHggMTBweDtcbiAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xufVxuLmNvbnRyb2wge1xuICAgIGdyaWQtY29sdW1uLXN0YXJ0OiBjb250cm9sO1xuICAgIHBhZGRpbmc6IDVweCAxMHB4O1xufVxuXG4uZGVmYXVsdC1pbnB1dCB7XG5cdGZvbnQtZmFtaWx5OiBpbmhlcml0O1xuXHRmb250LXNpemU6IGluaGVyaXQ7XG5cdHBhZGRpbmc6IDAuNGVtO1xuXHRtYXJnaW46IDAgMCAwLjVlbSAwO1xuXHRib3gtc2l6aW5nOiBib3JkZXItYm94O1xuXHRib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuICAgIGJvcmRlci1yYWRpdXM6IDJweDtcbiAgICB3aWR0aDogMTAwJTtcbn1cblxuLmRlZmF1bHQtYnV0dG9uIHtcblx0Zm9udC1mYW1pbHk6IGluaGVyaXQ7XG5cdGZvbnQtc2l6ZTogaW5oZXJpdDtcblx0cGFkZGluZzogMC40ZW07XG5cdG1hcmdpbjogMCAwIDAuNWVtIDA7XG5cdGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG5cdGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XG5cdGJvcmRlci1yYWRpdXM6IDJweDtcblx0Y29sb3I6ICMzMzM7XG5cdGJhY2tncm91bmQtY29sb3I6ICNmNGY0ZjQ7XG5cdG91dGxpbmU6IG5vbmU7XG59XG5cbi5kZWZhdWx0LWJ1dHRvbjphY3RpdmUge1xuXHRiYWNrZ3JvdW5kLWNvbG9yOiAjZGRkO1xufVxuXG4uZGVmYXVsdC1idXR0b246Zm9jdXMge1xuXHRib3JkZXItY29sb3I6ICM2NjY7XG59XG5cbjwvc3R5bGU+IiwiZXhwb3J0IGNvbnN0IGJ1aWxkU3R5bGUgPSAoc3R5bGVzKSA9PiB7XHJcbiAgICBsZXQgc3RyID0gXCJcIjtcclxuICAgIGZvcihsZXQgcyBpbiBzdHlsZXMpIHtcclxuICAgICAgICBpZihzdHlsZXNbc10pIHtcclxuICAgICAgICAgICAgc3RyICs9IGAke3N9OiAke3N0eWxlc1tzXX07IGBcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc3RyO1xyXG59IiwiPHNjcmlwdD5cclxuaW1wb3J0IHsgb25Nb3VudCB9IGZyb20gJ3N2ZWx0ZSdcclxuaW1wb3J0IHtidWlsZFN0eWxlfSBmcm9tIFwiLi9idWlsZFN0eWxlXCI7XHJcblxyXG5leHBvcnQgbGV0IGdyaWRUZW1wbGF0ZVJvd3MgPVwiXCI7XHJcbmV4cG9ydCBsZXQgZ3JpZFRlbXBsYXRlQ29sdW1ucyA9XCJcIjtcclxuZXhwb3J0IGxldCBjaGlsZHJlbiA9IFtdO1xyXG5leHBvcnQgbGV0IHdpZHRoID0gXCJhdXRvXCI7XHJcbmV4cG9ydCBsZXQgaGVpZ2h0ID0gXCJhdXRvXCI7XHJcbmV4cG9ydCBsZXQgY29udGFpbmVyQ2xhc3M9XCJcIjtcclxuZXhwb3J0IGxldCBpdGVtQ29udGFpbmVyQ2xhc3M9XCJcIjtcclxuXHJcbi8qXCJncmlkQ29sdW1uU3RhcnRcIjpcInN0cmluZ1wiLFxyXG5cImdyaWRDb2x1bW5FbmRcIjpcInN0cmluZ1wiLFxyXG5cImdyaWRSb3dTdGFydFwiOlwic3RyaW5nXCIsXHJcblwiZ3JpZFJvd0VuZFwiOlwic3RyaW5nXCIqL1xyXG5cclxuXHJcbmV4cG9ydCBsZXQgX2JiO1xyXG5cclxubGV0IHN0eWxlPVwiXCI7XHJcbmxldCBodG1sRWxlbWVudHMgPSB7fTtcclxuXHJcbiQgOiB7XHJcbiAgICBpZihfYmIgJiYgaHRtbEVsZW1lbnRzKSB7XHJcbiAgICAgICAgZm9yKGxldCBlbCBpbiBodG1sRWxlbWVudHMpIHtcclxuICAgICAgICAgICAgX2JiLmluaXRpYWxpc2VDb21wb25lbnQoXHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbltlbF0uY29udHJvbCxcclxuICAgICAgICAgICAgICAgIGh0bWxFbGVtZW50c1tlbF1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGNoaWxkU3R5bGUgPSBjaGlsZCA9PiBcclxuICAgIGJ1aWxkU3R5bGUoe1xyXG4gICAgICAgIFwiZ3JpZC1jb2x1bW4tc3RhcnRcIjogY2hpbGQuZ3JpZENvbHVtblN0YXJ0LFxyXG4gICAgICAgIFwiZ3JpZC1jb2x1bW4tZW5kXCI6IGNoaWxkLmdyaWRDb2x1bW5FbmQsXHJcbiAgICAgICAgXCJncmlkLWNvbHVtblwiOiBjaGlsZC5ncmlkQ29sdW1uLFxyXG4gICAgICAgIFwiZ3JpZC1yb3ctc3RhcnRcIjogY2hpbGQuZ3JpZFJvd1N0YXJ0LFxyXG4gICAgICAgIFwiZ3JpZC1yb3ctZW5kXCI6IGNoaWxkLmdyaWRSb3dTdGFydCxcclxuICAgICAgICBcImdyaWQtcm93XCI6IGNoaWxkLmdyaWRSb3csXHJcbiAgICB9KTtcclxuXHJcbjwvc2NyaXB0PlxyXG5cclxuPGRpdiBjbGFzcz1cInJvb3Qge2NvbnRhaW5lckNsYXNzfVwiXHJcbiAgICAgc3R5bGU9XCJ3aWR0aDoge3dpZHRofTsgaGVpZ2h0OiB7aGVpZ2h0fTsgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiB7Z3JpZFRlbXBsYXRlQ29sdW1uc307IGdyaWQtdGVtcGxhdGUtcm93czoge2dyaWRUZW1wbGF0ZVJvd3N9O1wiPlxyXG4gICAgeyNlYWNoIGNoaWxkcmVuIGFzIGNoaWxkLCBpbmRleH1cclxuICAgIDxkaXYgY2xhc3M9XCJ7aXRlbUNvbnRhaW5lckNsYXNzfVwiXHJcbiAgICAgICAgc3R5bGU9e2NoaWxkU3R5bGUoY2hpbGQpfVxyXG4gICAgICAgIGJpbmQ6dGhpcz17aHRtbEVsZW1lbnRzW2luZGV4XX0+XHJcbiAgICA8L2Rpdj5cclxuICAgIHsvZWFjaH1cclxuPC9kaXY+XHJcblxyXG48c3R5bGU+XHJcblxyXG4ucm9vdCB7XHJcbiAgICBkaXNwbGF5OiBncmlkO1xyXG59XHJcblxyXG48L3N0eWxlPiIsIjxzY3JpcHQ+XG5pbXBvcnQgeyBvbk1vdW50IH0gZnJvbSAnc3ZlbHRlJ1xuXG5leHBvcnQgbGV0IGRpcmVjdGlvbiA9IFwiaG9yaXpvbnRhbFwiO1xuZXhwb3J0IGxldCBjaGlsZHJlbiA9IFtdO1xuZXhwb3J0IGxldCB3aWR0aCA9IFwiYXV0b1wiO1xuZXhwb3J0IGxldCBoZWlnaHQgPSBcImF1dG9cIjtcbmV4cG9ydCBsZXQgY29udGFpbmVyQ2xhc3M9XCJcIjtcbmV4cG9ydCBsZXQgaXRlbUNvbnRhaW5lckNsYXNzPVwiXCI7XG5cblxuZXhwb3J0IGxldCBfYmI7XG5cbmxldCBodG1sRWxlbWVudHMgPSB7fTtcblxub25Nb3VudCgoKSA9PiB7XG4gICAgaWYoX2JiICYmIGh0bWxFbGVtZW50cykge1xuICAgICAgICBmb3IobGV0IGVsIGluIGh0bWxFbGVtZW50cykge1xuICAgICAgICAgICAgX2JiLmluaXRpYWxpc2VDb21wb25lbnQoXG4gICAgICAgICAgICAgICAgY2hpbGRyZW5bZWxdLmNvbnRyb2wsXG4gICAgICAgICAgICAgICAgaHRtbEVsZW1lbnRzW2VsXVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5cbjwvc2NyaXB0PlxuXG48ZGl2IGNsYXNzPVwicm9vdCB7Y29udGFpbmVyQ2xhc3N9XCJcbiAgICAgc3R5bGU9XCJ3aWR0aDoge3dpZHRofTsgaGVpZ2h0OiB7aGVpZ2h0fVwiPlxuICAgIHsjZWFjaCBjaGlsZHJlbiBhcyBjaGlsZCwgaW5kZXh9XG4gICAgPGRpdiBjbGFzcz17ZGlyZWN0aW9ufT5cbiAgICAgICAgPGRpdiBjbGFzcz1cIntpdGVtQ29udGFpbmVyQ2xhc3N9XCJcbiAgICAgICAgICAgIGJpbmQ6dGhpcz17aHRtbEVsZW1lbnRzW2luZGV4XX0+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIHsvZWFjaH1cbjwvZGl2PlxuXG48c3R5bGU+XG5cbi5ob3Jpem9udGFsIHtcbiAgICBkaXNwbGF5OmlubGluZS1ibG9jaztcbn1cblxuLnZlcnRpY2FsIHtcbiAgICBkaXNwbGF5OiBibG9jaztcbn1cblxuPC9zdHlsZT4iLCIvLyBodHRwczovL2dpdGh1Yi5jb20va2Fpc2VybWFubi9zdmVsdGUtY3NzLXZhcnNcclxuXHJcbmV4cG9ydCBkZWZhdWx0IChub2RlLCBwcm9wcykgPT4ge1xyXG4gICAgT2JqZWN0LmVudHJpZXMocHJvcHMpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xyXG4gICAgICBub2RlLnN0eWxlLnNldFByb3BlcnR5KGAtLSR7a2V5fWAsIHZhbHVlKTtcclxuICAgIH0pO1xyXG4gIFxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdXBkYXRlKG5ld19wcm9wcykge1xyXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKG5ld19wcm9wcykuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XHJcbiAgICAgICAgICBub2RlLnN0eWxlLnNldFByb3BlcnR5KGAtLSR7a2V5fWAsIHZhbHVlKTtcclxuICAgICAgICAgIGRlbGV0ZSBwcm9wc1trZXldO1xyXG4gICAgICAgIH0pO1xyXG4gIFxyXG4gICAgICAgIE9iamVjdC5rZXlzKHByb3BzKS5mb3JFYWNoKG5hbWUgPT5cclxuICAgICAgICAgIG5vZGUuc3R5bGUucmVtb3ZlUHJvcGVydHkoYC0tJHtuYW1lfWApLFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgcHJvcHMgPSBuZXdfcHJvcHM7XHJcbiAgICAgIH0sXHJcbiAgICB9O1xyXG4gIH07IiwiPHNjcmlwdD5cclxuaW1wb3J0IGNzc1ZhcnMgZnJvbSBcIi4vY3NzVmFyc1wiO1xyXG5cclxuZXhwb3J0IGxldCBuYXZCYXJCYWNrZ3JvdW5kID0gXCJcIjtcclxuZXhwb3J0IGxldCBuYXZCYXJCb3JkZXI9XCJcIjtcclxuZXhwb3J0IGxldCBuYXZCYXJDb2xvcj1cIlwiO1xyXG5leHBvcnQgbGV0IHNlbGVjdGVkSXRlbUJhY2tncm91bmQ9XCJcIjtcclxuZXhwb3J0IGxldCBzZWxlY3RlZEl0ZW1Db2xvcj1cIlwiO1xyXG5leHBvcnQgbGV0IHNlbGVjdGVkSXRlbUJvcmRlcj1cIlwiO1xyXG5leHBvcnQgbGV0IGl0ZW1Ib3ZlckJhY2tncm91bmQ9XCJcIjtcclxuZXhwb3J0IGxldCBpdGVtSG92ZXJDb2xvcj1cIlwiO1xyXG5leHBvcnQgbGV0IGl0ZW1zID0gW11cclxuXHJcbmV4cG9ydCBsZXQgX2JiO1xyXG5cclxubGV0IHNlbGVjdGVkSW5kZXg7XHJcbmxldCBjb250ZW50RWxlbWVudDtcclxuXHJcbiQ6IHN0eWxlVmFycyA9IHtcclxuICAgIG5hdkJhckJhY2tncm91bmQsIG5hdkJhckJvcmRlcixcclxuICAgIG5hdkJhckNvbG9yLCBzZWxlY3RlZEl0ZW1CYWNrZ3JvdW5kLFxyXG4gICAgc2VsZWN0ZWRJdGVtQ29sb3IsIHNlbGVjdGVkSXRlbUJvcmRlcixcclxuICAgIGl0ZW1Ib3ZlckJhY2tncm91bmQsIGl0ZW1Ib3ZlckNvbG9yXHJcbn1cclxuXHJcbmNvbnN0IG9uU2VsZWN0SXRlbSA9IChpbmRleCkgPT4gKCkgPT4ge1xyXG4gICAgc2VsZWN0ZWRJbmRleCA9IGluZGV4O1xyXG4gICAgX2JiLmluaXRpYWxpc2VDb21wb25lbnQoaXRlbXNbaW5kZXhdLmNvbXBvbmVudCwgY29udGVudEVsZW1lbnQpO1xyXG59XHJcblxyXG5cclxuPC9zY3JpcHQ+XHJcblxyXG48ZGl2IGNsYXNzPVwicm9vdFwiIHVzZTpjc3NWYXJzPXtzdHlsZVZhcnN9PlxyXG4gICAgPGRpdiBjbGFzcz1cIm5hdmJhclwiPlxyXG4gICAgICAgIHsjZWFjaCBpdGVtcyBhcyBuYXZJdGVtLCBpbmRleH1cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibmF2aXRlbVwiXHJcbiAgICAgICAgICAgICBvbjpjbGljaz17b25TZWxlY3RJdGVtKGluZGV4KX1cclxuICAgICAgICAgICAgIGNsYXNzOnNlbGVjdGVkPXtzZWxlY3RlZEluZGV4ID09PSBpbmRleH0+XHJcbiAgICAgICAgICAgIHtuYXZJdGVtLnRpdGxlfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIHsvZWFjaH1cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzcz1cImNvbnRlbnRcIlxyXG4gICAgICAgICBiaW5kOnRoaXM9e2NvbnRlbnRFbGVtZW50fT5cclxuICAgIDwvZGl2PlxyXG48L2Rpdj5cclxuXHJcbjxzdHlsZT5cclxuXHJcbi5yb290IHtcclxuICAgIGhlaWdodDogMTAwJTtcclxuICAgIHdpZHRoOjEwMCU7XHJcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IFtuYXZiYXJdIGF1dG8gW2NvbnRlbnRdIDFmcjtcclxuICAgIGRpc3BsYXk6IGdyaWQ7XHJcbn1cclxuXHJcbi5uYXZiYXIge1xyXG4gICAgZ3JpZC1jb2x1bW46IG5hdmJhcjtcclxuICAgIGJhY2tncm91bmQ6IHZhcigtLW5hdkJhckJhY2tncm91bmQpO1xyXG4gICAgYm9yZGVyOiB2YXIoLS1uYXZCYXJCb3JkZXIpO1xyXG4gICAgY29sb3I6IHZhcigtLW5hdkJhckNvbG9yKTtcclxufVxyXG5cclxuLm5hdml0ZW0ge1xyXG4gICAgcGFkZGluZzogMTBweCAxN3B4O1xyXG4gICAgY3Vyc29yOiBwb2ludGVyO1xyXG59XHJcblxyXG4ubmF2aXRlbTpob3ZlciB7XHJcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1pdGVtSG92ZXJCYWNrZ3JvdW5kKTtcclxuICAgIGNvbG9yOiB2YXIoLS1pdGVtSG92ZXJDb2xvcik7XHJcbn1cclxuXHJcbi5uYXZpdGVtLnNlbGVjdGVkIHtcclxuICAgIGJhY2tncm91bmQ6IHZhcigtLXNlbGVjdGVkSXRlbUJhY2tncm91bmQpO1xyXG4gICAgYm9yZGVyOiB2YXIoLS1zZWxlY3RlZEl0ZW1Cb3JkZXIpO1xyXG4gICAgY29sb3I6IHZhcigtLXNlbGVjdGVkSXRlbUNvbG9yKTtcclxufVxyXG5cclxuLmNvbnRlbnQge1xyXG4gICAgZ3JpZC1jb2x1bW46IGNvbnRlbnQ7XHJcbn1cclxuXHJcbjwvc3R5bGU+XHJcblxyXG4iLCI8c2NyaXB0PlxyXG5pbXBvcnQge2J1aWxkU3R5bGV9IGZyb20gXCIuL2J1aWxkU3R5bGVcIjtcclxuXHJcbmV4cG9ydCBsZXQgY29tcG9uZW50PVwiXCI7XHJcbmV4cG9ydCBsZXQgdGV4dD1cIlwiO1xyXG5leHBvcnQgbGV0IGNvbnRhaW5lckNsYXNzPVwiXCI7XHJcbmV4cG9ydCBsZXQgYmFja2dyb3VuZD1cIlwiO1xyXG5leHBvcnQgbGV0IGJvcmRlcj1cIlwiO1xyXG5leHBvcnQgbGV0IGJvcmRlclJhZGl1cz1cIlwiO1xyXG5leHBvcnQgbGV0IGZvbnQ9XCJcIjtcclxuZXhwb3J0IGxldCBkaXNwbGF5PVwiXCI7XHJcbmV4cG9ydCBsZXQgdGV4dEFsaWduPVwiXCI7XHJcbmV4cG9ydCBsZXQgY29sb3I9XCJcIjtcclxuZXhwb3J0IGxldCBwYWRkaW5nPVwiXCI7XHJcblxyXG5leHBvcnQgbGV0IF9iYjtcclxuXHJcbmxldCBzdHlsZT1cIlwiO1xyXG5sZXQgY29tcG9uZW50RWxlbWVudDtcclxuXHJcbiQ6IHtcclxuICAgIHN0eWxlPWJ1aWxkU3R5bGUoe1xyXG4gICAgICAgIGJvcmRlciwgYmFja2dyb3VuZCwgZm9udCwgXHJcbiAgICAgICAgcGFkZGluZywgZGlzcGxheSwgY29sb3IsXHJcbiAgICAgICAgXCJ0ZXh0LWFsaWduXCI6IHRleHRBbGlnbixcclxuICAgICAgICBcImJvcmRlci1yYWRpdXNcIjpib3JkZXJSYWRpdXNcclxuICAgIH0pO1xyXG5cclxuICAgIGlmKF9iYiAmJiBjb21wb25lbnQpIHtcclxuICAgICAgICBfYmIuaW5pdGlhbGlzZUNvbXBvbmVudChjb21wb25lbnQsIGNvbXBvbmVudEVsZW1lbnQpO1xyXG4gICAgfVxyXG59XHJcblxyXG48L3NjcmlwdD5cclxuXHJcbjxkaXYgY2xhc3M9e2NvbnRhaW5lckNsYXNzfVxyXG4gICAgIHN0eWxlPXtzdHlsZX1cclxuICAgICB0aGlzOmJpbmQ9e2NvbXBvbmVudEVsZW1lbnR9PlxyXG4gICAge3RleHR9XHJcbjwvZGl2PlxyXG4iLCI8c2NyaXB0PlxyXG5pbXBvcnQge2J1aWxkU3R5bGV9IGZyb20gXCIuL2J1aWxkU3R5bGVcIjtcclxuXHJcbmV4cG9ydCBsZXQgdmFsdWU9XCJcIjtcclxuZXhwb3J0IGxldCBjb250YWluZXJDbGFzcz1cIlwiO1xyXG5cclxuZXhwb3J0IGxldCBmb250PVwiXCI7XHJcbmV4cG9ydCBsZXQgdGV4dEFsaWduPVwiXCI7XHJcbmV4cG9ydCBsZXQgdmVydGljYWxBbGlnbj1cIlwiXHJcbmV4cG9ydCBsZXQgY29sb3I9XCJcIjtcclxuZXhwb3J0IGxldCBkaXNwbGF5PVwiXCI7XHJcblxyXG5leHBvcnQgbGV0IF9iYjtcclxuXHJcbmxldCBzdHlsZT1cIlwiO1xyXG5cclxuXHJcbiQ6IHtcclxuICAgIHN0eWxlPWJ1aWxkU3R5bGUoe1xyXG4gICAgICAgIGZvbnQsICB2ZXJ0aWNhbEFsaWduLCBjb2xvciwgXHJcbiAgICAgICAgXCJ0ZXh0LWFsaWduXCI6IHRleHRBbGlnbixcclxuICAgICAgICBcInZlcnRpY2FsLWFsaWduXCI6IHZlcnRpY2FsQWxpZ25cclxuICAgIH0pO1xyXG59XHJcblxyXG48L3NjcmlwdD5cclxuXHJcbjxkaXYgY2xhc3M9e2NvbnRhaW5lckNsYXNzfVxyXG4gICAgIHN0eWxlPXtzdHlsZX0+XHJcbiAgICB7dmFsdWV9XHJcbjwvZGl2PlxyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsU0FBUyxJQUFJLEdBQUcsR0FBRztBQUNuQixBQUNBLFNBQVMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUU7O0lBRXRCLEtBQUssTUFBTSxDQUFDLElBQUksR0FBRztRQUNmLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEIsT0FBTyxHQUFHLENBQUM7Q0FDZDtBQUNELEFBUUEsU0FBUyxHQUFHLENBQUMsRUFBRSxFQUFFO0lBQ2IsT0FBTyxFQUFFLEVBQUUsQ0FBQztDQUNmO0FBQ0QsU0FBUyxZQUFZLEdBQUc7SUFDcEIsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0NBQzlCO0FBQ0QsU0FBUyxPQUFPLENBQUMsR0FBRyxFQUFFO0lBQ2xCLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7Q0FDcEI7QUFDRCxTQUFTLFdBQVcsQ0FBQyxLQUFLLEVBQUU7SUFDeEIsT0FBTyxPQUFPLEtBQUssS0FBSyxVQUFVLENBQUM7Q0FDdEM7QUFDRCxTQUFTLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQzFCLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxD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
