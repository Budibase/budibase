<script>
  import { fade } from "svelte/transition"

  export let top
  export let left
  export let width
  export let height
  export let text
  export let color
  export let zIndex
  export let transition = false
  export let line = false
  export let alignRight = false

  $: flipped = top < 20
</script>

<div
  in:fade={{
    delay: transition ? 130 : 0,
    duration: transition ? 130 : 0,
  }}
  class="indicator"
  class:flipped
  class:line
  style="top: {top}px; left: {left}px; width: {width}px; height: {height}px; --color: {color}; --zIndex: {zIndex};"
  class:withText={!!text}
>
  {#if text}
    <div class="text" class:flipped class:line class:right={alignRight}>
      {text}
    </div>
  {/if}
</div>

<style>
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
  .text {
    background-color: var(--color);
    color: white;
    position: absolute;
    top: 0;
    left: -2px;
    height: 20px;
    padding: 0 8px 2px 8px;
    transform: translateY(-100%);
    font-size: 11px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    white-space: nowrap;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .text.line {
    transform: translateY(-50%);
    border-radius: 4px;
  }
  .text.flipped {
    border-radius: 4px;
    transform: translateY(0%);
    top: -2px;
  }
  .text.right {
    right: -2px;
    left: auto;
  }
</style>
