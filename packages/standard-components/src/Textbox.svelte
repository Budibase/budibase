<script>

export let value="";
export let hideValue = false;
export let className = "default";

export let _app;

let actualValue = "";
$: {
	if(_app && value._isstate) {
		_app.store.subscribe(s => {
			actualValue = _app.store.getValue(s, value);
		});
	}
}

const onchange = (ev) => {
	if(_app && value._isstate) {
		_app.store.setValue(value, ev.target.value);
	} else if(!value._isstate) {
		actualValue = ev.target.value;
	}
}

</script>

{#if hideValue}
<input class={className} 
	   type="password" 
	   value={actualValue} on:change/>
{:else}
<input class={className} type="text" value={actualValue}/>
{/if}

<style>
.default {
    width: 100%;
	font-family: inherit;
	font-size: inherit;
	padding: 0.4em;
	margin: 0 0 0.5em 0;
	box-sizing: border-box;
	border: 1px solid #ccc;
    border-radius: 2px;
    width: 100%;
}

.default:disabled {
	color: #ccc;
}

</style>