<script>
  import { CoreSelect, CoreRadioGroup } from "@budibase/bbui"
  import Field from "./Field.svelte"

  export let field
  export let label
  export let placeholder
  export let disabled = false
  export let optionsType = "select"
  export let validation
  export let defaultValue
  export let optionsSource = "schema"
  export let dataProvider
  export let labelColumn
  export let valueColumn
  export let customOptions
  export let autocomplete = false

  let fieldState
  let fieldApi
  let fieldSchema

  $: flatOptions = optionsSource == null || optionsSource === "schema"
  $: options = getOptions(
    optionsSource,
    fieldSchema,
    dataProvider,
    labelColumn,
    valueColumn
  )

  const getOptions = (
    optionsSource,
    fieldSchema,
    dataProvider,
    labelColumn,
    valueColumn
  ) => {
    // Take options from schema
    if (optionsSource == null || optionsSource === "schema") {
      return fieldSchema?.constraints?.inclusion ?? []
    }

    // Extract options from data provider
    if (optionsSource === "provider" && valueColumn) {
      let optionsSet = {}
      dataProvider?.rows?.forEach(row => {
        const value = row?.[valueColumn]
        if (value) {
          const label = row[labelColumn] || value
          optionsSet[value] = { value, label }
        }
      })
      return Object.values(optionsSet)
    }

    // Extract custom options
    if (optionsSource === "custom" && customOptions) {
      return customOptions
    }

    return []
  }
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
    {#if !optionsType || optionsType === "select"}
      <CoreSelect
        value={fieldState.value}
        id={fieldState.fieldId}
        disabled={fieldState.disabled}
        error={fieldState.error}
        {options}
        {placeholder}
        on:change={e => fieldApi.setValue(e.detail)}
        getOptionLabel={flatOptions ? x => x : x => x.label}
        getOptionValue={flatOptions ? x => x : x => x.value}
        {autocomplete}
        sort={true}
      />
    {:else if optionsType === "radio"}
      <CoreRadioGroup
        value={fieldState.value}
        id={fieldState.fieldId}
        disabled={fieldState.disabled}
        error={fieldState.error}
        {options}
        on:change={e => fieldApi.setValue(e.detail)}
        getOptionLabel={flatOptions ? x => x : x => x.label}
        getOptionValue={flatOptions ? x => x : x => x.value}
      />
    {/if}
  {/if}
</Field>
