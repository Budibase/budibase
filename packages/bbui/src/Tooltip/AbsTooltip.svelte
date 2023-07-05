<script context="module">
  export const TooltipDirection = {
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

  export let direction = TooltipDirection.Top
  export let type = TooltipType.Positive
  export let text = ""

  let wrapper
  let visible = false
  let left = 0
  let top = 0

  const show = () => {
    const node = wrapper?.children?.[0]
    if (!node) {
      return
    }
    const bounds = node.getBoundingClientRect()

    if (direction === TooltipDirection.Top) {
      left = bounds.left + bounds.width / 2
      top = bounds.top
    } else if (direction === TooltipDirection.Right) {
      left = bounds.left + bounds.width
      top = bounds.top + bounds.height / 2
    } else if (direction === TooltipDirection.Bottom) {
      left = bounds.left + bounds.width / 2
      top = bounds.top + bounds.height
    } else if (direction === TooltipDirection.Left) {
      left = bounds.left
      top = bounds.top + bounds.height / 2
    } else {
      return
    }

    visible = true
  }
  const hide = () => {
    visible = false
  }
</script>

<div
  bind:this={wrapper}
  class="abs-tooltip"
  on:mouseover={show}
  on:mouseleave={hide}
>
  <slot />
</div>
{#if visible}
  <Portal target=".spectrum">
    <span
      class="spectrum-Tooltip spectrum-Tooltip--{type} spectrum-Tooltip--{direction} is-open"
      style="left:{left}px;top:{top}px;"
      transition:fade|local={{ duration: 130 }}
    >
      <span class="spectrum-Tooltip-label">{text}</span>
      <span class="spectrum-Tooltip-tip" />
    </span>
  </Portal>
{/if}

<style>
  .abs-tooltip {
    display: contents;
  }
  .spectrum-Tooltip {
    position: absolute;
    z-index: 999;
    pointer-events: none;
    margin: 0;
    max-width: 280px;
  }
  .spectrum-Tooltip-label {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  /* Colour overrides for default type */
  .spectrum-Tooltip--default {
    background: var(--spectrum-global-color-gray-500);
  }
  .spectrum-Tooltip--default .spectrum-Tooltip-tip {
    border-top-color: var(--spectrum-global-color-gray-500);
  }

  /* Direction styles */
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
