<script>
  export let className = ""
  export let _bb

  let thead

  $: _bb.attachChildren(thead)
</script>

<thead bind:this={thead} class="className" />
