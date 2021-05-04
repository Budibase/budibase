<script>
  import { CoreCheckbox } from "@budibase/bbui"
  import Field from "./Field.svelte"

  export let field
  export let label
  export let text
  export let disabled = false

  let fieldState
  let fieldApi
</script>

<Field
  {label}
  {field}
  {disabled}
  type="boolean"
  bind:fieldState
  bind:fieldApi
  defaultValue={false}
>
  {#if fieldState}
    <CoreCheckbox
      value={$fieldState.value}
      disabled={$fieldState.disabled}
      error={$fieldState.error}
      id={$fieldState.fieldId}
<<<<<<< HEAD
      on:change={(e) => fieldApi.setValue(e.detail)}
=======
      on:change={e => fieldApi.setValue(e.detail)}
>>>>>>> 900637c221e4034babd21d69dcaa71b360a2adb2
      {text}
    />
  {/if}
</Field>
