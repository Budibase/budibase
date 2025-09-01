<script lang="ts">
  import Icon from "../Icon/Icon.svelte"
  import AbsTooltip from "./AbsTooltip.svelte"
  import type { TooltipPosition } from "../constants"

  export let tooltip: string = ""
  export let size: "S" | "M" | "L" = "M"
  export let disabled: boolean = true
  export let position: TooltipPosition | undefined = undefined
</script>

<div class:container={!!tooltip}>
  <slot />
  {#if tooltip}
    <div class="icon-container">
      <AbsTooltip text={tooltip} {position}>
        <div
          class="icon"
          class:icon-small={size === "M" || size === "S"}
          on:focus
        >
          <Icon name="info" size="S" {disabled} hoverable />
        </div>
      </AbsTooltip>
    </div>
  {/if}
</div>

<style>
  .container {
    display: flex;
    align-items: center;
  }
  .icon-container {
    position: relative;
    display: flex;
    justify-content: center;
    margin-left: 5px;
    margin-right: 5px;
  }
  .icon {
    transform: scale(0.75);
  }
  .icon-small {
    margin-bottom: -2px;
  }
</style>
