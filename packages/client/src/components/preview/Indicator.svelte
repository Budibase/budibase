<script>
  import { Icon } from "@budibase/bbui"
  import { GridDragModes } from "utils/grid"

  export let top
  export let left
  export let width
  export let height
  export let text
  export let icon
  export let color
  export let zIndex
  export let componentId
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
  class="indicator"
  class:flipped
  class:line
  style="top: {top}px; left: {left}px; width: {width}px; height: {height}px; --color: {color}; --zIndex: {zIndex};"
  class:withText={!!text}
  class:vCompact={height < 40}
  class:hCompact={width < 40}
>
  {#if text || icon}
    <div
      class="label"
      class:flipped
      class:line
      class:right={alignRight}
      draggable="true"
      data-indicator="true"
      data-drag-mode={GridDragModes.Move}
      data-id={componentId}
    >
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
        class="anchor {side}"
        draggable="true"
        data-indicator="true"
        data-drag-mode={GridDragModes.Resize}
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
    pointer-events: all;
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

  /* Anchor */
  .anchor {
    --size: 20px;
    position: absolute;
    width: var(--size);
    height: var(--size);
    pointer-events: all;
    display: grid;
    place-items: center;
    border-radius: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
  .anchor-inner {
    width: calc(var(--size) / 2);
    height: calc(var(--size) / 2);
    background: white;
    border: 2px solid var(--color);
    pointer-events: none;
    border-radius: 2px;
  }

  /* Thinner anchors for each edge */
  .anchor.right,
  .anchor.left {
    height: calc(var(--size) * 2);
  }
  .anchor.top,
  .anchor.bottom {
    width: calc(var(--size) * 2);
  }
  .anchor.right .anchor-inner,
  .anchor.left .anchor-inner {
    height: calc(var(--size) * 1.2);
    width: calc(var(--size) * 0.3);
  }
  .anchor.top .anchor-inner,
  .anchor.bottom .anchor-inner {
    width: calc(var(--size) * 1.2);
    height: calc(var(--size) * 0.3);
  }

  /* Hide side indicators when they don't fit */
  .indicator.hCompact .anchor.top,
  .indicator.hCompact .anchor.bottom,
  .indicator.vCompact .anchor.left,
  .indicator.vCompact .anchor.right {
    display: none;
  }

  /* Anchor positions */
  .anchor.right {
    left: calc(100% + 1px);
    top: 50%;
    cursor: e-resize;
  }
  .anchor.left {
    left: -1px;
    top: 50%;
    cursor: w-resize;
  }
  .anchor.bottom {
    left: 50%;
    top: calc(100% + 1px);
    cursor: s-resize;
  }
  .anchor.top {
    left: 50%;
    top: -1px;
    cursor: n-resize;
  }
  .anchor.bottom-right {
    top: 100%;
    left: 100%;
    cursor: se-resize;
  }
  .anchor.bottom-left {
    left: 0;
    top: 100%;
    cursor: sw-resize;
  }
  .anchor.top-right {
    left: 100%;
    top: 0;
    cursor: ne-resize;
  }
  .anchor.top-left {
    left: 0;
    top: 0;
    cursor: nw-resize;
  }
</style>
