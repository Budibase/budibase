<script>
  export let className = ""
  export let type
  export let _bb

  let containerElement

  $: containerElement && _bb.attachChildren(containerElement)

</script>

{#if type === "h1"}
<h1 class={className} bind:this={containerElement}></h1>
{:else if type === "h2"}
<h2 class={className} bind:this={containerElement}></h2>
{:else if type === "h3"}
<h3 class={className} bind:this={containerElement}></h3>
{:else if type === "h4"}
<h4 class={className} bind:this={containerElement}></h4>
{:else if type === "h5"}
<h5 class={className} bind:this={containerElement}></h5>
{:else if type === "h6"}
<h6 class={className} bind:this={containerElement}></h6>
{/if}
