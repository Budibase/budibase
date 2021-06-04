<script>
  import { log } from "console"

  import { getContext } from "svelte"

  const { styleable, transition } = getContext("sdk")
  const component = getContext("component")
  export let type = "mainSidebar"
  export let gap = "16px"
</script>

<div
  in:transition={{ type: $component.transition }}
  use:styleable={$component.styles}
  class={type}
>
  <slot />
</div>

<style>
  div {
    display: grid;
    grid-gap: 16px;
  }
  .mainSidebar {
    grid-template-columns: 2fr 1fr;
  }
  .sidebarMain {
    grid-template-columns: 1fr 2fr;
  }
  .twoColumns {
    grid-template-columns: 1fr 1fr;
  }
  .threeColumns {
    grid-template-columns: 1fr 1fr 1fr;
  }
</style>
