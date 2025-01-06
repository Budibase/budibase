<script context="module">
  export const TooltipPosition = {
    Top: "top",
    Right: "right",
    Bottom: "bottom",
    Left: "left",
  }
  export const TooltipType = {
    Default: "default",
    Info: "info",
    Positive: "positive",
    Negative: "negative",
  }
</script>

<script>
  import Portal from "svelte-portal"
  import { fade } from "svelte/transition"
  import "@spectrum-css/tooltip/dist/index-vars.css"
  import { onDestroy } from "svelte"

  export let position = TooltipPosition.Top
  export let type = TooltipType.Default
  export let text = ""
  export let fixed = false
  export let color = null
  export let noWrap = false

  let wrapper
  let hovered = false
  let left
  let top
  let visible = false
  let timeout
  let interval

  $: {
    if (hovered || fixed) {
      // Debounce showing by 200ms to avoid flashing tooltip
      timeout = setTimeout(show, 200)
    } else {
      hide()
    }
  }
  $: tooltipStyle = color ? `background:${color};` : null
  $: tipStyle = color ? `border-top-color:${color};` : null

  // Computes the position of the tooltip
  const updateTooltipPosition = () => {
    const node = wrapper?.children?.[0]
    if (!node) {
      left = null
      top = null
      return
    }
    const bounds = node.getBoundingClientRect()

    // Determine where to render tooltip based on position prop
    if (position === TooltipPosition.Top) {
      left = bounds.left + bounds.width / 2
      top = bounds.top
    } else if (position === TooltipPosition.Right) {
      left = bounds.left + bounds.width
      top = bounds.top + bounds.height / 2
    } else if (position === TooltipPosition.Bottom) {
      left = bounds.left + bounds.width / 2
      top = bounds.top + bounds.height
    } else if (position === TooltipPosition.Left) {
      left = bounds.left
      top = bounds.top + bounds.height / 2
    }
  }

  // Computes the position of the tooltip then shows it.
  // We set up a poll to frequently update the position of the tooltip in case
  // the target moves.
  const show = () => {
    updateTooltipPosition()
    interval = setInterval(updateTooltipPosition, 100)
    visible = true
  }

  // Hides the tooltip
  const hide = () => {
    clearTimeout(timeout)
    clearInterval(interval)
    visible = false
  }

  // Ensure we clean up interval and timeout
  onDestroy(hide)
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  bind:this={wrapper}
  class="abs-tooltip"
  on:focus={null}
  on:mouseover={() => (hovered = true)}
  on:mouseleave={() => (hovered = false)}
>
  <slot />
</div>

{#if visible && text && left != null && top != null}
  <Portal target=".spectrum">
    <span
      class="spectrum-Tooltip spectrum-Tooltip--{type} spectrum-Tooltip--{position} is-open"
      class:noWrap
      style={`left:${left}px;top:${top}px;${tooltipStyle}`}
      transition:fade|local={{ duration: 130 }}
    >
      <span class="spectrum-Tooltip-label">{text}</span>
      <span class="spectrum-Tooltip-tip" style={tipStyle} />
    </span>
  </Portal>
{/if}

<style>
  .abs-tooltip {
    display: contents;
  }
  .spectrum-Tooltip.noWrap .spectrum-Tooltip-label {
    width: max-content;
  }
  .spectrum-Tooltip {
    position: absolute;
    z-index: 9999;
    pointer-events: none;
    margin: 0;
    max-width: 280px;
    transition: top 130ms ease-out, left 130ms ease-out;
  }
  .spectrum-Tooltip-label {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-size: 12px;
    font-weight: 600;
  }

  /* Colour overrides for default type */
  .spectrum-Tooltip--default {
    background: var(--spectrum-global-color-gray-500);
  }
  .spectrum-Tooltip--default .spectrum-Tooltip-tip {
    border-top-color: var(--spectrum-global-color-gray-500);
  }

  /* Position styles */
  .spectrum-Tooltip--top {
    transform: translateX(-50%) translateY(calc(-100% - 8px));
  }
  .spectrum-Tooltip--right {
    transform: translateX(8px) translateY(-50%);
  }
  .spectrum-Tooltip--bottom {
    transform: translateX(-50%) translateY(8px);
  }
  .spectrum-Tooltip--left {
    transform: translateX(calc(-100% - 8px)) translateY(-50%);
  }
</style>
