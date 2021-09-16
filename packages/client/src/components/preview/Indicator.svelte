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
</script>

<div
  in:fade={{
    delay: transition ? 50 : 0,
    duration: transition ? 130 : 0,
  }}
  out:fade={{ duration: transition ? 130 : 0 }}
  class="indicator"
  class:flipped={top < 20}
  style="top: {top}px; left: {left}px; width: {width}px; height: {height}px; --color: {color}; --zIndex: {zIndex};"
>
  {#if text}
    <div class="text" class:flipped={top < 20}>
      {text}
    </div>
  {/if}
</div>

<style>
  .indicator {
    position: absolute;
    z-index: var(--zIndex);
    border: 2px solid var(--color);
    pointer-events: none;
    border-top-right-radius: 4px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  .indicator.flipped {
    border-top-left-radius: 4px;
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
  .text.flipped {
    border-top-left-radius: 4px;
    transform: translateY(0%);
    top: -2px;
  }
</style>
