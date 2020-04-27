<script>
  import { buildStyle } from "./buildStyle.js"
  export let className = ""
  export let type
  export let _bb
  export let text = ""
  export let fontFamily = ""

  let containerElement

  $: containerElement && !text && _bb.attachChildren(containerElement)
  $: style = buildStyle({ "font-family": fontFamily })
</script>

{#if type === 'h1'}
  <h1 class={className} {style} bind:this={containerElement}>{text}</h1>
{:else if type === 'h2'}
  <h2 class={className} {style} bind:this={containerElement}>{text}</h2>
{:else if type === 'h3'}
  <h3 class={className} {style} bind:this={containerElement}>{text}</h3>
{:else if type === 'h4'}
  <h4 class={className} {style} bind:this={containerElement}>{text}</h4>
{:else if type === 'h5'}
  <h5 class={className} {style} bind:this={containerElement}>{text}</h5>
{:else if type === 'h6'}
  <h6 class={className} {style} bind:this={containerElement}>{text}</h6>
{/if}
