<script>
  import { getContext } from "svelte"

  const { styleable } = getContext("sdk")
  const styles = getContext("style")

  export let embed
</script>

<div use:styleable={$styles}>
  {@html embed}
</div>

<style>
  div {
    position: relative;
  }
  div :global(> *) {
    width: 100%;
    height: 100%;
    position: absolute;
  }
</style>
