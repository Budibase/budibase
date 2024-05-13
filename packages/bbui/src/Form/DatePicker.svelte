<script>
  import Field from "./Field.svelte"
  import DatePicker from "./Core/DatePicker/DatePicker.svelte"
  import { createEventDispatcher } from "svelte"

  export let value = null
  export let label = null
  export let labelPosition = "above"
  export let disabled = false
  export let readonly = false
  export let error = null
  export let enableTime = true
  export let timeOnly = false
  export let placeholder = null
  export let appendTo = undefined
  export let ignoreTimezones = false
  export let helpText = null

  const dispatch = createEventDispatcher()

  const onChange = e => {
    value = e.detail
    dispatch("change", e.detail)
  }
</script>

<Field {helpText} {label} {labelPosition} {error}>
  <DatePicker
    {error}
    {disabled}
    {readonly}
    {value}
    {placeholder}
    {enableTime}
    {timeOnly}
    {appendTo}
    {ignoreTimezones}
    on:change={onChange}
  />
</Field>
