<script lang="ts">
  import AbsTooltip from "../Tooltip/AbsTooltip.svelte"
  import { TooltipPosition, TooltipType } from "../constants"

  export let name: string = "Add"
  export let size: "XS" | "S" | "M" | "L" | "XL" | "Custom" = "M"
  export let hidden: boolean = false
  export let hoverable: boolean = false
  export let disabled: boolean = false
  export let color: string | undefined = undefined
  export let hoverColor: string | undefined = undefined
  export let tooltip: string | undefined = undefined
  export let tooltipPosition: TooltipPosition = TooltipPosition.Bottom
  export let tooltipType = TooltipType.Default
  export let tooltipColor: string | undefined = undefined
  export let tooltipWrap: boolean = true
  export let newStyles: boolean = false
  export let customSize: number | undefined = undefined
</script>

<AbsTooltip
  text={tooltip}
  type={tooltipType}
  position={tooltipPosition}
  color={tooltipColor}
  noWrap={tooltipWrap}
>
  <div class="icon" class:newStyles>
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
    <svg
      on:contextmenu
      on:click
      on:mouseover
      on:mouseleave
      class:hoverable
      class:disabled
      class="spectrum-Icon spectrum-Icon--size{size}"
      focusable="false"
      aria-hidden={hidden}
      aria-label={name}
      style={`${color ? `color: ${color};` : ""} 
      ${
        hoverColor
          ? `--hover-color: ${hoverColor}`
          : "--hover-color: var(--spectrum-alias-icon-color-selected-hover)"
      }; 
      ${customSize ? `width: ${customSize}px; height: ${customSize}px;` : ""}`}
    >
      <use
        style="pointer-events: none;"
        xlink:href="#spectrum-icon-18-{name}"
      />
    </svg>
  </div>
</AbsTooltip>

<style>
  .icon {
    position: relative;
    display: grid;
    place-items: center;
  }
  .newStyles {
    color: var(--spectrum-global-color-gray-700);
  }
  svg {
    transition: color var(--spectrum-global-animation-duration-100, 130ms);
  }
  svg.hoverable {
    pointer-events: all;
  }
  svg.hoverable:hover {
    color: var(--hover-color) !important;
    cursor: pointer;
  }
  svg.hoverable:active {
    color: var(--spectrum-global-color-blue-400) !important;
  }
  .newStyles svg.hoverable:hover,
  .newStyles svg.hoverable:active {
    color: var(--spectrum-global-color-gray-900) !important;
  }
  svg.disabled {
    color: var(--spectrum-global-color-gray-500) !important;
    pointer-events: none !important;
  }
  .spectrum-Icon--sizeXS {
    width: var(--spectrum-global-dimension-size-150);
    height: var(--spectrum-global-dimension-size-150);
  }
</style>
