<script>
  import { CoreTextField } from "@budibase/bbui"
  import Field from "./Field.svelte"
  import currency from "currency.js"

  export let field
  export let label
  export let placeholder
  export let type = "text"
  export let disabled = false
  export let validation
  export let defaultValue = ""
  export let align
  export let onChange

  let fieldState
  let fieldApi

  const handleChange = e => {
    fieldApi.setValue(e.detail)
    if (onChange) {
      onChange({ value: e.detail })
    }
  }

  const isCurrency = val => {
    return type === "number" && typeof val === "string"
  }
</script>

<Field
  {label}
  {field}
  {disabled}
  {validation}
  {defaultValue}
  {onChange}
  type={type === "number" ? "number" : "string"}
  bind:fieldState
  bind:fieldApi
>
  {#if fieldState}
    <CoreTextField
      updateOnChange={false}
      value={isCurrency(fieldState.value)
        ? currency(fieldState.value).value
        : fieldState.value}
      on:change={handleChange}
      disabled={fieldState.disabled}
      error={fieldState.error}
      id={fieldState.fieldId}
      {placeholder}
      {type}
      {align}
    />
  {/if}
</Field>
