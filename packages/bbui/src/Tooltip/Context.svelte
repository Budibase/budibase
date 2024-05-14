<script>
  import Portal from "svelte-portal"
  import { getContext } from "svelte"
  import Context from "../context"

  export let anchor
  export let visible = false
  export let offset = 0

  $: target = getContext(Context.PopoverRoot) || "#app"

  let hovering = false
  let tooltip
  let x = 0
  let y = 0

  const updatePosition = (anchor, tooltip) => {
    if (anchor == null || tooltip == null) {
      return
    }

    requestAnimationFrame(() => {
      const rect = anchor.getBoundingClientRect()
      const windowOffset =
        window.innerHeight - offset - (tooltip.clientHeight + rect.y)
      const tooltipWidth = tooltip.clientWidth

      x = rect.x - tooltipWidth - offset
      y = windowOffset < 0 ? rect.y + windowOffset : rect.y
    })
  }

  $: updatePosition(anchor, tooltip)

  const handleMouseenter = () => {
    hovering = true
  }

  const handleMouseleave = () => {
    hovering = false
  }
</script>

<Portal {target}>
  <div
    role="tooltip"
    on:mouseenter={handleMouseenter}
    on:mouseleave={handleMouseleave}
    style:left={`${x}px`}
    style:top={`${y}px`}
    class="wrapper"
    class:visible={visible || hovering}
  >
    <div bind:this={tooltip} class="tooltip">
      <slot />
    </div>
  </div>
</Portal>

<style>
  .wrapper {
    background-color: var(--spectrum-global-color-gray-100);
    box-shadow: 2px 2px 5px 0px rgba(0, 0, 0, 0.42);
    opacity: 0;
    overflow: hidden;

    border-radius: 5px;
    box-sizing: border-box;
    border: 1px solid var(--grey-4);
    position: absolute;
    pointer-events: none;
    z-index: 1000;
  }

  .visible {
    opacity: 1;
    pointer-events: auto;
  }
</style>
