<script>
  import { CoreSelect, RadioGroup } from "@budibase/bbui"
  import Field from "./Field.svelte"

  export let field
  export let label
  export let placeholder
  export let disabled = false
  export let optionsType = "select"
  export let validation
  export let defaultValue

  let fieldState
  let fieldApi
  let fieldSchema
</script>

<Field
  {field}
  {label}
  {disabled}
  {validation}
  {defaultValue}
  type="options"
  bind:fieldState
  bind:fieldApi
  bind:fieldSchema
>
  {#if fieldState}
    {#if optionsType === "select"}
      <CoreSelect
        value={$fieldState.value}
        id={$fieldState.fieldId}
        disabled={$fieldState.disabled}
        error={$fieldState.error}
        options={fieldSchema?.constraints?.inclusion ?? []}
        {placeholder}
        on:change={e => fieldApi.setValue(e.detail)}
      />
    {:else if optionsType === "radio"}
      <RadioGroup
        value={$fieldState.value}
        id={$fieldState.fieldId}
        disabled={$fieldState.disabled}
        error={$fieldState.error}
        options={fieldSchema?.constraints?.inclusion ?? []}
        on:change={e => fieldApi.setValue(e.detail)}
      />
    {/if}
  {/if}
</Field>
