<script>
  import { CoreTextArea } from "@budibase/bbui"
  import Field from "./Field.svelte"

  export let field
  export let label
  export let placeholder
  export let disabled = false

  let fieldState
  let fieldApi
</script>

<Field
  {label}
  {field}
  {disabled}
  type="longform"
  bind:fieldState
  bind:fieldApi
  defaultValue="">
  {#if fieldState}
    <CoreTextArea
      value={$fieldState.value}
      on:change={e => fieldApi.setValue(e.detail)}
      updateOnChange={false}
      disabled={$fieldState.disabled}
      error={$fieldState.error}
      id={$fieldState.fieldId}
      {placeholder} />
  {/if}
</Field>
