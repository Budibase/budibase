<script lang="ts">
  import Icon from "./Icon.svelte"
  import Tooltip from "../Tooltip/Tooltip.svelte"
  import { fade } from "svelte/transition"

  export let icon: string | undefined = undefined
  export let background: string | undefined = undefined
  export let color: string | undefined = undefined
  export let size: "XS" | "S" | "M" | "L" = "M"
  export let tooltip: string | undefined = undefined

  let showTooltip: boolean = false
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
  <Icon name={icon} color={background ? "white" : color} {size} />
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
  .icon.size--XS {
    width: 18px;
    height: 18px;
    flex: 0 0 18px;
  }
  .icon.size--S {
    width: 22px;
    height: 22px;
    flex: 0 0 22px;
  }
  .icon.size--L {
    width: 40px;
    height: 40px;
    flex: 0 0 40px;
  }
  .tooltip {
    position: absolute;
    pointer-events: none;
    left: calc(50% + 8px);
    bottom: calc(-50% + 6px);
    text-align: center;
    z-index: 1;
  }
</style>
