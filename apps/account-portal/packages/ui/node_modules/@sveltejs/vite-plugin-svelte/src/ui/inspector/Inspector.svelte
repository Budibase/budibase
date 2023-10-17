<script>
	// do not use TS here so that this component works in non-ts projects too
	import { onMount } from 'svelte';
	// eslint-disable-next-line node/no-missing-import
	import options from 'virtual:svelte-inspector-options';
	const toggle_combo = options.toggleKeyCombo?.toLowerCase().split('-');

	let enabled = false;

	const icon = `data:image/svg+xml;base64,${btoa(
		`
<svg xmlns="http://www.w3.org/2000/svg" width="21" height="25" viewBox="0 0 107 128">
  <title>svelte-inspector-logo</title>
  <path d="M94.1566,22.8189c-10.4-14.8851-30.94-19.2971-45.7914-9.8348L22.2825,29.6078A29.9234,29.9234,0,0,0,8.7639,49.6506a31.5136,31.5136,0,0,0,3.1076,20.2318A30.0061,30.0061,0,0,0,7.3953,81.0653a31.8886,31.8886,0,0,0,5.4473,24.1157c10.4022,14.8865,30.9423,19.2966,45.7914,9.8348L84.7167,98.3921A29.9177,29.9177,0,0,0,98.2353,78.3493,31.5263,31.5263,0,0,0,95.13,58.117a30,30,0,0,0,4.4743-11.1824,31.88,31.88,0,0,0-5.4473-24.1157" style="fill:#ff3e00"/><path d="M45.8171,106.5815A20.7182,20.7182,0,0,1,23.58,98.3389a19.1739,19.1739,0,0,1-3.2766-14.5025,18.1886,18.1886,0,0,1,.6233-2.4357l.4912-1.4978,1.3363.9815a33.6443,33.6443,0,0,0,10.203,5.0978l.9694.2941-.0893.9675a5.8474,5.8474,0,0,0,1.052,3.8781,6.2389,6.2389,0,0,0,6.6952,2.485,5.7449,5.7449,0,0,0,1.6021-.7041L69.27,76.281a5.4306,5.4306,0,0,0,2.4506-3.631,5.7948,5.7948,0,0,0-.9875-4.3712,6.2436,6.2436,0,0,0-6.6978-2.4864,5.7427,5.7427,0,0,0-1.6.7036l-9.9532,6.3449a19.0329,19.0329,0,0,1-5.2965,2.3259,20.7181,20.7181,0,0,1-22.2368-8.2427,19.1725,19.1725,0,0,1-3.2766-14.5024,17.9885,17.9885,0,0,1,8.13-12.0513L55.8833,23.7472a19.0038,19.0038,0,0,1,5.3-2.3287A20.7182,20.7182,0,0,1,83.42,29.6611a19.1739,19.1739,0,0,1,3.2766,14.5025,18.4,18.4,0,0,1-.6233,2.4357l-.4912,1.4978-1.3356-.98a33.6175,33.6175,0,0,0-10.2037-5.1l-.9694-.2942.0893-.9675a5.8588,5.8588,0,0,0-1.052-3.878,6.2389,6.2389,0,0,0-6.6952-2.485,5.7449,5.7449,0,0,0-1.6021.7041L37.73,51.719a5.4218,5.4218,0,0,0-2.4487,3.63,5.7862,5.7862,0,0,0,.9856,4.3717,6.2437,6.2437,0,0,0,6.6978,2.4864,5.7652,5.7652,0,0,0,1.602-.7041l9.9519-6.3425a18.978,18.978,0,0,1,5.2959-2.3278,20.7181,20.7181,0,0,1,22.2368,8.2427,19.1725,19.1725,0,0,1,3.2766,14.5024,17.9977,17.9977,0,0,1-8.13,12.0532L51.1167,104.2528a19.0038,19.0038,0,0,1-5.3,2.3287" style="fill:#fff"/>
  <polygon points="0,0 15,40 40,20" stroke="#ff3e00" fill="#ff3e00"></polygon>
</svg>
`
			.replace(/[\n\r\t\s]+/g, ' ')
			.trim()
	)}`;

	// location of code in file
	let file_loc;
	// cursor pos and width for file_loc overlay positioning
	let x, y, w;

	let active_el;
	let toggle_el;

	let enabled_ts;

	$: show_toggle =
		options.showToggleButton === 'always' || (options.showToggleButton === 'active' && enabled);

	function mousemove(event) {
		x = event.x;
		y = event.y;
	}

	function findMetaEl(el) {
		while (el) {
			const file = el.__svelte_meta?.loc?.file;
			if (el !== toggle_el && file && !file.includes('node_modules/')) {
				return el;
			}
			el = el.parentNode;
		}
	}

	function mouseover(event) {
		const el = findMetaEl(event.target);
		if (options.customStyles && el !== active_el) {
			if (active_el) {
				active_el.classList.remove('svelte-inspector-active-target');
			}
			if (el) {
				el.classList.add('svelte-inspector-active-target');
			}
		}
		if (el) {
			const { file, line, column } = el.__svelte_meta.loc;
			file_loc = `${file}:${line + 1}:${column + 1}`;
		} else {
			file_loc = null;
		}
		active_el = el;
	}

	function click(event) {
		if (file_loc) {
			event.preventDefault();
			event.stopPropagation();
			event.stopImmediatePropagation();
			fetch(`/__open-in-editor?file=${encodeURIComponent(file_loc)}`);
			if (options.holdMode && is_holding()) {
				disable();
			}
		}
	}

	function is_key_active(key, event) {
		switch (key) {
			case 'shift':
			case 'control':
			case 'alt':
			case 'meta':
				return event.getModifierState(key.charAt(0).toUpperCase() + key.slice(1));
			default:
				return key === event.key.toLowerCase();
		}
	}

	function is_combo(event) {
		return toggle_combo?.every((key) => is_key_active(key, event));
	}

	function is_holding() {
		return enabled_ts && Date.now() - enabled_ts > 250;
	}

	function keydown(event) {
		if (event.repeat || event.key === undefined) {
			return;
		}

		if (is_combo(event)) {
			toggle();
			if (options.holdMode && enabled) {
				enabled_ts = Date.now();
			}
		}
	}

	function keyup(event) {
		if (event.repeat) {
			return;
		}
		const k = event.key.toLowerCase();
		if (enabled && is_holding() && toggle_combo.includes(k)) {
			disable();
		} else {
			enabled_ts = null;
		}
	}

	function toggle() {
		enabled ? disable() : enable();
	}

	function listeners(body, enabled) {
		const l = enabled ? body.addEventListener : body.removeEventListener;
		l('mousemove', mousemove);
		l('mouseover', mouseover);
		l('click', click, true);
	}

	function enable() {
		enabled = true;
		const b = document.body;
		if (options.customStyles) {
			b.classList.add('svelte-inspector-enabled');
		}
		listeners(b, enabled);
	}

	function disable() {
		enabled = false;
		enabled_ts = null;
		const b = document.body;
		listeners(b, enabled);
		if (options.customStyles) {
			b.classList.remove('svelte-inspector-enabled');
			active_el?.classList.remove('svelte-inspector-active-target');
		}
		active_el = null;
	}

	onMount(() => {
		const s = document.createElement('style');
		s.setAttribute('type', 'text/css');
		s.setAttribute('id', 'svelte-inspector-style');
		s.textContent = `:root { --svelte-inspector-icon: url(${icon})};`;
		document.head.append(s);
		if (toggle_combo) {
			document.body.addEventListener('keydown', keydown);
			if (options.holdMode) {
				document.body.addEventListener('keyup', keyup);
			}
		}
		return () => {
			// make sure we get rid of everything
			disable();
			const s = document.head.querySelector('#svelte-inspector-style');
			if (s) {
				document.head.removeChild(s);
			}
			if (toggle_combo) {
				document.body.removeEventListener('keydown', keydown);
				if (options.holdMode) {
					document.body.addEventListener('keyup', keyup);
				}
			}
		};
	});
</script>

{#if show_toggle}
	<div
		class="svelte-inspector-toggle"
		class:enabled
		style={`background-image: var(--svelte-inspector-icon);${options.toggleButtonPos
			.split('-')
			.map((p) => `${p}: 8px;`)
			.join('')}`}
		on:click={() => toggle()}
		bind:this={toggle_el}
	/>
{/if}
{#if enabled && file_loc}
	<div
		class="svelte-inspector-overlay"
		style:left="{Math.min(x + 3, document.body.clientWidth - w - 10)}px"
		style:top="{y + 30}px"
		bind:offsetWidth={w}
	>
		{file_loc}
	</div>
{/if}

<style>
	:global(body.svelte-inspector-enabled *) {
		cursor: var(--svelte-inspector-icon), crosshair !important;
	}
	:global(.svelte-inspector-active-target) {
		outline: 2px dashed #ff3e00 !important;
	}

	.svelte-inspector-overlay {
		position: fixed;
		background-color: rgba(0, 0, 0, 0.8);
		color: #fff;
		padding: 2px 4px;
		border-radius: 5px;
		z-index: 999999;
	}

	.svelte-inspector-toggle {
		border: 1px solid #ff3e00;
		border-radius: 8px;
		position: fixed;
		height: 32px;
		width: 32px;
		background-color: white;
		background-position: center;
		background-repeat: no-repeat;
		cursor: pointer;
	}

	.svelte-inspector-toggle:not(.enabled) {
		filter: grayscale(1);
	}
	.svelte-inspector-toggle:hover {
		background-color: #facece;
	}
</style>
