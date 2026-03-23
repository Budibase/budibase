<script lang="ts">
  import TooltipWrapper from "../Tooltip/TooltipWrapper.svelte"
  import type { LabelPosition } from "../types"

  import "@spectrum-css/fieldlabel/dist/index-vars.css"

  export let forId: string | undefined = undefined
  export let label: string
  export let position: LabelPosition = "above"
  export let tooltip: string = ""
  export let required: boolean = false

  $: className = position === "above" ? "" : `spectrum-FieldLabel--${position}`
</script>

<TooltipWrapper {tooltip} size="S">
  <label
    for={forId}
    class={`spectrum-FieldLabel spectrum-FieldLabel--sizeM spectrum-Form-itemLabel ${className}`}
  >
    {label || ""}
    {#if required}
      <sup class="required-asterisk">*</sup>
    {/if}
  </label>
</TooltipWrapper>

<style>
  label {
    white-space: nowrap;
  }

  .spectrum-FieldLabel--right,
  .spectrum-FieldLabel--left {
    padding-right: var(--spectrum-global-dimension-size-200);
  }
  .required-asterisk {
    color: var(--spectrum-global-color-red-500);
    margin-left: -2px;
  }
</style>
