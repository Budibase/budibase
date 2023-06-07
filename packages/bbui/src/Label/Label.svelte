<script>
  import "@spectrum-css/fieldlabel/dist/index-vars.css"
  import TooltipWrapper from "../Tooltip/TooltipWrapper.svelte"

  export let size = "M"
  export let tooltip = ""
  export let muted
</script>

<TooltipWrapper {tooltip} {size}>
  <label
    data-testid="label"
    class:muted
    for=""
    class={`spectrum-FieldLabel spectrum-FieldLabel--size${size}`}
  >
    <slot />
  </label>
</TooltipWrapper>

<style>
  label {
    padding: 0;
    white-space: nowrap;
    color: var(--spectrum-global-color-gray-700);
  }

  .muted {
    opacity: 0.5;
  }
</style>
