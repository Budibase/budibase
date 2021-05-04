<script>
  import Field from "./Field.svelte"
  import DatePicker from "./Core/DatePicker.svelte"
  import { createEventDispatcher } from "svelte"

  export let value = null
  export let label = null
  export let labelPosition = "above"
  export let disabled = false
  export let error = null
  export let enableTime = true
  export let placeholder = null

  const dispatch = createEventDispatcher()
  const onChange = e => {
    value = e.detail
    dispatch("change", e.detail)
  }
</script>

<Field {label} {labelPosition} {disabled} {error}>
  <DatePicker
    {error}
    {disabled}
    {value}
    {placeholder}
    {enableTime}
    on:change={onChange}
  />
</Field>
