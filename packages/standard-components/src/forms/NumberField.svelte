<script>
  import StringField from "./StringField.svelte"

  export let defaultValue
</script>

<StringField
  {...$$props}
  type="number"
  defaultValue={isNaN(defaultValue) ? null : parseFloat(defaultValue)}
/>
