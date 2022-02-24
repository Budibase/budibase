<script>
  import "@spectrum-css/fieldlabel/dist/index-vars.css"
  import TooltipWrapper from "../Tooltip/TooltipWrapper.svelte"

  export let size = "M"
  export let tooltip = ""
</script>

<TooltipWrapper {tooltip} {size}>
  <label for="" class={`spectrum-FieldLabel spectrum-FieldLabel--size${size}`}>
    <slot />
  </label>
</TooltipWrapper>

<style>
  label {
    padding: 0;
    white-space: nowrap;
  }
</style>
