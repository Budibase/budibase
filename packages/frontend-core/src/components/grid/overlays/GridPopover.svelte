<script>
  import { Popover, clickOutside } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"

  export let rand
  export let invertX
  export let open
  export let anchor

  const dispatch = createEventDispatcher()
</script>

<Popover
  bind:open
  {anchor}
  align={invertX ? "right" : "left"}
  portalTarget="#grid-{rand} .grid-popover-container"
  offset={1}
>
  <div use:clickOutside={() => dispatch("close")}>
    <slot />
  </div>
</Popover>

<style>
  :global(.grid-popover-container .spectrum-Popover) {
    background: var(--grid-background-alt);
    border: var(--cell-border);
  }
</style>
