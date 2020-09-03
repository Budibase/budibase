<script>
  export let _bb
  export let className = ""

  let containerElement
  let hasLoaded

  $: {
    if (containerElement) {
      _bb.attachChildren(containerElement)
      hasLoaded = true
    }
  }
</script>

<div bind:this={containerElement} class={className} />
