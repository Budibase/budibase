<script>
  import Field from "./Field.svelte"
  import DatePicker from "./Core/DatePicker.svelte"

  export let value = null
  export let label = null
  export let labelPosition = "above"
  export let disabled = false
  export let error = null
  export let enableTime = true
  export let placeholder = null
  export let appendTo = undefined
</script>

<Field {label} {labelPosition} {error}>
  <DatePicker
    {error}
    {disabled}
    {value}
    {placeholder}
    {enableTime}
    {appendTo}
    on:change
  />
</Field>
