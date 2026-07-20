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
        <div class="icon" on:focus>
          <Icon name="info" {size} {disabled} hoverable />
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
</style>
