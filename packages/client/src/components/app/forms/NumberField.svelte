<script>
  import StringField from "./StringField.svelte"
  import currency from "currency.js"

  export let defaultValue

  const parseNumber = val => {
    if (val == null) {
      return null
    }
    if (typeof val === "string") {
      return currency(val).value
    }
    return isNaN(val) ? null : parseFloat(val)
  }
</script>

<StringField
  {...$$props}
  type="number"
  defaultValue={parseNumber(defaultValue)}
/>
