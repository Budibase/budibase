<script>
  import Icon from "./Icon.svelte"

  import Tooltip from "../Tooltip/Tooltip.svelte"
  import { fade } from "svelte/transition"

  export let icon
  export let background
  export let color
  export let size = "M"
  export let tooltip

  let showTooltip = false
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="icon size--{size}"
  style="background: {background || `transparent`};"
  class:filled={!!background}
  on:mouseover={() => (showTooltip = true)}
  on:mouseleave={() => (showTooltip = false)}
  on:focus={() => (showTooltip = true)}
  on:blur={() => (showTooltip = false)}
  on:click={() => (showTooltip = false)}
>
  <Icon name={icon} color={background ? "white" : color} />
  {#if tooltip && showTooltip}
    <div class="tooltip" in:fade={{ duration: 130, delay: 250 }}>
      <Tooltip textWrapping direction="right" text={tooltip} />
    </div>
  {/if}
</div>

<style>
  .icon {
    position: relative;
    width: 28px;
    height: 28px;
    flex: 0 0 28px;
    display: grid;
    place-items: center;
    border-radius: 50%;
  }
  .icon :global(.spectrum-Icon) {
    width: 22px;
    height: 22px;
  }
  .icon.filled :global(.spectrum-Icon) {
    width: 16px;
    height: 16px;
  }
  .icon.size--XS {
    width: 18px;
    height: 18px;
    flex: 0 0 18px;
  }
  .icon.size--XS :global(.spectrum-Icon) {
    width: 10px;
    height: 10px;
  }
  .icon.size--S {
    width: 22px;
    height: 22px;
    flex: 0 0 22px;
  }
  .icon.size--S :global(.spectrum-Icon) {
    width: 16px;
    height: 16px;
  }
  .icon.size--S.filled :global(.spectrum-Icon) {
    width: 12px;
    height: 12px;
  }
  .icon.size--L {
    width: 40px;
    height: 40px;
    flex: 0 0 40px;
  }
  .icon.size--L :global(.spectrum-Icon) {
    width: 28px;
    height: 28px;
  }
  .icon.size--L.filled :global(.spectrum-Icon) {
    width: 22px;
    height: 22px;
  }

  .tooltip {
    position: absolute;
    pointer-events: none;
    left: calc(50% + 8px);
    bottom: calc(-50% + 6px);
    /* transform: translateY(-50%); */
    text-align: center;
    z-index: 1;
  }
</style>
