<script lang="ts">
  import AbsTooltip from "../Tooltip/AbsTooltip.svelte"
  import { TooltipPosition, TooltipType } from "../constants"
  import { getPhosphorIcon, isSpectrumIcon } from "../helpers"

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

  $: fontSize = sizeMap[size]
  $: phosphorIconName = getPhosphorIcon(name)
  $: phosphorClass = `ph ph-${weight} ph-${phosphorIconName}`
  $: legacy = name !== phosphorIconName
  $: {
    if (legacy) {
      console.error(
        "[Spectrum > Phosphor]: need to migrate",
        name,
        "to",
        phosphorIconName
      )
    }
  }
</script>

<AbsTooltip
  text={tooltip}
  type={tooltipType}
  position={tooltipPosition}
  color={tooltipColor}
  noWrap={tooltipWrap}
>
  <div class="icon" class:legacy>
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
    <i
      on:contextmenu
      on:click
      on:mouseover
      on:mouseleave
      class:hoverable
      class:disabled
      class={phosphorClass}
      style={`--size:${fontSize}; --color:${color}; --hover-color: ${hoverColor}`}
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
  .icon.legacy {
    border: 1px solid red;
  }
  i {
    color: var(--color, var(--spectrum-global-color-gray-700));
    transition: color 130ms ease-out;
  }
  i.hoverable {
    pointer-events: all;
  }
  i.hoverable:hover {
    color: var(--hover-color, var(--spectrum-global-color-gray-900));
    cursor: pointer;
  }
  i.hoverable:active {
    color: var(--spectrum-global-color-gray-900);
  }
  i.disabled {
    color: var(--spectrum-global-color-gray-500);
    pointer-events: none;
  }
</style>
