<script>
  import { getContext } from "svelte"

  const { styleable } = getContext("sdk")
  const component = getContext("component")

  export let embed
</script>

<div use:styleable={$component.styles}>
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
