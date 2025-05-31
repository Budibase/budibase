<script lang="ts">
  import AbsTooltip from "../Tooltip/AbsTooltip.svelte"
  import { TooltipPosition, TooltipType } from "../constants"
  import { getPhosphorIcon } from "../helpers"

  export let size: "XS" | "S" | "M" | "L" | "XL" | "XXL" | "Custom" = "M"
  export let name: string = "plus"
  export let hidden: boolean = false
  export let hoverable: boolean = false
  export let disabled: boolean = false
  export let color: string | undefined = undefined
  export let hoverColor: string | undefined = undefined
  export let tooltip: string | undefined = undefined
  export let tooltipPosition: TooltipPosition = TooltipPosition.Bottom
  export let tooltipType: TooltipType = TooltipType.Default
  export let tooltipColor: string | undefined = undefined
  export let tooltipWrap: boolean = true
  export let newStyles: boolean = false
  export let customSize: number | undefined = undefined
  export let weight:
    | "thin"
    | "light"
    | "regular"
    | "bold"
    | "fill"
    | "duotone" = "regular"

  const sizeMap = {
    XS: "0.75rem",
    S: "1rem",
    M: "1.25rem",
    L: "1.5rem",
    XL: "2rem",
    XXL: "2.5rem",
    Custom: customSize ? `${customSize}px` : "1.25rem",
  }

  const fontSize = sizeMap[size]

  $: phosphorIconName = getPhosphorIcon(name)

  $: phosphorClass =
    weight === "regular"
      ? `ph ph-${phosphorIconName}`
      : `ph-${weight} ph-${phosphorIconName}`
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
    <i
      on:contextmenu
      on:click
      on:mouseover
      on:mouseleave
      class:hoverable
      class:disabled
      class="{phosphorClass} spectrum-Icon spectrum-Icon--size{size}"
      style={`font-size: ${fontSize}; ${color ? `color: ${color};` : ""} 
      ${
        hoverColor
          ? `--hover-color: ${hoverColor}`
          : "--hover-color: var(--spectrum-alias-icon-color-selected-hover)"
      }; 
      line-height: 1; vertical-align: middle;`}
      aria-hidden={hidden ? "true" : "false"}
      aria-label={tooltip || name}
      title={tooltip}
    />
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
  i {
    transition: color var(--spectrum-global-animation-duration-100, 130ms);
  }
  i.hoverable {
    pointer-events: all;
  }
  i.hoverable:hover {
    color: var(--hover-color) !important;
    cursor: pointer;
  }
  i.hoverable:active {
    color: var(--spectrum-global-color-blue-400) !important;
  }
  .newStyles i.hoverable:hover,
  .newStyles i.hoverable:active {
    color: var(--spectrum-global-color-gray-900) !important;
  }
  i.disabled {
    color: var(--spectrum-global-color-gray-500) !important;
    pointer-events: none !important;
  }
  /* Keep the original size classes for compatibility but make them control font-size */
  .spectrum-Icon--sizeXS {
    font-size: 0.75rem;
  }
  .spectrum-Icon--sizeS {
    font-size: 1rem;
  }
  .spectrum-Icon--sizeM {
    font-size: 1.25rem;
  }
  .spectrum-Icon--sizeL {
    font-size: 1.5rem;
  }
  .spectrum-Icon--sizeXL {
    font-size: 2rem;
  }
  .spectrum-Icon--sizeXXL {
    font-size: 2.5rem;
  }
</style>
