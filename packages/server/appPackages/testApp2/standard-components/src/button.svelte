<script>
export let className = "";
export let disabled = false;
export let contentText = "";
export let contentComponent = {};
</script>


<button class={className} {disabled} on:click>
    {#if contentComponent}
    {contentText}
    {:else}
    <div>Props..</div>
    {/if}
</button>