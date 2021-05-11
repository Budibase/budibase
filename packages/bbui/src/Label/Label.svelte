<script>
  import "@spectrum-css/fieldlabel/dist/index-vars.css"

  export let size = "M"
</script>

<label class={`spectrum-FieldLabel spectrum-FieldLabel--size${size}`}>
  <slot />
</label>

<style>
  label {
    padding: 0;
    white-space: nowrap;
  }
</style>
