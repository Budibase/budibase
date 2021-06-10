<script>
  import { fade } from "svelte/transition"

  export let top
  export let left
  export let width
  export let height
  export let text
  export let color
  export let transition = false
</script>

<div
  in:fade={{ delay: transition ? 65 : 0, duration: transition ? 130 : 0 }}
  class="indicator"
  style="top: {top}px; left: {left}px; width: {width}px; height: {height}px; --color: {color};"
>
  {#if text}
    <div class="text" class:flipped={top < 22}>
      {text}
    </div>
  {/if}
</div>

<style>
  .indicator {
    position: absolute;
    z-index: 910;
    border: 2px solid var(--color);
    pointer-events: none;
    border-radius: 4px;
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
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
    white-space: nowrap;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .flipped {
    border-top-left-radius: 0;
    transform: translateY(0%);
    top: -2px;
  }
</style>
