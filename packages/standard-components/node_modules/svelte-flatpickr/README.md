# svelte-flatpickr

Svelte component for [flatpickr](https://flatpickr.js.org/) datetime picker.

## Usage

Ideally, if you're using svelte already, configure your bundler to resolve the
package's `svelte` field (or import from `svelte-flatpickr/src/Flatpickr.svelte`) and compile the template from within your own project. See [sveltejs/svelte#604](https://github.com/sveltejs/svelte/issues/604) for more information.

Don't forget to import flatpickr's stylesheets as well
(`flatpickr/dist/flatpickr.css`, and optionally any theme stylesheets you want).

## Versions

-   For Svelte v3 use v3.x.x
-   For Svelte v2.x use v1.x.x
-   For Svelte v1.x use v0.x.x

## Flatpickr documentation

- [Examples](https://flatpickr.js.org/examples/)
- [Events and hooks](https://flatpickr.js.org/events/)
- [Configuration options](https://flatpickr.js.org/options/)

### Example

See the `test` directory for a full working example.

```svelte
<main>
	<form on:submit={handleSubmit}>
		<Flatpickr {options} bind:value bind:formattedValue on:change={handleChange} name="date" />

		<button type="submit">
			Submit
		</button>
	</form>
</main>

<script>
	import Flatpickr from 'svelte-flatpickr';
	import 'flatpickr/dist/flatpickr.css';

	let value, formattedValue;

	const options = {
		enableTime: true,
		onChange(selectedDates, dateStr) {
			console.log('flatpickr hook', selectedDates, dateStr);
		}
	};

	$: console.log({ value, formattedValue });

	function handleChange(event) {
		const [ selectedDates, dateStr ] = event.detail;
		console.log({ selectedDates, dateStr });
	}

	function handleSubmit(event) {
		event.preventDefault();

		console.log(event.target.elements['date'].value);
	}
</script>
```

The selected date(s) can be obtained using hooks or binding to `value`.

The format of the date expected can be controlled with the prop `dateFormat`, which will take a date format acceptable to Flatpickr.

The prop `formattedValue` can also be bound to, which contains the selected
date(s)'s formatted string.

The props `input` and `flatpickr` (or `fp`) can also be bound to, which represent the underlying input element (unless using a custom external element as described below) and the [flatpickr instance](https://flatpickr.js.org/instance-methods-properties-elements/), respectively.
Assigning to these will break the Flatpickr component, please don't.

### Hooks

Hooks can be specified normally in the options object, or by listening to the svelte event.

When binding svelte handler, `event.details` will be `[ selectedDates, dateStr, instance ]` (see [flatpickr events docs](https://chmln.github.io/flatpickr/events/)).


### External Elements

As per the [flatpickr documentation](https://flatpickr.js.org/examples/#flatpickr-external-elements), it is also possible to wrap a custom element rather than have the component create the input for you. This allows for decoration of the control such as adding a clear button or similar.

You can add the custom element by wrapping it in the Flatpickr component, as it is the default slot. However, it is necessary to pass the selector for the custom element, as the `element` attribute to Flatpickr's options.

Specifying the selector for a custom element automatically adds the `{wrap: true}` option to flatpickr.

```html
<Flatpickr options="{ flatpickrOptions }" bind:value={date} element="#my-picker">
		<div class="flatpickr" id="my-picker">
			<input type="text" placeholder="Select Date.." data-input>

			<a class="input-button" title="clear" data-clear>
					<i class="icon-close"></i>
			</a>
		</div>
</Flatpickr>

<script>
	import Flatpickr from 'svelte-flatpickr'

	import 'flatpickr/dist/flatpickr.css'
	import 'flatpickr/dist/themes/light.css'

	let date = null
	const flatpickrOptions = {
		element: '#my-picker'
	}
</script>
```
