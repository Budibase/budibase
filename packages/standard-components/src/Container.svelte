<script>
  export let className = ""
  export let onLoad
  export let _bb

  let rootDiv
  let hasLoaded;
  let currentChildren;

  $: rootDiv && _bb.hydrateChildren(rootDiv)

</script>

<div class={className} bind:this={rootDiv} />
