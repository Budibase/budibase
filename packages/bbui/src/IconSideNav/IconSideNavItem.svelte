<script>
  import Icon from "../Icon/Icon.svelte"
  import Tooltip from "../Tooltip/Tooltip.svelte"
  import { fade } from "svelte/transition"

  export let icon
  export let active = false
  export let tooltip

  let showTooltip = false
</script>

<div
  class="icon-side-nav-item"
  class:active
  on:mouseover={() => (showTooltip = true)}
  on:focus={() => (showTooltip = true)}
  on:mouseleave={() => (showTooltip = false)}
  on:click
>
  <Icon name={icon} hoverable />
  {#if tooltip && showTooltip}
    <div class="tooltip" in:fade={{ duration: 130, delay: 250 }}>
      <Tooltip textWrapping direction="right" text={tooltip} />
    </div>
  {/if}
</div>

<style>
  .icon-side-nav-item {
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    border-radius: 4px;
    position: relative;
    cursor: pointer;
    transition: background 130ms ease-out;
  }
  .icon-side-nav-item:hover :global(svg),
  .active :global(svg) {
    color: var(--spectrum-global-color-gray-900);
  }
  .active {
    background: var(--spectrum-global-color-gray-300);
  }
  .tooltip {
    position: absolute;
    pointer-events: none;
    left: calc(100% - 4px);
    top: 50%;
    white-space: nowrap;
    transform: translateY(-50%);
    z-index: 1;
  }
</style>
