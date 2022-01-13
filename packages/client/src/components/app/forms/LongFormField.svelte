<script>
  import { CoreTextArea } from "@budibase/bbui"
  import Field from "./Field.svelte"
  import { getContext } from "svelte"

  export let field
  export let label
  export let placeholder
  export let disabled = false
  export let validation
  export let defaultValue = ""

  let fieldState
  let fieldApi

  const component = getContext("component")
  $: height = $component.styles?.normal?.height || "124px"
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
    <div style="--height: {height};">
      <CoreTextArea
        value={fieldState.value}
        on:change={e => fieldApi.setValue(e.detail)}
        disabled={fieldState.disabled}
        error={fieldState.error}
        id={fieldState.fieldId}
        {placeholder}
      />
    </div>
  {/if}
</Field>

<style>
  :global(.spectrum-Form-itemField .spectrum-Textfield--multiline) {
    min-height: calc(var(--height) - 24px);
  }
  :global(.spectrum-Form--labelsAbove
      .spectrum-Form-itemField
      .spectrum-Textfield--multiline) {
    min-height: calc(var(--height) - 24px);
  }
</style>
