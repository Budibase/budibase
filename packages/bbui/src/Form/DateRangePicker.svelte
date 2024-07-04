<script>
import { createEventDispatcher } from "svelte"
import DateRangePicker from "./Core/DateRangePicker.svelte"
import Field from "./Field.svelte"

export let value = null
export let label = null
export let labelPosition = "above"
export let disabled = false
export let readonly = false
export let error = null
export let helpText = null
export let appendTo = undefined
export let ignoreTimezones = false

const dispatch = createEventDispatcher()

const onChange = e => {
  value = e.detail
  dispatch("change", e.detail)
}
</script>

<Field {helpText} {label} {labelPosition} {error}>
  <DateRangePicker
    {error}
    {disabled}
    {readonly}
    {value}
    {appendTo}
    {ignoreTimezones}
    on:change={onChange}
  />
</Field>
