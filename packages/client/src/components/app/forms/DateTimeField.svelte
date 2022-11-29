<script>
  import { CoreDatePicker } from "@budibase/bbui"
  import Field from "./Field.svelte"

  export let field
  export let label
  export let placeholder
  export let disabled = false
  export let enableTime = true
  export let timeOnly = false
  export let time24hr = false
  export let ignoreTimezones = false
  export let validation
  export let defaultValue
  export let onChange

  let fieldState
  let fieldApi

  const handleChange = e => {
    const changed = fieldApi.setValue(e.detail)
    if (onChange && changed) {
      onChange({ value: e.detail })
    }
  }
</script>

<Field
  {label}
  {field}
  {disabled}
  {validation}
  {defaultValue}
  type="datetime"
  bind:fieldState
  bind:fieldApi
>
  {#if fieldState}
    <CoreDatePicker
      value={fieldState.value}
      on:change={handleChange}
      disabled={fieldState.disabled}
      error={fieldState.error}
      id={fieldState.fieldId}
      appendTo={document.getElementById("flatpickr-root")}
      {enableTime}
      {timeOnly}
      {time24hr}
      {ignoreTimezones}
      {placeholder}
    />
  {/if}
</Field>
