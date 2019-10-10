<script>

export let value="";
export let hideValue = false;
export let className = "default";

export let _bb;

let actualValue = "";

const onchange = (ev) => {
	if(_bb) {
		_bb.setStateFromBinding(_bb.bindings.value, ev.target.value);
	}
}

</script>

{#if hideValue}
<input class={className} 
	   type="password" 
	   value={value} 
	   on:change={onchange}/>
{:else}
<input class={className} 
	   type="text" 
	   value={value}
	   on:change={onchange}/>
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