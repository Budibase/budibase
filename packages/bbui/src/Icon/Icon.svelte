<script lang="ts">
  import AbsTooltip from "../Tooltip/AbsTooltip.svelte"
  import { TooltipPosition, TooltipType } from "../constants"
  import InnerIcon from "./InnerIcon.svelte"

  export let size: "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL" = "M"
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
  export let weight: "regular" | "bold" | "fill" = "regular"
</script>

{#if tooltip}
  <AbsTooltip
    text={tooltip}
    type={tooltipType}
    position={tooltipPosition}
    color={tooltipColor}
    noWrap={tooltipWrap}
  >
    <InnerIcon
      on:contextmenu
      on:click
      on:mouseover
      on:mouseleave
      on:focus
      {size}
      {name}
      {hidden}
      {hoverable}
      {disabled}
      {color}
      {hoverColor}
      {weight}
    />
  </AbsTooltip>
{:else}
  <InnerIcon
    on:contextmenu
    on:click
    on:mouseover
    on:mouseleave
    on:focus
    {size}
    {name}
    {hidden}
    {hoverable}
    {disabled}
    {color}
    {hoverColor}
    {weight}
  />
{/if}
