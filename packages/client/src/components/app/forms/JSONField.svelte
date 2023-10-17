<script>
  import { CoreTextArea } from "@budibase/bbui"
  import Field from "./Field.svelte"
  import { getContext } from "svelte"

  export let field
  export let label
  export let placeholder
  export let disabled = false
  export let defaultValue = ""
  export let onChange

  const component = getContext("component")
  const validation = [
    {
      constraint: "json",
      type: "json",
      error: "JSON syntax is invalid",
    },
  ]
  let fieldState
  let fieldApi

  $: height = $component.styles?.normal?.height || "124px"

  const serialiseValue = value => {
    return JSON.stringify(value || undefined, null, 4) || ""
  }

  const parseValue = value => {
    try {
      return JSON.parse(value)
    } catch (error) {
      return value
    }
  }

  const handleChange = e => {
    const value = parseValue(e.detail)
    const changed = fieldApi.setValue(value)
    if (onChange && changed) {
      onChange({ value })
    }
  }
</script>

<Field
  {label}
  {field}
  {disabled}
  {validation}
  {defaultValue}
  type="json"
  bind:fieldState
  bind:fieldApi
>
  {#if fieldState}
    <div style="--height: {height};">
      <CoreTextArea
        value={serialiseValue(fieldState.value)}
        on:change={handleChange}
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
  :global(
      .spectrum-Form--labelsAbove
        .spectrum-Form-itemField
        .spectrum-Textfield--multiline
    ) {
    min-height: calc(var(--height) - 24px);
  }
</style>
