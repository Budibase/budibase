<script>
  import "@spectrum-css/link/dist/index-vars.css"
  import { createEventDispatcher } from "svelte"
  import Tooltip from "../Tooltip/Tooltip.svelte"

  export let href = "#"
  export let size = "M"
  export let quiet = false
  export let primary = false
  export let secondary = false
  export let overBackground = false
  export let target
  export let download
  export let disabled = false
  export let tooltip = null

  const dispatch = createEventDispatcher()

  const onClick = e => {
    if (!disabled) {
      dispatch("click")
      e.stopPropagation()
    }
  }
</script>

<a
  on:click={onClick}
  {href}
  {target}
  {download}
  class:disabled
  class:spectrum-Link--primary={primary}
  class:spectrum-Link--secondary={secondary}
  class:spectrum-Link--overBackground={overBackground}
  class:spectrum-Link--quiet={quiet}
  class="spectrum-Link spectrum-Link--size{size}"
>
  <slot />
  {#if tooltip}
    <div class="tooltip">
      <Tooltip textWrapping direction="bottom" text={tooltip} />
    </div>
  {/if}
</a>

<style>
  a {
    position: relative;
  }
  a.disabled {
    color: var(--spectrum-global-color-gray-500);
  }
  a.disabled:hover {
    text-decoration: none;
    cursor: default;
  }
  .tooltip {
    position: absolute;
    left: 50%;
    top: 100%;
    transform: translateX(-50%);
    opacity: 0;
    transition: 130ms ease-out;
    pointer-events: none;
    z-index: 100;
  }
  a:hover .tooltip {
    opacity: 1;
  }
</style>
