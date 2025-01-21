<script>
  import { CoreDatePicker } from "@budibase/bbui"
  import Field from "./Field.svelte"

  export let field
  export let label
  export let placeholder
  export let disabled = false
  export let readonly = false
  export let enableTime = true
  export let timeOnly = false
  export let time24hr = false
  export let ignoreTimezones = false
  export let validation
  export let defaultValue
  export let onChange
  export let span
  export let helpText = null
  export let valueAsTimestamp = false

  let fieldState
  let fieldApi

  const handleChange = e => {
    let value = e.detail
    if (timeOnly && valueAsTimestamp) {
      if (!isValidDate(value)) {
        // Handle time only fields that are timestamps under the hood
        value = timeToDateISOString(value)
      }
    }

    const changed = fieldApi.setValue(value)
    if (onChange && changed) {
      onChange({ value })
    }
  }

  const isValidDate = value => !isNaN(new Date(value))

  const timeToDateISOString = value => {
    let [hours, minutes] = value.split(":").map(Number)

    const date = new Date()
    date.setHours(hours)
    date.setMinutes(minutes)
    date.setSeconds(0)
    date.setMilliseconds(0)
    return date.toISOString()
  }
</script>

<Field
  {label}
  {field}
  {disabled}
  {readonly}
  {validation}
  {defaultValue}
  {span}
  {helpText}
  type="datetime"
  bind:fieldState
  bind:fieldApi
>
  {#if fieldState}
    <CoreDatePicker
      value={fieldState.value}
      on:change={handleChange}
      disabled={fieldState.disabled}
      readonly={fieldState.readonly}
      error={fieldState.error}
      id={fieldState.fieldId}
      {enableTime}
      {timeOnly}
      {time24hr}
      {ignoreTimezones}
      {placeholder}
    />
  {/if}
</Field>
