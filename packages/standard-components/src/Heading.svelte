<script>
  export let className = ""
  export let type
  export let _bb
  export let text = ""
  let containerElement

  $: containerElement && !text && _bb.attachChildren(containerElement)
</script>

{#if type === 'h1'}
  <h1 class={className} bind:this={containerElement}>{text}</h1>
{:else if type === 'h2'}
  <h2 class={className} bind:this={containerElement}>{text}</h2>
{:else if type === 'h3'}
  <h3 class={className} bind:this={containerElement}>{text}</h3>
{:else if type === 'h4'}
  <h4 class={className} bind:this={containerElement}>{text}</h4>
{:else if type === 'h5'}
  <h5 class={className} bind:this={containerElement}>{text}</h5>
{:else if type === 'h6'}
  <h6 class={className} bind:this={containerElement}>{text}</h6>
{/if}
