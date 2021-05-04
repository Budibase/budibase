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
  bind:fieldSchema
>
  {#if fieldState}
    <CoreSelect
      value={$fieldState.value}
      id={$fieldState.fieldId}
      disabled={$fieldState.disabled}
      error={$fieldState.error}
      options={fieldSchema?.constraints?.inclusion ?? []}
      {placeholder}
<<<<<<< HEAD
      on:change={(e) => fieldApi.setValue(e.detail)}
=======
      on:change={e => fieldApi.setValue(e.detail)}
>>>>>>> 900637c221e4034babd21d69dcaa71b360a2adb2
    />
  {/if}
</Field>
