<script>
export let className = "default";
export let disabled = false;
export let contentText;
export let contentComponent;

</script>


<button class={className} {disabled} on:click>
    {#if contentComponent && contentComponent._component}
    {contentComponent}
    {:else if contentText}
    {contentText}
    {:else}
    <slot />
    {/if}
</button>


<style>

.default {
	font-family: inherit;
	font-size: inherit;
	padding: 0.4em;
	margin: 0 0 0.5em 0;
	box-sizing: border-box;
	border: 1px solid #ccc;
	border-radius: 2px;
	color: #333;
	background-color: #f4f4f4;
	outline: none;
}

.default:active {
	background-color: #ddd;
}

.default:focus {
	border-color: #666;
}

</style>