<script>
  import { CoreDatePicker } from "@budibase/bbui"
  import Field from "./Field.svelte"

  export let field
  export let label
  export let placeholder
  export let disabled = false
  export let enableTime = false
  export let timeOnly = false
  export let validation
  export let defaultValue

  let fieldState
  let fieldApi
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
      on:change={e => fieldApi.setValue(e.detail)}
      disabled={fieldState.disabled}
      error={fieldState.error}
      id={fieldState.fieldId}
      appendTo={document.getElementById("flatpickr-root")}
      {enableTime}
      {timeOnly}
      {placeholder}
    />
  {/if}
</Field>
