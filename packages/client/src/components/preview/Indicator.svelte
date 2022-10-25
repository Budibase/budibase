<script>
  import { fade } from "svelte/transition"
  import { Icon } from "@budibase/bbui"

  export let top
  export let left
  export let width
  export let height
  export let text
  export let icon
  export let color
  export let zIndex
  export let componentId
  export let transition = false
  export let line = false
  export let alignRight = false
  export let showResizeAnchors = false

  const AnchorSides = [
    "right",
    "left",
    "top",
    "bottom",
    "bottom-right",
    "bottom-left",
    "top-right",
    "top-left",
  ]

  $: flipped = top < 24
</script>

<div
  in:fade={{
    delay: transition ? 100 : 0,
    duration: transition ? 100 : 0,
  }}
  class="indicator"
  class:flipped
  class:line
  style="top: {top}px; left: {left}px; width: {width}px; height: {height}px; --color: {color}; --zIndex: {zIndex};"
  class:withText={!!text}
>
  {#if text || icon}
    <div class="label" class:flipped class:line class:right={alignRight}>
      {#if icon}
        <Icon name={icon} size="S" color="white" />
      {/if}
      {#if text}
        <div class="text">
          {text}
        </div>
      {/if}
    </div>
  {/if}
  {#if showResizeAnchors}
    {#each AnchorSides as side}
      <div
        draggable="true"
        class="anchor {side}"
        data-side={side}
        data-id={componentId}
      >
        <div class="anchor-inner" />
      </div>
    {/each}
  {/if}
</div>

<style>
  /* Indicator styles */
  .indicator {
    right: 0;
    position: absolute;
    z-index: var(--zIndex);
    border: 2px solid var(--color);
    pointer-events: none;
    border-radius: 4px;
  }
  .indicator.withText {
    border-top-left-radius: 0;
  }
  .indicator.withText.flipped {
    border-top-left-radius: 4px;
  }
  .indicator.line {
    border-radius: 4px !important;
  }

  /* Label styles */
  .label {
    background-color: var(--color);
    position: absolute;
    top: 0;
    left: -2px;
    height: 24px;
    padding: 0 6px 0 6px;
    transform: translateY(-100%);
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    white-space: nowrap;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 6px;
  }
  .label.line {
    transform: translateY(-50%);
    border-radius: 4px;
  }
  .label.flipped {
    border-radius: 4px;
    transform: translateY(0%);
    top: -1px;
  }
  .label.right {
    right: -2px;
    left: auto;
  }

  /* Text styles */
  .text {
    color: white;
    font-size: 11px;
    font-weight: 600;
  }

  /* Icon styles */
  .label :global(.spectrum-Icon + .text) {
  }

  /* Anchor */
  .anchor {
    --size: 24px;
    position: absolute;
    width: var(--size);
    height: var(--size);
    pointer-events: all;
    display: grid;
    place-items: center;
    border-radius: 50%;
  }
  .anchor-inner {
    width: 12px;
    height: 12px;
    background: white;
    border: 2px solid var(--color);
    pointer-events: none;
  }
  .anchor.right {
    right: calc(var(--size) / -2 - 1px);
    top: calc(50% - var(--size) / 2);
    cursor: e-resize;
  }
  .anchor.left {
    left: calc(var(--size) / -2 - 1px);
    top: calc(50% - var(--size) / 2);
    cursor: w-resize;
  }
  .anchor.bottom {
    left: calc(50% - var(--size) / 2 + 1px);
    bottom: calc(var(--size) / -2 - 1px);
    cursor: s-resize;
  }
  .anchor.top {
    left: calc(50% - var(--size) / 2 + 1px);
    top: calc(var(--size) / -2 - 1px);
    cursor: n-resize;
  }

  .anchor.bottom-right {
    right: calc(var(--size) / -2 - 1px);
    bottom: calc(var(--size) / -2 - 1px);
    cursor: se-resize;
  }
  .anchor.bottom-left {
    left: calc(var(--size) / -2 - 1px);
    bottom: calc(var(--size) / -2 - 1px);
    cursor: sw-resize;
  }
  .anchor.top-right {
    right: calc(var(--size) / -2 - 1px);
    top: calc(var(--size) / -2 - 1px);
    cursor: ne-resize;
  }
  .anchor.top-left {
    left: calc(var(--size) / -2 - 1px);
    top: calc(var(--size) / -2 - 1px);
    cursor: nw-resize;
  }
</style>
