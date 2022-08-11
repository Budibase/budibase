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
  export let timeOnly = false
  export let time24hr = false
  export let placeholder = null
  export let appendTo = undefined
  export let ignoreTimezones = false

  const dispatch = createEventDispatcher()

  const onChange = e => {
    value = e.detail
    dispatch("change", e.detail)
  }
</script>

<Field {label} {labelPosition} {error}>
  <DatePicker
    {error}
    {disabled}
    {value}
    {placeholder}
    {enableTime}
    {timeOnly}
    {time24hr}
    {appendTo}
    {ignoreTimezones}
    on:change={onChange}
  />
</Field>
