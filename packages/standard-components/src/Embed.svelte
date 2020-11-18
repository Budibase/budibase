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
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: stretch;
  }
  div :global(> *) {
    flex: 1 1 auto;
  }
</style>
