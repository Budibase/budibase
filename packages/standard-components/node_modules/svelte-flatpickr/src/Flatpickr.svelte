<slot>
	<input bind:this={input} {...$$restProps} />
</slot>

<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import flatpickr from 'flatpickr';

	const hooks = new Set([
		'onChange',
		'onOpen',
		'onClose',
		'onMonthChange',
		'onYearChange',
		'onReady',
		'onValueUpdate',
		'onDayCreate',
	]);

	export let value = '', formattedValue = '', element = null, dateFormat = null;
	export let options = {};
	let ready = false;

	export let input = undefined, fp = undefined;
	export { fp as flatpickr };

	$: if (fp && ready) {
		fp.setDate(value, false, dateFormat);
	}

	onMount(() => {
		const elem = element || input;

		const opts = addHooks(options);
		opts.onReady.push(() => {
			ready = true;
		});

		fp = flatpickr(
			elem,
			Object.assign(opts, element ? {wrap: true} : {}),
		);

		return () => {
			fp.destroy();
		};
	});

	const dispatch = createEventDispatcher();

	$: if (fp && ready) {
		for (const [key, val] of Object.entries(addHooks(options))) {
			fp.set(key, val);
		}
	}

	function addHooks(opts = {}) {
		opts = Object.assign({}, opts);

		for (const hook of hooks) {
			const firer = (selectedDates, dateStr, instance) => {
				dispatch(stripOn(hook), [selectedDates, dateStr, instance]);
			};

			if (hook in opts) {
				// Hooks must be arrays
				if (!Array.isArray(opts[hook])) opts[hook] = [opts[hook]];

				opts[hook].push(firer);
			} else {
				opts[hook] = [firer];
			}
		}

		if (opts.onChange && !opts.onChange.includes(updateValue))
			opts.onChange.push(updateValue);

		return opts;
	}

	function updateValue(newValue, dateStr) {
		value = Array.isArray(newValue) && newValue.length === 1 ? newValue[0] : newValue;
		formattedValue = dateStr;
	}

	function stripOn(hook) {
		return hook.charAt(2).toLowerCase() + hook.substring(3);
	}
</script>
