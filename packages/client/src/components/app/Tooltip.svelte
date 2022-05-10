<!-- Based on https://github.com/Abreu00/svelte-tooltip -->
<script>
  export let tip
  export let direction
  export let color = "var(--spectrum-global-color-gray-200)"
  export let textColor = "var(--spectrum-global-color-gray-800)"
</script>

<div class="tooltip-wrapper" style="--text-color:{textColor}">
  <span class="tooltip-slot">
    <slot />
  </span>
  <div class="tooltip {direction}">
    {#if tip}
      <div class="default-tip" style="--background-color:{color}">{tip}</div>
    {/if}
  </div>
</div>

<style>
  .tooltip-wrapper {
    position: relative;
    display: inline-block;
    color: var(--text-color);
  }
  .tooltip {
    position: absolute;
    font-family: inherit;
    display: inline-block;
    white-space: nowrap;
    color: inherit;
    opacity: 0;
    visibility: hidden;
    transition: opacity 150ms, visibility 150ms;
  }

  .default-tip {
    display: inline-block;
    padding: 8px 16px;
    border-radius: 6px;
    color: inherit;
    background-color: var(--background-color);
  }

  .tooltip.top {
    left: 50%;
    transform: translate(-50%, -100%);
    margin-top: -8px;
  }

  .tooltip.bottom {
    left: 50%;
    bottom: 0;
    transform: translate(-50%, 100%);
    margin-bottom: -8px;
  }

  .tooltip.left {
    left: 0;
    transform: translateX(-100%);
    margin-left: -8px;
  }

  .tooltip.right {
    right: 0;
    transform: translateX(100%);
    margin-right: -8px;
  }

  .tooltip-slot:hover + .tooltip {
    opacity: 1;
    visibility: initial;
  }
</style>
