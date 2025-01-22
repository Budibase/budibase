<script lang="ts">
  import TooltipWrapper from "../Tooltip/TooltipWrapper.svelte"

  import "@spectrum-css/fieldlabel/dist/index-vars.css"

  export let forId: string | undefined = undefined
  export let label: string | undefined = undefined
  export let position = "above"
  export let tooltip = ""

  $: className = position === "above" ? "" : `spectrum-FieldLabel--${position}`
</script>

<TooltipWrapper {tooltip} size="S">
  <label
    for={forId}
    class={`spectrum-FieldLabel spectrum-FieldLabel--sizeM spectrum-Form-itemLabel ${className}`}
  >
    {label || ""}
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
</style>
