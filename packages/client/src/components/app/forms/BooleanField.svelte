<script>
  import { CoreCheckbox } from "@budibase/bbui"
  import Field from "./Field.svelte"

  export let field
  export let label
  export let text
  export let disabled = false
  export let readonly = false
  export let size
  export let validation
  export let defaultValue
  export let onChange
  export let span
  export let helpText = null

  let fieldState
  let fieldApi

  const isTruthy = value => {
    if (!value) {
      return false
    }
    if (value === true) {
      return true
    }
    if (typeof value === "string" && value.toLowerCase() === "true") {
      return true
    }
    return false
  }

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
  {readonly}
  {validation}
  {span}
  {helpText}
  defaultValue={isTruthy(defaultValue)}
  type="boolean"
  bind:fieldState
  bind:fieldApi
>
  {#if fieldState}
    <CoreCheckbox
      value={fieldState.value}
      disabled={fieldState.disabled}
      readonly={fieldState.readonly}
      error={fieldState.error}
      id={fieldState.fieldId}
      {size}
      {text}
      on:change={handleChange}
    />
  {/if}
</Field>
