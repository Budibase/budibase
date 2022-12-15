<script>
  import { CoreDatePicker } from "@budibase/bbui"
  import { getContext } from "svelte"
  import Field from "./Field.svelte"

  export let field
  export let toField
  export let label
  export let placeholder
  export let disabled = false
  export let enableTime = true
  export let timeOnly = false
  export let time24hr = false
  export let ignoreTimezones = false
  export let range = false
  export let validation
  export let defaultValue
  export let disabledDates
  export let onChange

  let fieldState, toFieldState
  let fieldApi, toFieldApi
  let rangeValue

  const formContext = getContext("form")
  const formApi = formContext?.formApi
  $: toFormField = formApi?.registerField(toField, "datetime")
  $: toUnsubscribe = toFormField?.subscribe(value => {
    toFieldState = value?.fieldState
    toFieldApi = value?.fieldApi
  })

  const handleChange = e => {
    let fromValue, toValue
    if (Array.isArray(e.detail)) {
      rangeValue = e.detail[0]
      fromValue = rangeValue[0]
      toValue = rangeValue[1]
    } else {
      fromValue = e.detail
      toFieldApi?.deregister()
      toUnsubscribe?.()
    }
    const changed = fieldApi.setValue(fromValue)
    if (toValue) {
      toFieldApi.setValue(toValue)
    }
    if (onChange && changed) {
      onChange({ value: e.detail })
    }
  }

  const parseDisabledDates = disabledDates => {
    if (typeof disabledDates === "string") {
      return disabledDates.split(",")
    }
    return disabledDates || []
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
      value={range ? rangeValue : fieldState.value}
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
      {range}
      disabledDates={parseDisabledDates(disabledDates)}
    />
  {/if}
</Field>
