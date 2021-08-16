<script>
  import { CoreSelect, RadioGroup } from "@budibase/bbui"
  import Field from "./Field.svelte"

  export let field
  export let label
  export let placeholder
  export let disabled = false
  export let optionsType = "select"
  export let defaultValue
  export let optionsSource = "schema"
  export let dataProvider
  export let labelColumn
  export let valueColumn

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

    return []
  }
</script>

<Field
  {field}
  {label}
  {disabled}
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
        {options}
        {placeholder}
        on:change={e => fieldApi.setValue(e.detail)}
        getOptionLabel={flatOptions ? x => x : x => x.label}
        getOptionValue={flatOptions ? x => x : x => x.value}
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
