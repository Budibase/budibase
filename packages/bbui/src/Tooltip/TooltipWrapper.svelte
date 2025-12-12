<script lang="ts">
  import Icon from "../Icon/Icon.svelte"
  import AbsTooltip from "./AbsTooltip.svelte"
  import type { TooltipPosition } from "../constants"

  export let tooltip: string = ""
  export let size: "S" | "M" | "L" = "M"
  export let disabled: boolean = false
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
          <Icon name="info" size="S" hoverable {disabled} />
        </div>
      </AbsTooltip>
    </div>
  {/if}
</div>

<style>
  .container {
    display: flex;
    align-items: baseline;
  }
  .icon-container {
    position: relative;
    display: flex;
    justify-content: center;
    margin-left: 5px;
    margin-right: 5px;
    color: var(--spectrum-fieldlabel-text-color, inherit);
  }
  .icon {
    transform: scale(0.75);
  }
  .icon-small {
    margin-top: -2px;
  }
  .icon-container :global(i.disabled) {
    color: var(--spectrum-global-color-gray-700);
  }
</style>
