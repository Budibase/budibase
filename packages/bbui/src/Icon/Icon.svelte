<script>
  import {
    default as AbsTooltip,
    TooltipPosition,
    TooltipType,
  } from "../Tooltip/AbsTooltip.svelte"

  export let name = "Add"
  export let hidden = false
  export let size = "M"
  export let hoverable = false
  export let disabled = false
  export let color = undefined
  export let hoverColor = undefined
  export let tooltip = undefined
  export let tooltipPosition = TooltipPosition.Bottom
  export let tooltipType = TooltipType.Default
  export let tooltipColor = undefined
  export let tooltipWrap = true
  export let newStyles = false
</script>

<AbsTooltip
  text={tooltip}
  type={tooltipType}
  position={tooltipPosition}
  color={tooltipColor}
  noWrap={tooltipWrap}
>
  <div class="icon" class:newStyles>
    <svg
      on:contextmenu
      on:click
      class:hoverable
      class:disabled
      class="spectrum-Icon spectrum-Icon--size{size}"
      focusable="false"
      aria-hidden={hidden}
      aria-label={name}
      style={`${color ? `color: ${color};` : ""} ${
        hoverColor
          ? `--hover-color: ${hoverColor}`
          : "--hover-color: var(--spectrum-alias-icon-color-selected-hover)"
      }`}
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

  .tooltip {
    position: absolute;
    pointer-events: none;
    left: 50%;
    bottom: calc(100% + 4px);
    transform: translateX(-50%);
    text-align: center;
    z-index: 1;
  }

  .spectrum-Icon--sizeXS {
    width: var(--spectrum-global-dimension-size-150);
    height: var(--spectrum-global-dimension-size-150);
  }
</style>
