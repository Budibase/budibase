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
  export let range = false
  const dispatch = createEventDispatcher()

  const onChange = e => {
    if (range) {
      // Flatpickr cant take two dates and work out what to display, needs to be provided a string.
      // Like - "Date1 to Date2". Hence passing in that specifically from the array
      value = e?.detail[1]
    } else {
      value = e.detail
    }
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
    {range}
    on:change={onChange}
  />
</Field>
