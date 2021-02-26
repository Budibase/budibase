<script>
  import { getContext } from "svelte"

  const { styleable } = getContext("sdk")
  const component = getContext("component")

  export let url = ""
  $: style = url ? `background-image: url("${url}")` : ""
</script>

<div class="outer" use:styleable={$component.styles}>
  <div class="inner" {style} />
</div>

<style>
  .outer {
    position: relative;
  }

  .inner {
    position: absolute;
    height: 100%;
    width: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
  }
</style>
