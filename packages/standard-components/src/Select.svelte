<script>

export let value="";
export let className = "default";
export let type = "text";
export let options = [];

export let _bb;

let actualValue = "";

const onchange = (ev) => {
	if(_bb) {
		_bb.setStateFromBinding(_bb.props.value, ev.target.value);
	}
}

</script>

<select class={className} 
	    value={value} 
	    on:change={onchange}>
	{#each options as opt}
	<option id={opt.id ? opt.id : opt.value}>{opt.value}</option>
	{/each}
</select>


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