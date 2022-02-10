<script>
  import { CoreTextField } from "@budibase/bbui"
  import Field from "./Field.svelte"

  export let field
  export let label
  export let placeholder
  export let type = "text"
  export let disabled = false
  export let validation
  export let defaultValue = ""
  export let align

  let fieldState
  let fieldApi
</script>

<Field
  {label}
  {field}
  {disabled}
  {validation}
  {defaultValue}
  type={type === "number" ? "number" : "string"}
  bind:fieldState
  bind:fieldApi
>
  {#if fieldState}
    <CoreTextField
      updateOnChange={false}
      value={fieldState.value}
      on:change={e => fieldApi.setValue(e.detail)}
      disabled={fieldState.disabled}
      error={fieldState.error}
      id={fieldState.fieldId}
      {placeholder}
      {type}
      {align}
    />
  {/if}
</Field>
