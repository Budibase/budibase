<script>
  import { getContext } from "svelte"

  const { styleable } = getContext("app")

  export let embed
  export let styles
</script>

<div use:styleable={styles}>
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
