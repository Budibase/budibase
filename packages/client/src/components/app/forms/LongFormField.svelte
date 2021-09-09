<script>
  import { CoreTextArea } from "@budibase/bbui"
  import Field from "./Field.svelte"

  export let field
  export let label
  export let placeholder
  export let disabled = false
  export let validation
  export let defaultValue = ""

  let fieldState
  let fieldApi
</script>

<Field
  {label}
  {field}
  {disabled}
  {validation}
  {defaultValue}
  type="longform"
  bind:fieldState
  bind:fieldApi
>
  {#if fieldState}
    <CoreTextArea
      value={fieldState.value}
      on:change={e => fieldApi.setValue(e.detail)}
      disabled={fieldState.disabled}
      error={fieldState.error}
      id={fieldState.fieldId}
      {placeholder}
    />
  {/if}
</Field>
