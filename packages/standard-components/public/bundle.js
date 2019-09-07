
(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
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
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
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
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
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

    function bind(component, name, callback) {
        if (component.$$.props.indexOf(name) === -1)
            return;
        component.$$.bound[name] = callback;
        callback(component.$$.ctx[name]);
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
            ? instance(component, props, (key, value) => {
                if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
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
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    /* src\Textbox.svelte generated by Svelte v3.9.1 */

    const file = "src\\Textbox.svelte";

    // (10:0) {:else}
    function create_else_block(ctx) {
    	var input, dispose;

    	return {
    		c: function create() {
    			input = element("input");
    			attr(input, "type", "text");
    			attr(input, "class", "svelte-bmvn6x");
    			add_location(input, file, 10, 0, 151);
    			dispose = listen(input, "input", ctx.input_input_handler_1);
    		},

    		m: function mount(target, anchor) {
    			insert(target, input, anchor);

    			set_input_value(input, ctx.value);
    		},

    		p: function update(changed, ctx) {
    			if (changed.value && (input.value !== ctx.value)) set_input_value(input, ctx.value);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(input);
    			}

    			dispose();
    		}
    	};
    }

    // (8:0) {#if hideValue}
    function create_if_block(ctx) {
    	var input, dispose;

    	return {
    		c: function create() {
    			input = element("input");
    			attr(input, "type", "password");
    			attr(input, "class", "svelte-bmvn6x");
    			add_location(input, file, 8, 0, 97);
    			dispose = listen(input, "input", ctx.input_input_handler);
    		},

    		m: function mount(target, anchor) {
    			insert(target, input, anchor);

    			set_input_value(input, ctx.value);
    		},

    		p: function update(changed, ctx) {
    			if (changed.value && (input.value !== ctx.value)) set_input_value(input, ctx.value);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(input);
    			}

    			dispose();
    		}
    	};
    }

    function create_fragment(ctx) {
    	var if_block_anchor;

    	function select_block_type(changed, ctx) {
    		if (ctx.hideValue) return create_if_block;
    		return create_else_block;
    	}

    	var current_block_type = select_block_type(null, ctx);
    	var if_block = current_block_type(ctx);

    	return {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    		},

    		p: function update(changed, ctx) {
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

    		d: function destroy(detaching) {
    			if_block.d(detaching);

    			if (detaching) {
    				detach(if_block_anchor);
    			}
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	let { value="", hideValue = false } = $$props;

    	const writable_props = ['value', 'hideValue'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Textbox> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate('value', value);
    	}

    	function input_input_handler_1() {
    		value = this.value;
    		$$invalidate('value', value);
    	}

    	$$self.$set = $$props => {
    		if ('value' in $$props) $$invalidate('value', value = $$props.value);
    		if ('hideValue' in $$props) $$invalidate('hideValue', hideValue = $$props.hideValue);
    	};

    	return {
    		value,
    		hideValue,
    		input_input_handler,
    		input_input_handler_1
    	};
    }

    class Textbox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, ["value", "hideValue"]);
    	}

    	get value() {
    		throw new Error("<Textbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Textbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideValue() {
    		throw new Error("<Textbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideValue(value) {
    		throw new Error("<Textbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\FormControl.svelte generated by Svelte v3.9.1 */

    const file$1 = "src\\FormControl.svelte";

    // (17:4) {:else}
    function create_else_block$1(ctx) {
    	var current;

    	const default_slot_template = ctx.$$slots.default;
    	const default_slot = create_slot(default_slot_template, ctx, null);

    	return {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},

    		l: function claim(nodes) {
    			if (default_slot) default_slot.l(nodes);
    		},

    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (default_slot && default_slot.p && changed.$$scope) {
    				default_slot.p(
    					get_slot_changes(default_slot_template, ctx, changed, null),
    					get_slot_context(default_slot_template, ctx, null)
    				);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    // (15:4) {#if control}
    function create_if_block$1(ctx) {
    	var control_1;

    	return {
    		c: function create() {
    			control_1 = element("control");
    			add_location(control_1, file$1, 15, 4, 398);
    		},

    		m: function mount(target, anchor) {
    			insert(target, control_1, anchor);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(control_1);
    			}
    		}
    	};
    }

    function create_fragment$1(ctx) {
    	var div0, t0, div0_class_value, t1, div1, current_block_type_index, if_block, div1_class_value, current;

    	var if_block_creators = [
    		create_if_block$1,
    		create_else_block$1
    	];

    	var if_blocks = [];

    	function select_block_type(changed, ctx) {
    		if (ctx.control) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(null, ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	return {
    		c: function create() {
    			div0 = element("div");
    			t0 = text(ctx.label);
    			t1 = space();
    			div1 = element("div");
    			if_block.c();
    			attr(div0, "class", div0_class_value = "label " + ctx.labelContainerClass + " svelte-98bu7e");
    			add_location(div0, file$1, 12, 0, 243);
    			attr(div1, "class", div1_class_value = "control " + ctx.controlContainerClass + " svelte-98bu7e");
    			toggle_class(div1, "full-width", ctx.fullWidth);
    			add_location(div1, file$1, 13, 0, 299);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div0, anchor);
    			append(div0, t0);
    			insert(target, t1, anchor);
    			insert(target, div1, anchor);
    			if_blocks[current_block_type_index].m(div1, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (!current || changed.label) {
    				set_data(t0, ctx.label);
    			}

    			if ((!current || changed.labelContainerClass) && div0_class_value !== (div0_class_value = "label " + ctx.labelContainerClass + " svelte-98bu7e")) {
    				attr(div0, "class", div0_class_value);
    			}

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
    				if_block.m(div1, null);
    			}

    			if ((!current || changed.controlContainerClass) && div1_class_value !== (div1_class_value = "control " + ctx.controlContainerClass + " svelte-98bu7e")) {
    				attr(div1, "class", div1_class_value);
    			}

    			if ((changed.controlContainerClass || changed.fullWidth)) {
    				toggle_class(div1, "full-width", ctx.fullWidth);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div0);
    				detach(t1);
    				detach(div1);
    			}

    			if_blocks[current_block_type_index].d();
    		}
    	};
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { containerClass = "", labelContainerClass = "", controlContainerClass = "", label = "", control, overflowControl, fullWidth = false } = $$props;

    	const writable_props = ['containerClass', 'labelContainerClass', 'controlContainerClass', 'label', 'control', 'overflowControl', 'fullWidth'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<FormControl> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ('containerClass' in $$props) $$invalidate('containerClass', containerClass = $$props.containerClass);
    		if ('labelContainerClass' in $$props) $$invalidate('labelContainerClass', labelContainerClass = $$props.labelContainerClass);
    		if ('controlContainerClass' in $$props) $$invalidate('controlContainerClass', controlContainerClass = $$props.controlContainerClass);
    		if ('label' in $$props) $$invalidate('label', label = $$props.label);
    		if ('control' in $$props) $$invalidate('control', control = $$props.control);
    		if ('overflowControl' in $$props) $$invalidate('overflowControl', overflowControl = $$props.overflowControl);
    		if ('fullWidth' in $$props) $$invalidate('fullWidth', fullWidth = $$props.fullWidth);
    		if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
    	};

    	return {
    		containerClass,
    		labelContainerClass,
    		controlContainerClass,
    		label,
    		control,
    		overflowControl,
    		fullWidth,
    		$$slots,
    		$$scope
    	};
    }

    class FormControl extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, ["containerClass", "labelContainerClass", "controlContainerClass", "label", "control", "overflowControl", "fullWidth"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.control === undefined && !('control' in props)) {
    			console.warn("<FormControl> was created without expected prop 'control'");
    		}
    		if (ctx.overflowControl === undefined && !('overflowControl' in props)) {
    			console.warn("<FormControl> was created without expected prop 'overflowControl'");
    		}
    	}

    	get containerClass() {
    		throw new Error("<FormControl>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerClass(value) {
    		throw new Error("<FormControl>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelContainerClass() {
    		throw new Error("<FormControl>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelContainerClass(value) {
    		throw new Error("<FormControl>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get controlContainerClass() {
    		throw new Error("<FormControl>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set controlContainerClass(value) {
    		throw new Error("<FormControl>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<FormControl>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<FormControl>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get control() {
    		throw new Error("<FormControl>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set control(value) {
    		throw new Error("<FormControl>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get overflowControl() {
    		throw new Error("<FormControl>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set overflowControl(value) {
    		throw new Error("<FormControl>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fullWidth() {
    		throw new Error("<FormControl>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fullWidth(value) {
    		throw new Error("<FormControl>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Form.svelte generated by Svelte v3.9.1 */

    const file$2 = "src\\Form.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.formControl = list[i];
    	return child_ctx;
    }

    // (11:4) {:else}
    function create_else_block$2(ctx) {
    	var current;

    	const default_slot_template = ctx.$$slots.default;
    	const default_slot = create_slot(default_slot_template, ctx, null);

    	return {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},

    		l: function claim(nodes) {
    			if (default_slot) default_slot.l(nodes);
    		},

    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (default_slot && default_slot.p && changed.$$scope) {
    				default_slot.p(
    					get_slot_changes(default_slot_template, ctx, changed, null),
    					get_slot_context(default_slot_template, ctx, null)
    				);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    // (9:4) {#each formControls as formControl}
    function create_each_block(ctx) {
    	var formControl;

    	return {
    		c: function create() {
    			formControl = element("formControl");
    			add_location(formControl, file$2, 9, 4, 178);
    		},

    		m: function mount(target, anchor) {
    			insert(target, formControl, anchor);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(formControl);
    			}
    		}
    	};
    }

    function create_fragment$2(ctx) {
    	var div, div_class_value;

    	var each_value = ctx.formControls;

    	var each_blocks = [];

    	for (var i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	var each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block$2(ctx);
    		each_1_else.c();
    	}

    	return {
    		c: function create() {
    			div = element("div");

    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}
    			attr(div, "class", div_class_value = "form-root " + ctx.containerClass + " svelte-h706oz");
    			add_location(div, file$2, 7, 0, 91);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);

    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			if (each_1_else) {
    				each_1_else.m(div, null);
    			}
    		},

    		p: function update(changed, ctx) {
    			if (changed.$$scope || changed.formControls) {
    				each_value = ctx.formControls;

    				for (var i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block();
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value.length;
    			}

    			if (!each_value.length && each_1_else) {
    				each_1_else.p(changed, ctx);
    			} else if (!each_value.length) {
    				each_1_else = create_else_block$2(ctx);
    				each_1_else.c();
    				each_1_else.m(div, null);
    			} else if (each_1_else) {
    				each_1_else.d(1);
    				each_1_else = null;
    			}

    			if ( div_class_value !== (div_class_value = "form-root " + ctx.containerClass + " svelte-h706oz")) {
    				attr(div, "class", div_class_value);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			destroy_each(each_blocks, detaching);

    			if (each_1_else) each_1_else.d();
    		}
    	};
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { containerClass = "", formControls = [] } = $$props;

    	const writable_props = ['containerClass', 'formControls'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Form> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ('containerClass' in $$props) $$invalidate('containerClass', containerClass = $$props.containerClass);
    		if ('formControls' in $$props) $$invalidate('formControls', formControls = $$props.formControls);
    		if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
    	};

    	return {
    		containerClass,
    		formControls,
    		$$slots,
    		$$scope
    	};
    }

    class Form extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, ["containerClass", "formControls"]);
    	}

    	get containerClass() {
    		throw new Error("<Form>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerClass(value) {
    		throw new Error("<Form>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get formControls() {
    		throw new Error("<Form>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set formControls(value) {
    		throw new Error("<Form>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Button.svelte generated by Svelte v3.9.1 */

    const file$3 = "src\\Button.svelte";

    // (14:4) {:else}
    function create_else_block$3(ctx) {
    	var current;

    	const default_slot_template = ctx.$$slots.default;
    	const default_slot = create_slot(default_slot_template, ctx, null);

    	return {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},

    		l: function claim(nodes) {
    			if (default_slot) default_slot.l(nodes);
    		},

    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (default_slot && default_slot.p && changed.$$scope) {
    				default_slot.p(
    					get_slot_changes(default_slot_template, ctx, changed, null),
    					get_slot_context(default_slot_template, ctx, null)
    				);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    // (12:26) 
    function create_if_block_1(ctx) {
    	var t;

    	return {
    		c: function create() {
    			t = text(ctx.contentText);
    		},

    		m: function mount(target, anchor) {
    			insert(target, t, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (changed.contentText) {
    				set_data(t, ctx.contentText);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(t);
    			}
    		}
    	};
    }

    // (10:4) {#if contentComponent}
    function create_if_block$2(ctx) {
    	var t;

    	return {
    		c: function create() {
    			t = text(ctx.contentComponent);
    		},

    		m: function mount(target, anchor) {
    			insert(target, t, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (changed.contentComponent) {
    				set_data(t, ctx.contentComponent);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(t);
    			}
    		}
    	};
    }

    function create_fragment$3(ctx) {
    	var button, current_block_type_index, if_block, current, dispose;

    	var if_block_creators = [
    		create_if_block$2,
    		create_if_block_1,
    		create_else_block$3
    	];

    	var if_blocks = [];

    	function select_block_type(changed, ctx) {
    		if (ctx.contentComponent) return 0;
    		if (ctx.contentText) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(null, ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	return {
    		c: function create() {
    			button = element("button");
    			if_block.c();
    			attr(button, "class", "" + null_to_empty(ctx.className) + " svelte-19ku4ig");
    			button.disabled = ctx.disabled;
    			add_location(button, file$3, 8, 0, 138);
    			dispose = listen(button, "click", ctx.click_handler);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, button, anchor);
    			if_blocks[current_block_type_index].m(button, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
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

    			if (!current || changed.className) {
    				attr(button, "class", "" + null_to_empty(ctx.className) + " svelte-19ku4ig");
    			}

    			if (!current || changed.disabled) {
    				button.disabled = ctx.disabled;
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(button);
    			}

    			if_blocks[current_block_type_index].d();
    			dispose();
    		}
    	};
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { className = "", disabled = false, contentText, contentComponent } = $$props;

    	const writable_props = ['className', 'disabled', 'contentText', 'contentComponent'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$props => {
    		if ('className' in $$props) $$invalidate('className', className = $$props.className);
    		if ('disabled' in $$props) $$invalidate('disabled', disabled = $$props.disabled);
    		if ('contentText' in $$props) $$invalidate('contentText', contentText = $$props.contentText);
    		if ('contentComponent' in $$props) $$invalidate('contentComponent', contentComponent = $$props.contentComponent);
    		if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
    	};

    	return {
    		className,
    		disabled,
    		contentText,
    		contentComponent,
    		click_handler,
    		$$slots,
    		$$scope
    	};
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, ["className", "disabled", "contentText", "contentComponent"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.contentText === undefined && !('contentText' in props)) {
    			console.warn("<Button> was created without expected prop 'contentText'");
    		}
    		if (ctx.contentComponent === undefined && !('contentComponent' in props)) {
    			console.warn("<Button> was created without expected prop 'contentComponent'");
    		}
    	}

    	get className() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set className(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get contentText() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set contentText(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get contentComponent() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set contentComponent(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Login.svelte generated by Svelte v3.9.1 */

    const file$4 = "src\\Login.svelte";

    // (27:12) <FormControl label={usernameLabel}>
    function create_default_slot_3(ctx) {
    	var updating_value, current;

    	function textbox_value_binding(value) {
    		ctx.textbox_value_binding.call(null, value);
    		updating_value = true;
    		add_flush_callback(() => updating_value = false);
    	}

    	let textbox_props = {};
    	if (ctx.username !== void 0) {
    		textbox_props.value = ctx.username;
    	}
    	var textbox = new Textbox({ props: textbox_props, $$inline: true });

    	binding_callbacks.push(() => bind(textbox, 'value', textbox_value_binding));

    	return {
    		c: function create() {
    			textbox.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(textbox, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var textbox_changes = {};
    			if (!updating_value && changed.username) {
    				textbox_changes.value = ctx.username;
    			}
    			textbox.$set(textbox_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(textbox.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(textbox.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(textbox, detaching);
    		}
    	};
    }

    // (30:12) <FormControl label={passwordLabel}>
    function create_default_slot_2(ctx) {
    	var updating_value, current;

    	function textbox_value_binding_1(value) {
    		ctx.textbox_value_binding_1.call(null, value);
    		updating_value = true;
    		add_flush_callback(() => updating_value = false);
    	}

    	let textbox_props = { hideValue: "true" };
    	if (ctx.password !== void 0) {
    		textbox_props.value = ctx.password;
    	}
    	var textbox = new Textbox({ props: textbox_props, $$inline: true });

    	binding_callbacks.push(() => bind(textbox, 'value', textbox_value_binding_1));

    	return {
    		c: function create() {
    			textbox.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(textbox, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var textbox_changes = {};
    			if (!updating_value && changed.password) {
    				textbox_changes.value = ctx.password;
    			}
    			textbox.$set(textbox_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(textbox.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(textbox.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(textbox, detaching);
    		}
    	};
    }

    // (26:8) <Form>
    function create_default_slot_1(ctx) {
    	var t, current;

    	var formcontrol0 = new FormControl({
    		props: {
    		label: ctx.usernameLabel,
    		$$slots: { default: [create_default_slot_3] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	var formcontrol1 = new FormControl({
    		props: {
    		label: ctx.passwordLabel,
    		$$slots: { default: [create_default_slot_2] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	return {
    		c: function create() {
    			formcontrol0.$$.fragment.c();
    			t = space();
    			formcontrol1.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(formcontrol0, target, anchor);
    			insert(target, t, anchor);
    			mount_component(formcontrol1, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var formcontrol0_changes = {};
    			if (changed.usernameLabel) formcontrol0_changes.label = ctx.usernameLabel;
    			if (changed.$$scope || changed.username) formcontrol0_changes.$$scope = { changed, ctx };
    			formcontrol0.$set(formcontrol0_changes);

    			var formcontrol1_changes = {};
    			if (changed.passwordLabel) formcontrol1_changes.label = ctx.passwordLabel;
    			if (changed.$$scope || changed.password) formcontrol1_changes.$$scope = { changed, ctx };
    			formcontrol1.$set(formcontrol1_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(formcontrol0.$$.fragment, local);

    			transition_in(formcontrol1.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(formcontrol0.$$.fragment, local);
    			transition_out(formcontrol1.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(formcontrol0, detaching);

    			if (detaching) {
    				detach(t);
    			}

    			destroy_component(formcontrol1, detaching);
    		}
    	};
    }

    // (36:12) <Button>
    function create_default_slot(ctx) {
    	var t;

    	return {
    		c: function create() {
    			t = text("Login");
    		},

    		m: function mount(target, anchor) {
    			insert(target, t, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(t);
    			}
    		}
    	};
    }

    function create_fragment$4(ctx) {
    	var div3, div2, div0, img, t0, t1, div1, current;

    	var form = new Form({
    		props: {
    		$$slots: { default: [create_default_slot_1] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	var button = new Button({
    		props: {
    		$$slots: { default: [create_default_slot] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	return {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			form.$$.fragment.c();
    			t1 = space();
    			div1 = element("div");
    			button.$$.fragment.c();
    			attr(img, "src", ctx.logo);
    			attr(img, "alt", "logo");
    			attr(img, "class", "svelte-1s3350l");
    			add_location(img, file$4, 22, 12, 489);
    			attr(div0, "class", "logo-container svelte-1s3350l");
    			add_location(div0, file$4, 21, 8, 447);
    			attr(div1, "class", "login-button-container svelte-1s3350l");
    			add_location(div1, file$4, 34, 8, 851);
    			attr(div2, "class", "content svelte-1s3350l");
    			add_location(div2, file$4, 19, 4, 414);
    			attr(div3, "class", "root svelte-1s3350l");
    			add_location(div3, file$4, 17, 0, 388);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div3, anchor);
    			append(div3, div2);
    			append(div2, div0);
    			append(div0, img);
    			append(div2, t0);
    			mount_component(form, div2, null);
    			append(div2, t1);
    			append(div2, div1);
    			mount_component(button, div1, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (!current || changed.logo) {
    				attr(img, "src", ctx.logo);
    			}

    			var form_changes = {};
    			if (changed.$$scope || changed.passwordLabel || changed.password || changed.usernameLabel || changed.username) form_changes.$$scope = { changed, ctx };
    			form.$set(form_changes);

    			var button_changes = {};
    			if (changed.$$scope) button_changes.$$scope = { changed, ctx };
    			button.$set(button_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(form.$$.fragment, local);

    			transition_in(button.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(form.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div3);
    			}

    			destroy_component(form);

    			destroy_component(button);
    		}
    	};
    }

    function instance$4($$self, $$props, $$invalidate) {
    	

    let { usernameLabel = "Username", passwordLabel = "Password", loginRedirect = "", logo = "/budibase-logo.png" } = $$props;

    let username = "";
    let password = "";

    	const writable_props = ['usernameLabel', 'passwordLabel', 'loginRedirect', 'logo'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	function textbox_value_binding(value) {
    		username = value;
    		$$invalidate('username', username);
    	}

    	function textbox_value_binding_1(value) {
    		password = value;
    		$$invalidate('password', password);
    	}

    	$$self.$set = $$props => {
    		if ('usernameLabel' in $$props) $$invalidate('usernameLabel', usernameLabel = $$props.usernameLabel);
    		if ('passwordLabel' in $$props) $$invalidate('passwordLabel', passwordLabel = $$props.passwordLabel);
    		if ('loginRedirect' in $$props) $$invalidate('loginRedirect', loginRedirect = $$props.loginRedirect);
    		if ('logo' in $$props) $$invalidate('logo', logo = $$props.logo);
    	};

    	return {
    		usernameLabel,
    		passwordLabel,
    		loginRedirect,
    		logo,
    		username,
    		password,
    		textbox_value_binding,
    		textbox_value_binding_1
    	};
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, ["usernameLabel", "passwordLabel", "loginRedirect", "logo"]);
    	}

    	get usernameLabel() {
    		throw new Error("<Login>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set usernameLabel(value) {
    		throw new Error("<Login>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get passwordLabel() {
    		throw new Error("<Login>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set passwordLabel(value) {
    		throw new Error("<Login>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get loginRedirect() {
    		throw new Error("<Login>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loginRedirect(value) {
    		throw new Error("<Login>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get logo() {
    		throw new Error("<Login>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set logo(value) {
    		throw new Error("<Login>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Test\TestApp.svelte generated by Svelte v3.9.1 */

    const file$5 = "src\\Test\\TestApp.svelte";

    function create_fragment$5(ctx) {
    	var div, current;

    	var login = new Login({ $$inline: true });

    	return {
    		c: function create() {
    			div = element("div");
    			login.$$.fragment.c();
    			attr(div, "class", "current svelte-cgpppc");
    			add_location(div, file$5, 5, 0, 63);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			mount_component(login, div, null);
    			current = true;
    		},

    		p: noop,

    		i: function intro(local) {
    			if (current) return;
    			transition_in(login.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(login.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			destroy_component(login);
    		}
    	};
    }

    class TestApp extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$5, safe_not_equal, []);
    	}
    }

    const app = new TestApp({
    	target: document.body,
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
