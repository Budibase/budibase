<script>
  import { TextField } from "@budibase/bbui/internal"
  import Field from "./Field.svelte"

  export let field
  export let label
  export let placeholder
  export let type = "text"
  export let disabled = false

  let fieldState
  let fieldApi
</script>

<Field
  {label}
  {field}
  {disabled}
  type={type === 'number' ? 'number' : 'string'}
  bind:fieldState
  bind:fieldApi>
  {#if fieldState}
    <TextField
      value={$fieldState.value}
      on:change={e => fieldApi.setValue(e.detail)}
      disabled={$fieldState.disabled}
      error={$fieldState.error}
      id={$fieldState.fieldId}
      {placeholder}
      {type} />
  {/if}
</Field>
