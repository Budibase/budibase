<script>

export let value="";
export let hideValue = false;
export let className = "default";

export let _bb;

let actualValue = "";
$: {
	if(_bb && value._isstate) {
		_bb.store.subscribe(s => {
			actualValue = _bb.store.getValue(s, value);
		});
	}
}

const onchange = (ev) => {
	if(_bb && value._isstate) {
		_bb.store.setValue(value, ev.target.value);
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