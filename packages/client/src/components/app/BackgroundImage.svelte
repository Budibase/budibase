<script>
  import { getContext } from "svelte"

  const { styleable } = getContext("sdk")
  const component = getContext("component")

  export let url
  export let position

  let style = ""
  $: {
    if (url) {
      style += `background-image: url("${url}");`
    }
    if (position) {
      style += `background-position: ${position};`
    }
  }
</script>

<div class="outer" use:styleable={$component.styles}>
  <div class="inner" {style}>
    <slot />
  </div>
</div>

<style>
  .outer {
    position: relative;
    width: 100%;
    height: 400px;
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
