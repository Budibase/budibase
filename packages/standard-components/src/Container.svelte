<script>
  export let _children = []
  export let className = ""
  export let onLoad
  export let _bb

  let rootDiv
  let hasLoaded;
  let currentChildren;

  $: {
    if (_bb && rootDiv && _children && _children.length) {
      currentChildren = _children
      _bb.hydrateChildren(rootDiv)
    }
  }
</script>

<div class={className} bind:this={rootDiv} />
