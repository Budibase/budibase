<script>
  import "@spectrum-css/fieldlabel/dist/index-vars.css"

  export let forId
  export let label
  export let position = "above"

  $: className = position === "above" ? "" : `spectrum-FieldLabel--${position}`
</script>

<label
  for={forId}
  class={`spectrum-FieldLabel spectrum-FieldLabel--sizeM spectrum-Form-itemLabel ${className}`}
>
  {label || ""}
</label>

<style>
  label {
    white-space: nowrap;
  }

  .spectrum-FieldLabel--right,
  .spectrum-FieldLabel--left {
    padding-right: var(--spectrum-global-dimension-size-200);
  }
</style>
