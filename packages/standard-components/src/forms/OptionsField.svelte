<script>
  import { CoreSelect } from "@budibase/bbui"
  import Field from "./Field.svelte"

  export let field
  export let label
  export let placeholder
  export let disabled = false

  let fieldState
  let fieldApi
  let fieldSchema
</script>

<Field
  {field}
  {label}
  {disabled}
  type="options"
  bind:fieldState
  bind:fieldApi
  bind:fieldSchema>
  {#if fieldState}
    <CoreSelect
      value={$fieldState.value}
      fieldId={$fieldState.fieldId}
      disabled={$fieldState.disabled}
      error={$fieldState.error}
      options={fieldSchema?.constraints?.inclusion ?? []}
      {placeholder}
      on:change={e => fieldApi.setValue(e.detail)} />
  {/if}
</Field>
