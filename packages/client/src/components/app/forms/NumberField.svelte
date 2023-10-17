<script>
  import StringField from "./StringField.svelte"

  export let defaultValue

  const parseNumber = val => {
    if (val == null) {
      return null
    }
    return isNaN(val) ? null : parseFloat(val)
  }
</script>

<StringField
  {...$$props}
  type="number"
  defaultValue={parseNumber(defaultValue)}
/>
